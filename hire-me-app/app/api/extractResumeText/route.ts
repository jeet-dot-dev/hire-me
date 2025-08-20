import { NextResponse } from "next/server";
import axios from "axios";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  const { key } = await req.json();

  const resumeUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const arrayBuffer = response.data;

  const ext = key.split(".").pop()?.toLowerCase();
  let text = "";

  if (ext === "pdf") {
    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Note: pdf-lib doesn't have built-in text extraction
      // This is a basic implementation - for better text extraction,
      // you might want to use pdfjs-dist or another library
      text = `PDF loaded successfully with ${pages.length} pages. Text extraction requires additional setup.`;
    } catch (error) {
      console.error("PDF processing error:", error);
      return NextResponse.json({ 
        error: "Failed to process PDF file",
        text: "" 
      });
    }
  } else if (ext === "doc" || ext === "docx") {
    const result = await mammoth.extractRawText({ arrayBuffer });
    text = result.value.trim();
  }

  return NextResponse.json({ text });
}
