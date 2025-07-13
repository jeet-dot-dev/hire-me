import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, token } = body ;
    if (!password || !token) {
      return NextResponse.json(
        { message: "Password or token is missing " },
        { status: 400 }
      );
    }
    // find the token in db
    const dbToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!dbToken) {
      return NextResponse.json({ message: "Invalid token " }, { status: 400 });
    }
    if (dbToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    // Check if user exists before updating
    const user = await prisma.user.findUnique({
      where: { email: dbToken.email },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: dbToken.email },
      data: { password: hashedPassword },
    });
    await prisma.passwordResetToken.delete({
      where: { token },
    });
    return NextResponse.json(
      { message: "Password updated successfully! You can now log in." },
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
