import axios from "axios";
import axiosRetry from "axios-retry";
import { createWriteStream } from "fs";
import {  mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

// Configure axios retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error) ||
      error.code === "ETIMEDOUT"
    );
  },
});

// --- PDF Extraction ---
async function extractPdfText(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", () => {
      reject(new Error("Failed to parse PDF"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }) => {
      let fullText = "";

      try {
        const firstPage = pdfData?.Pages?.[0];
        const texts = firstPage?.Texts || [];
        for (const textObj of texts) {
          for (const run of textObj.R || []) {
            if (run.T) {
              try {
                fullText += decodeURIComponent(run.T) + " ";
              } catch {
                fullText += run.T + " ";
              }
            }
          }
        }
      } catch {
        return reject(new Error("Error extracting PDF text"));
      }

      resolve(fullText.replace(/\s+/g, " ").trim());
    });

    pdfParser.loadPDF(filePath);
  });
}

// --- File Downloader with Stream ---
async function downloadFile(url: string, savePath: string, maxSizeMB = 5): Promise<void> {
  // First check file size
  const head = await axios.head(url);
  const contentLength = parseInt(head.headers["content-length"] || "0", 10);

  if (contentLength > maxSizeMB * 1024 * 1024) {
    throw new Error(`Resume too large (max ${maxSizeMB}MB allowed)`);
  }

  // Stream download
  const response = await axios.get(url, {
    responseType: "stream",
    timeout: 60000, // 60s
    headers: { "User-Agent": "Mozilla/5.0 (compatible; resume-extractor)" },
  });

  return new Promise((resolve, reject) => {
    const writer = createWriteStream(savePath);

    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// --- Main Function ---
export async function extractResumeText(key: string): Promise<string> {
  const folderPath = join(process.cwd(), "pdf");
  const fileName = key.split("/").pop() || `resume_${Date.now()}`;
  const savePath = join(folderPath, fileName);

  let text = "";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!baseUrl) {
      throw new Error("R2 public URL not configured");
    }

    const fullBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    const resumeUrl = `${fullBaseUrl}/${cleanKey}`;

    console.log("Downloading resume from:", resumeUrl);

    await mkdir(folderPath, { recursive: true });
    await downloadFile(resumeUrl, savePath);

    // Extract based on file extension
    const ext = extname(savePath).toLowerCase();
    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: savePath });
      text = result.value;
    } else if (ext === ".pdf") {
      text = await extractPdfText(savePath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }

    return text.trim();
  } catch (error) {
    console.error("Resume extraction failed:", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ETIMEDOUT") {
        throw new Error("Download timeout - file may be too large or server is slow");
      } else if (error.response?.status === 404) {
        throw new Error(`File not found at URL: ${key}`);
      } else if (error.response?.status === 403) {
        throw new Error(`Access denied to file: ${key}`);
      }
    }

    throw error;
  } finally {
    // Cleanup temp file
    try {
      await unlink(savePath);
    } catch {
      /* ignore */
    }
  }
}
