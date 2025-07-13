import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { message: "Token is required for verification." },
        { status: 400 }
      );
    }
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });
    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    // Check if user exists before updating
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is varified already . Try to login " },
        { status: 200 }
      );
    }

    // update the email varified field
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    // clear the token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: user.email || " ", // required
          token: token, // ✅ required
        },
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
