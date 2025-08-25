import axios from "axios";
import axiosRetry from "axios-retry";
import mammoth from "mammoth";

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

// --- PDF Extraction using pdf2json (server-compatible) ---
async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Use pdf2json which works better in Node.js environments
    const PDFParser = (await import('pdf2json')).default;
    
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData: unknown) => {
        console.error("PDF parsing error:", errData);
        reject(new Error("Failed to parse PDF. The file may be corrupted or password-protected."));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }) => {
        let fullText = "";

        try {
          // Extract text from all pages (limited to first 5)
          const pages = pdfData?.Pages || [];
          const maxPages = Math.min(pages.length, 5);
          
          for (let i = 0; i < maxPages; i++) {
            const page = pages[i];
            const texts = page?.Texts || [];
            
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
          }
        } catch (parseError) {
          console.error("Error extracting PDF text:", parseError);
          return reject(new Error("Error extracting PDF text. The file may be corrupted."));
        }

        const cleanText = fullText.replace(/\s+/g, " ").trim();
        if (!cleanText || cleanText.length < 10) {
          reject(new Error("No readable text found in PDF. The file may be image-based or corrupted."));
        } else {
          resolve(cleanText);
        }
      });

      // Convert ArrayBuffer to Buffer for pdf2json
      const buffer = Buffer.from(arrayBuffer);
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error("PDF extraction setup error:", error);
    throw new Error("Failed to initialize PDF parser. Please try with a DOCX file instead.");
  }
}

// --- Fallback PDF extraction using simple text extraction ---
async function fallbackPdfExtraction(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Simple text extraction as fallback
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(uint8Array);
    
    // Extract readable text patterns (basic approach)
    const textMatches = text.match(/[a-zA-Z0-9\s.,;:!?()[\]{}"-]+/g);
    if (textMatches) {
      const extractedText = textMatches
        .filter(match => match.trim().length > 3)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (extractedText.length > 100) {
        return extractedText;
      }
    }
    
    throw new Error("Fallback extraction failed");
  } catch {
    throw new Error("Unable to extract text from PDF using fallback method");
  }
}

// --- Download file as ArrayBuffer (no file system) ---
async function downloadFileAsBuffer(url: string, maxSizeMB = 5): Promise<ArrayBuffer> {
  try {
    // First check file size with HEAD request
    const headResponse = await axios.head(url, {
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; resume-extractor)" },
    });
    
    const contentLength = parseInt(headResponse.headers["content-length"] || "0", 10);
    
    if (contentLength > maxSizeMB * 1024 * 1024) {
      throw new Error(`Resume file is too large (${Math.round(contentLength / 1024 / 1024)}MB). Maximum allowed size is ${maxSizeMB}MB.`);
    }

    // Download the file
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 120000, // 2 minutes timeout
      headers: { "User-Agent": "Mozilla/5.0 (compatible; resume-extractor)" },
      maxContentLength: maxSizeMB * 1024 * 1024,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ETIMEDOUT") {
        throw new Error("Download timeout - file may be too large or server is slow");
      } else if (error.response?.status === 404) {
        throw new Error("Resume file not found");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied to resume file");
      } else if (error.response?.status === 413) {
        throw new Error("Resume file is too large");
      }
    }
    throw error;
  }
}

// --- Get file extension from URL ---
function getFileExtension(url: string): string {
  const path = url.split("?")[0]; // Remove query parameters
  const extension = path.split(".").pop()?.toLowerCase() || "";
  return extension;
}

// --- Main Function ---
export async function extractResumeText(key: string): Promise<string> {
  try {
    // Validate environment
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!baseUrl) {
      console.error("Environment check failed: R2_PUBLIC_URL not set");
      throw new Error("Configuration error: Storage URL not configured");
    }

    // Construct the full URL
    const fullBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    const resumeUrl = `${fullBaseUrl}/${cleanKey}`;

    console.log("Processing resume from:", resumeUrl.replace(/\/[^\/]*$/, '/***')); // Hide filename for privacy

    // Download file as buffer
    const arrayBuffer = await downloadFileAsBuffer(resumeUrl, 10); // Increased to 10MB limit

    // Get file extension
    const ext = getFileExtension(cleanKey);
    
    let text = "";

    if (ext === "pdf") {
      try {
        text = await extractPdfText(arrayBuffer);
      } catch (pdfError) {
        console.warn("Primary PDF extraction failed, trying fallback:", pdfError);
        try {
          text = await fallbackPdfExtraction(arrayBuffer);
          console.log("Fallback PDF extraction succeeded");
        } catch (fallbackError) {
          console.error("Both PDF extraction methods failed:", fallbackError);
          throw new Error("Unable to extract text from PDF. The file may be image-based, password-protected, or corrupted. Please try uploading a DOCX file instead.");
        }
      }
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else if (ext === "doc") {
      // For .doc files, try mammoth as well (it sometimes works)
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } catch (docError) {
        console.warn("DOC extraction failed:", docError);
        throw new Error("DOC files are not fully supported. Please upload a DOCX or PDF file instead.");
      }
    } else {
      throw new Error(`Unsupported file format: ${ext}. Supported formats: PDF, DOCX`);
    }

    // Validate extracted text
    const cleanText = text.trim();
    if (!cleanText || cleanText.length < 50) {
      console.warn("Text extraction resulted in insufficient content:", { 
        length: cleanText.length, 
        sample: cleanText.substring(0, 100) 
      });
      throw new Error("No readable text found in the resume. The file may be image-based, corrupted, or password-protected.");
    }

    // Limit text length for processing (optional)
    if (cleanText.length > 50000) {
      console.warn("Resume text truncated due to length:", cleanText.length);
      return cleanText.substring(0, 50000) + "... (truncated for processing)";
    }

    console.log("Resume extraction successful:", { 
      textLength: cleanText.length, 
      fileType: ext 
    });

    return cleanText;
  } catch (error) {
    console.error("Resume extraction failed:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      key: key.replace(/\/[^\/]*$/, '/***'), // Hide filename for privacy
      stack: error instanceof Error ? error.stack : undefined
    });

    // Re-throw with more specific error messages
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unexpected error occurred while processing your resume");
  }
}
