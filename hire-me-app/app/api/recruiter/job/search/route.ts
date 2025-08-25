// app/api/jobs/search/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1️⃣ Map filter options to actual model fields
const filterFieldMap = {
  title: "jobTitle",
  company: "companyName",
  location: "location",
  skills: "skillsRequired",
  tags: "tags",
} as const;

export async function GET(req: Request) {
    const session = await auth();
    if(!session || !session.user || session.user.role !== "RECRUITER"   ) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

  try {
    const { searchParams } = new URL(req.url);
    const searchValue = searchParams.get("query")?.trim() || "";
    const filterBy = searchParams.get("filterBy") || "title";

    if (!searchValue) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    // Check if recruiter profile exists, if not create one
    let recruiter = await prisma.recruiter.findUnique({
      where: {
        userId: session.user.id,
      }}
    );

    if(!recruiter) {
      recruiter = await prisma.recruiter.create({
        data: { userId: session.user.id }
      });
    }

    const field =
      filterFieldMap[filterBy as keyof typeof filterFieldMap] || "jobTitle";

    // 2️⃣ Classify types
    const stringFields = ["jobTitle", "companyName", "location"];
    const arrayFields = ["skillsRequired", "tags"];

    // 3️⃣ Build the where clause based on field type
    let whereClause = {};

    if (stringFields.includes(field)) {
      whereClause = {
        [field]: {
          contains: searchValue,
          mode: "insensitive",
        },
        isDelete: false,
        recruiterId : recruiter.id,
      };
    } else if (arrayFields.includes(field)) {
      whereClause = {
        [field]: {
          has: searchValue,
        },
        isDelete: false,
        recruiterId : recruiter.id,
      };
    } else {
      return NextResponse.json(
        { error: `Search by '${field}' is not supported.` },
        { status: 400 }
      );
    }

    // 4️⃣ Query DB
    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("❌ API Crash:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
