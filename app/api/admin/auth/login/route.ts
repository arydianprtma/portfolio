import { NextResponse } from "next/server";
import { verifyCredentials, setAdminSession } from "@/lib/auth";
import { getAdminCredentials } from "@/lib/storage";
import { verifyTwoFactorToken } from "@/lib/twoFactor";

export async function POST(request: Request) {
  try {
    const { email, password, twoFactorCode, rememberWeeks } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const isValidPassword = await verifyCredentials(email, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const credentials = await getAdminCredentials();

    // Check if 2FA is enabled
    if (credentials.twoFactorEnabled && credentials.twoFactorSecret) {
      if (!twoFactorCode) {
        return NextResponse.json({
          require2FA: true,
          message: "Please enter your 6-digit Google Authenticator code.",
        });
      }

      const isValid2FA = verifyTwoFactorToken(
        twoFactorCode,
        credentials.twoFactorSecret
      );

      if (!isValid2FA) {
        return NextResponse.json(
          { error: "Invalid 6-digit Google Authenticator code" },
          { status: 400 }
        );
      }
    }

    // Determine cookie duration: e.g. 14 days (2 weeks) if checked, otherwise 7 days (1 week)
    const sessionDays = rememberWeeks === 2 ? 14 : 7;
    await setAdminSession(sessionDays);

    return NextResponse.json({
      success: true,
      message: `Authentication successful. Session active for ${sessionDays} days.`,
      sessionDays,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed", details: String(error) },
      { status: 500 }
    );
  }
}
