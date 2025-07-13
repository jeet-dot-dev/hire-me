import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSizeOrDelete } from "@/lib/r2/checkSizeR2";
import { deleteR2Object } from "@/lib/r2/deleteR2Object";
import { candidateSchema } from "@/zod/candidateProfile";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const keysToDelete: string[] = [];
  let newKeysToDeleteIfFailed: string[] = [];
  let saved = false;

  try {
    const body = await req.json();

    newKeysToDeleteIfFailed = [body?.profilePicture, body?.resume].filter(
      (v): v is string => typeof v === "string" && v.length > 0
    );

    const session = await auth();
    if (!session?.user?.id || session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = candidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const existing = await prisma.candidate.findUnique({
      where: { userId },
    });

    const {
      firstName,
      lastName,
      about,
      education = [],
      skills: skillsData = [],
      socialLinks = [],
      profilePicture,
      resume,
    } = parsed.data;

    if (profilePicture) await assertSizeOrDelete(profilePicture);
    if (resume) await assertSizeOrDelete(resume);

    if (existing) {
      // 🧹 Add old R2 keys to delete list if new ones are different
      if (profilePicture && existing.ProfilePic && profilePicture !== existing.ProfilePic) {
        keysToDelete.push(existing.ProfilePic);
      }

      if (resume && existing.resumeUrl && resume !== existing.resumeUrl) {
        keysToDelete.push(existing.resumeUrl);
      }

      // 🔄 Update candidate
      await prisma.$transaction([
        prisma.education.deleteMany({ where: { candidateId: existing.id } }),
        prisma.skill.deleteMany({ where: { candidateId: existing.id } }),
        prisma.socialLink.deleteMany({ where: { candidateId: existing.id } }),
        prisma.candidate.update({
          where: { userId },
          data: {
            firstName,
            lastName,
            about,
            ProfilePic: profilePicture,
            resumeUrl: resume,
            education: {
              create: education.map((e) => ({
                degree: e.degree,
                institution: e.institution,
                startYear: e.startYear,
                endYear: e.endYear ?? null,
                grade: e.grade ?? undefined,
              })),
            },
            skills: {
              create: skillsData.map((s) => ({ name: s })),
            },
            socials: {
              create: socialLinks.map((l) => ({
                platform: l.platform,
                url: l.url,
              })),
            },
          },
        }),
      ]);
    } else {
      await prisma.candidate.create({
        data: {
          userId,
          firstName,
          lastName,
          about,
          ProfilePic: profilePicture,
          resumeUrl: resume,
          education: {
            create: education.map((e) => ({
              ...e,
              endYear: e.endYear ?? null,
            })),
          },
          skills: {
            create: skillsData.map((s) => ({ name: s })),
          },
          socials: {
            create: socialLinks.map((l) => ({
              platform: l.platform,
              url: l.url,
            })),
          },
        },
      });
    }

    saved = true;

    // ✅ Now delete old unused R2 objects
    if (keysToDelete.length) {
      await deleteR2Object(keysToDelete).catch(() => {});
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Clean up uploaded files if save failed
    if (!saved && newKeysToDeleteIfFailed.length) {
      await deleteR2Object(newKeysToDeleteIfFailed).catch(() => {});
    }
  }
}
