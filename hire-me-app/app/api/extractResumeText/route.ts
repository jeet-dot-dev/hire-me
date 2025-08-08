import { NextResponse } from "next/server";
import axios from "axios";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req: Request) {
  const { key } = await req.json();

  const resumeUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const arrayBuffer = response.data;

  const ext = key.split(".").pop()?.toLowerCase();
  let text = "";

  if (ext === "pdf") {
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    text = data.text.trim();
  } else if (ext === "doc" || ext === "docx") {
    const result = await mammoth.extractRawText({ arrayBuffer });
    text = result.value.trim();
  }

  return NextResponse.json({ text });
}
