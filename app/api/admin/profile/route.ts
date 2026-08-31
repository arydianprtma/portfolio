import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProfile, updateProfile, getSkills, updateSkills } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile();
  const skills = await getSkills();
  return NextResponse.json({ profile, skills });
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (data.profile) {
      await updateProfile(data.profile);
    }
    if (data.skills) {
      await updateSkills(data.skills);
    }

    const updatedProfile = await getProfile();
    const updatedSkills = await getSkills();
    return NextResponse.json({ success: true, profile: updatedProfile, skills: updatedSkills });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile", details: String(error) },
      { status: 500 }
    );
  }
}
