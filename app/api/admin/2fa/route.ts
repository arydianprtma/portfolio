import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminCredentials, updateAdminCredentials } from "@/lib/storage";
import { generateTwoFactorSetup, verifyTwoFactorToken } from "@/lib/twoFactor";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const credentials = await getAdminCredentials();
  const setup = await generateTwoFactorSetup(credentials.email);

  return NextResponse.json({
    secret: setup.secret,
    otpauthUrl: setup.otpauthUrl,
    qrCodeDataUrl: setup.qrCodeDataUrl,
    isEnabled: credentials.twoFactorEnabled === true,
  });
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token, secret } = await request.json();

    if (!token || !secret) {
      return NextResponse.json(
        { error: "Token and secret are required to enable 2FA" },
        { status: 400 }
      );
    }

    const isValid = verifyTwoFactorToken(token, secret);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid 6-digit verification code. Please check Google Authenticator." },
        { status: 400 }
      );
    }

    const credentials = await getAdminCredentials();
    await updateAdminCredentials({
      ...credentials,
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    });

    return NextResponse.json({
      success: true,
      message: "Google Authenticator 2FA enabled successfully!",
      isEnabled: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to enable 2FA", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { password } = await request.json();
    const credentials = await getAdminCredentials();

    if (!password || password !== credentials.password) {
      return NextResponse.json(
        { error: "Current password is required to disable 2FA" },
        { status: 400 }
      );
    }

    await updateAdminCredentials({
      ...credentials,
      twoFactorSecret: undefined,
      twoFactorEnabled: false,
    });

    return NextResponse.json({
      success: true,
      message: "Google Authenticator 2FA disabled successfully.",
      isEnabled: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to disable 2FA", details: String(error) },
      { status: 500 }
    );
  }
}
