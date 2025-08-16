// app/api/token/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-transcribe",
      // optionally: voice, language, etc.
    }),
  });

  const data = await r.json();
  return NextResponse.json(data);
}
