import { cookies } from "next/headers";
import crypto from "crypto";
import { getAdminCredentials } from "./storage";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "bos_portfolio_secure_session_secret_2026";

export async function verifyCredentials(email: string, pass: string): Promise<boolean> {
  const currentCredentials = await getAdminCredentials();
  return (
    email.trim().toLowerCase() === currentCredentials.email.toLowerCase() &&
    pass === currentCredentials.password
  );
}

/**
 * Creates a signed, timestamped session cookie.
 * @param durationInDays Number of days the session remains valid (e.g. 7 days or 14 days).
 */
export async function setAdminSession(durationInDays: number = 7): Promise<void> {
  const cookieStore = await cookies();
  const maxAgeSeconds = durationInDays * 24 * 60 * 60;
  const expiresAt = Date.now() + maxAgeSeconds * 1000;

  // Create HMAC signature: timestamp + secret
  const dataToSign = `bos_admin_${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(dataToSign)
    .digest("hex");

  const sessionToken = `${expiresAt}.${signature}`;

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
    expires: new Date(expiresAt),
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session || !session.value) {
    return false;
  }

  try {
    const [expiresAtStr, signature] = session.value.split(".");
    if (!expiresAtStr || !signature) {
      return false;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      // Session has expired (e.g. past 7 or 14 days)
      return false;
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(`bos_admin_${expiresAt}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    console.error("Session verification error:", err);
    return false;
  }
}
