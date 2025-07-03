import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { sendVerificationEmail } from "@/components/custom/Email/sendVerificationEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerifiedAt: new Date(),
      },
    });

    // generate a token for email varification
    const token = uuid();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute = 60,000 ms

    // create a verify token in db
    await prisma.verificationToken.create({
      data: {
        identifier: newUser.email || "",
        token,
        expires: expiresAt,
      },
    });

    // calling the resend func which send email the verify link
    const data = await sendVerificationEmail({
      email: newUser.email || " ",
      name: newUser.name || "user",
      token,
    });
    console.log(data);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
