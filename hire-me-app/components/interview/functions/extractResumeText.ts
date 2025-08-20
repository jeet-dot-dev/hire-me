import axios from "axios";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import mammoth from "mammoth";

// Helper function to extract PDF text - temporarily disabled
async function extractPdfText(): Promise<string> {
  try {
    // Note: pdf-lib doesn't extract text directly, we need a different approach
    // For now, return a placeholder
    console.warn(
      "PDF text extraction temporarily disabled due to library issues"
    );
    return "PDF file detected - text extraction temporarily unavailable. Please upload a DOCX file for full text analysis.";
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF file");
  }
}

export async function extractResumeText(key: string): Promise<string> {
  const folderPath = join(process.cwd(), "pdf");
  let savePath = "";

  try {
    // 1. Build R2 file URL
    const resumeUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
    console.log("Downloading:", resumeUrl);

    // 2. Download file as ArrayBuffer
    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    // 3. Ensure "pdf" folder exists
    await mkdir(folderPath, { recursive: true });

    // 4. Determine file name & save path
    const fileName = key.split("/").pop() || `resume_${Date.now()}`;
    savePath = join(folderPath, fileName);

    // 5. Write file to disk
    await writeFile(savePath, Buffer.from(response.data));
    console.log("File saved to:", savePath);

    // 6. Check extension
    const ext = extname(savePath).toLowerCase();

    if (ext === ".docx") {
      // ✅ Extract text using mammoth
      const result = await mammoth.extractRawText({ path: savePath });
      return result.value.trim();
    } else if (ext === ".pdf") {
      // ⚠️ Temporarily return placeholder for PDF files
      // const dataBuffer = Buffer.from(response.data);
      const text = await extractPdfText();
      return text.trim();
    } else {
      throw new Error(
        `Unsupported file format: ${ext}. Please upload a PDF or DOCX file.`
      );
    }
  } catch (err) {
    console.error("Error extracting resume text:", err);
    throw new Error(
      `Could not extract resume: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  } finally {
    // 7. Delete file after processing
    if (savePath) {
      try {
        await unlink(savePath);
        console.log("Deleted file:", savePath);
      } catch (deleteErr) {
        console.warn("Could not delete file:", deleteErr);
      }
    }
  }
}
