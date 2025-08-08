import axios from "axios";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import mammoth from "mammoth";

export async function extractResumeText(key: string): Promise<string> {
  const folderPath = join(process.cwd(), "pdf");
  let savePath = "";

  try {
    // 1. Build R2 file URL
    const resumeUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
    console.log("Downloading:", resumeUrl);

    // 2. Download file as ArrayBuffer
    const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });

    // 3. Ensure "pdf" folder exists
    await mkdir(folderPath, { recursive: true });

    // 4. Determine file name & save path
    const fileName = key.split("/").pop() || `resume_${Date.now()}`;
    savePath = join(folderPath, fileName);

    // 5. Write file to disk
    await writeFile(savePath, Buffer.from(response.data));
    console.log("File saved to:", savePath);

    // 6. Check extension and use mammoth if .docx
    const ext = extname(savePath).toLowerCase();
    if (ext !== ".docx") {
      throw new Error(`Unsupported file format: ${ext}`);
    }

    // 7. Extract text using mammoth
    const result = await mammoth.extractRawText({ path: savePath });
    return result.value.trim();

  } catch (err) {
    console.error("Error extracting resume text:", err);
    throw new Error(
      `Could not extract resume: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  } finally {
    // 8. Delete file after processing
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
