import nodemailer from "nodemailer";
import { ContactMessage } from "@/types";

// Create reusable transporter object using SMTP transport
function createTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  // If custom SMTP host is provided, use it. Otherwise default to Gmail.
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: (process.env.SMTP_SECURE || "true") === "true",
      auth: {
        user,
        pass,
      },
    });
  }

  // Gmail SMTP
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

export async function sendInquiryNotification(
  data: Omit<ContactMessage, "id" | "read" | "createdAt">
): Promise<{ success: boolean; error?: string }> {
  const transporter = createTransporter();

  const recipientEmail =
    process.env.NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "arydianprtma@gmail.com";

  if (!transporter) {
    console.log(
      "ℹ️ Nodemailer: SMTP credentials not set in .env. Message saved to Supabase Inbox successfully."
    );
    return { success: true };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #F5F5F5; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #222222; padding: 32px; }
          .header { border-bottom: 2px solid #E31B23; padding-bottom: 16px; margin-bottom: 24px; }
          .badge { display: inline-block; background-color: #1F1F1F; color: #E31B23; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 4px 8px; border: 1px solid #333333; margin-bottom: 8px; }
          .title { font-size: 20px; font-weight: 900; color: #F5F5F5; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
          .field-group { margin-bottom: 16px; background-color: #181818; padding: 12px 16px; border: 1px solid #262626; }
          .field-label { font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; margin-bottom: 4px; }
          .field-value { font-size: 14px; color: #F5F5F5; word-break: break-word; }
          .message-box { background-color: #161616; border-left: 3px solid #E31B23; padding: 16px; margin-top: 20px; font-size: 14px; line-height: 1.6; color: #E0E0E0; white-space: pre-wrap; }
          .footer { margin-top: 32px; border-top: 1px solid #222222; padding-top: 16px; font-size: 11px; color: #666666; text-align: center; }
          .reply-btn { display: inline-block; background-color: #E31B23; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 12px; padding: 10px 20px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">● NEW INCOMING INQUIRY</span>
            <h1 class="title">PORTFOLIO CONTACT DISPATCH</h1>
          </div>

          <div class="field-group">
            <div class="field-label">FROM SENDER</div>
            <div class="field-value"><strong>${data.name}</strong> &lt;${data.email}&gt;</div>
          </div>

          ${
            data.subject
              ? `
          <div class="field-group">
            <div class="field-label">SUBJECT / TOPIC</div>
            <div class="field-value">${data.subject}</div>
          </div>`
              : ""
          }

          ${
            data.budget
              ? `
          <div class="field-group">
            <div class="field-label">ESTIMATED BUDGET / SCOPE</div>
            <div class="field-value">${data.budget}</div>
          </div>`
              : ""
          }

          <div class="field-label" style="margin-top: 20px;">INQUIRY MESSAGE CONTENT:</div>
          <div class="message-box">${data.message}</div>

          <div style="text-align: center;">
            <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(
    data.subject || "Collaboration Inquiry"
  )}" class="reply-btn">Direct Reply to ${data.name}</a>
          </div>

          <div class="footer">
            Sent from your BOS / ARDP Developer Portfolio • Stored in Supabase PostgreSQL
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Portfolio Inquiry" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: data.email,
      subject: `[Portfolio Inquiry] from ${data.name}${data.subject ? `: ${data.subject}` : ""}`,
      text: `New Portfolio Inquiry from ${data.name} (${data.email})\n\nSubject: ${data.subject || "-"}\nBudget: ${data.budget || "-"}\n\nMessage:\n${data.message}`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Nodemailer send error:", err);
    return { success: false, error: err.message };
  }
}
