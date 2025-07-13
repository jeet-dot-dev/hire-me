import { sendVerificationEmail } from "@/components/custom/Email/sendVerificationEmail";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const email  = body.email;
    if (!email) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please check your email and try again." },
        { status: 404 }
      );
    }
    const token = uuid();
    const expiresAt = new Date(Date.now() + 1000 * 15 * 60); // token expires in 15 minutes

    await prisma.passwordResetToken.create({
      data: {
        email: user.email || " ",
        token,
        expires: expiresAt,
      },
    });
    await sendVerificationEmail({
      email: user.email || " ",
      name: user.name || "User",
      token,
      kind : "password-reset"
    });

    return NextResponse.json(
      {
        message:
          "Password reset email sent successfully. Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
