import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminCredentials, updateAdminCredentials } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const credentials = await getAdminCredentials();
  return NextResponse.json({
    email: credentials.email,
  });
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newEmail, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to make security changes" },
        { status: 400 }
      );
    }

    const credentials = await getAdminCredentials();

    if (currentPassword !== credentials.password) {
      return NextResponse.json(
        { error: "Current password does not match" },
        { status: 400 }
      );
    }

    const updatedEmail = newEmail?.trim() || credentials.email;
    const updatedPassword = newPassword?.trim() || credentials.password;

    await updateAdminCredentials({
      email: updatedEmail,
      password: updatedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Admin security settings updated successfully",
      email: updatedEmail,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update admin settings", details: String(error) },
      { status: 500 }
    );
  }
}
