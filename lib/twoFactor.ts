import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const ISSUER = "BOS Portfolio Admin";

export async function generateTwoFactorSetup(email: string) {
  // Generate random base32 secret
  const secret = new OTPAuth.Secret({ size: 20 });
  const base32Secret = secret.base32;

  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });

  const otpauthUrl = totp.toString();
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
    margin: 2,
    width: 260,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return {
    secret: base32Secret,
    otpauthUrl,
    qrCodeDataUrl,
  };
}

export function verifyTwoFactorToken(token: string, base32Secret: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: ISSUER,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(base32Secret),
    });

    // delta checks current window and +/- 1 period (30s tolerance)
    const delta = totp.validate({
      token: token.trim().replace(/\s/g, ""),
      window: 1,
    });

    return delta !== null;
  } catch (error) {
    console.error("2FA validation error:", error);
    return false;
  }
}
