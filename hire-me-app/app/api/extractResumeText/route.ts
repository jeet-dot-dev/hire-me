import { NextResponse } from "next/server";
import { extractResumeText } from "@/components/interview/functions/extractResumeText";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { error: "Missing resume key" },
        { status: 400 }
      );
    }

    const text = await extractResumeText(key);

    return NextResponse.json({ 
      text,
      success: true 
    });
  } catch (error) {
    console.error("Resume extraction API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        text: "",
        success: false 
      },
      { status: 500 }
    );
  }
}
