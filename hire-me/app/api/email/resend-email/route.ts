import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/components/custom/Email/sendVerificationEmail";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Create new token
    const token = uuid();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute = 60,000 ms

    // Delete any existing token for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: expiresAt,
      },
    });
    await sendVerificationEmail({
      email: user.email || " ",
      name: user.name || "user",
      token,
      kind : "verification"
    });
    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
