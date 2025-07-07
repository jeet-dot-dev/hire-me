// /app/api/candidate/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { candidateSchema } from "@/zod/candidateProfile";
import { assertSizeOrDelete } from "@/lib/r2/checkSizeR2";
import { deleteR2Object } from "@/lib/r2/deleteR2Object";

export async function POST(req: NextRequest) {
  let keysToDelete: string[] = []; // populated asap
  let saved = false; // flipped to true after successful DB create

  try {
    /* ───── 1️⃣  Parse raw body so we can extract keys early ───── */
    const body = await req.json();
    // Collect possible object keys (they might be undefined / invalid)
    keysToDelete = [body?.profilePicture, body?.resume].filter(
      (v): v is string => typeof v === "string" && v.length > 0 //
    );
   // console.log(body?.skills)
    /* ───── 2️⃣  Auth guard ───── */
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "CANDIDATE")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    /* ───── 3️⃣  Zod validation ───── */
    const parsed = candidateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );

    /* ───── 4️⃣  Dup‑profile check ───── */
    const userId = session.user.id;
    const existing = await prisma.candidate.findUnique({ where: { userId } });
    if (existing)
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );

    /* ───── 5️⃣  File‑size check on R2 ───── */
    const { profilePicture, resume } = parsed.data;
    if (profilePicture) await assertSizeOrDelete(profilePicture);
    if (resume) await assertSizeOrDelete(resume);

    /* ───── 6️⃣  Persist to DB ───── */
    const {
      firstName,
      lastName,
      about,
      education = [],
      skills: skillsData = [],
      socialLinks = [],
    } = parsed.data;
  
   console.log(skillsData)
    await prisma.candidate.create({
      data: {
        userId,
        firstName,
        lastName,
        about,
        ProfilePic: profilePicture,
        resumeUrl: resume,
        education: {
          create: education.map((e) => ({ ...e, endYear: e.endYear ?? null })),
        },
        skills: { create: skillsData.map((s) => ({ name: s })) },
        socials: {
          create: socialLinks.map((l) => ({
            platform: l.platform,
            url: l.url,
          })),
        },
      },
    });

    saved = true; // <-- success flag
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    /* ───── 7️⃣  Global cleanup ───── */
    if (!saved && keysToDelete.length) {
      // best‑effort: ignore errors so it never masks the original response
      await deleteR2Object(keysToDelete).catch(() => {});
    }
  }
}
