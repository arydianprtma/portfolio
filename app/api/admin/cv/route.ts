import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getCvData, saveCvData, getProfile, updateProfile } from "@/lib/storage";
import { CvData } from "@/types";

export async function GET() {
  try {
    const cv = await getCvData();
    return NextResponse.json({ cv });
  } catch (error: any) {
    console.error("GET CV Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load CV" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cv, setAsActiveResume } = body as { cv: CvData; setAsActiveResume?: boolean };

    if (!cv || !cv.fullName) {
      return NextResponse.json({ error: "Invalid CV data" }, { status: 400 });
    }

    const saved = await saveCvData(cv);

    // If setAsActiveResume is true, update Profile.resumeUrl to point to the digital CV route /cv
    if (setAsActiveResume) {
      const profile = await getProfile();
      profile.resumeUrl = "/cv";
      await updateProfile(profile);
    }

    return NextResponse.json({ success: true, cv: saved });
  } catch (error: any) {
    console.error("Save CV Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save CV" }, { status: 500 });
  }
}
