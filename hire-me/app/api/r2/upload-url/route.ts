import { getR2SignedUploadUrl } from "@/lib/r2/getR2SignedUploadUrl";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const ALLOWED_TYPES = {
  image: {
    ext: ["png", "jpg", "jpeg", "webp"],
    defaultExt: "png",
    mime: {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
    },
  },
  pdf: {
    ext: ["pdf"],
    defaultExt: "pdf",
    mime: { pdf: "application/pdf" },
  },
};

export async function POST(req: Request) {
  const { type, ext } = (await req.json()) as {
    type?: keyof typeof ALLOWED_TYPES;
    ext?: string;
  };

  if (!type || !ALLOWED_TYPES[type]) {
    return NextResponse.json({ msg: "Invalid type" }, { status: 400 });
  }

  const safeExt =
    ext && ALLOWED_TYPES[type].ext.includes(ext)
      ? ext
      : ALLOWED_TYPES[type].defaultExt;

  const key = `${type}s/${uuid()}.${safeExt}`;
  const mime = ALLOWED_TYPES[type].mime as Record<string, string>;
  const contentType = mime[safeExt];

  const url = await getR2SignedUploadUrl({
    key,
    contentType,
    expiresIn: 15 * 60, // 15 minutes
    // Optional: acl: "private"
  });

  return NextResponse.json({ url, key }, { status: 200 });
}
