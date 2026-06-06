import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, handle: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bookmarks.app";
  const profileUrl = `${siteUrl}/${handle}`;
  const dashboardUrl = `${siteUrl}/dashboard`;

  await resend.emails.send({
    from: "BookMarks <onboarding@resend.dev>",
    to: email,
    subject: `Welcome to BookMarks, @${handle}!`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to BookMarks</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:32px 40px;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">BookMarks</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111;letter-spacing:-0.5px;">
                Welcome, @${handle}!
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.6;">
                Your account is live. Here's everything you need to get started.
              </p>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Your details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#888;width:100px;">Handle</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111;">@${handle}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#888;">Email</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#888;">Profile</td>
                        <td style="padding:6px 0;font-size:14px;">
                          <a href="${profileUrl}" style="color:#000;font-weight:600;text-decoration:none;">${profileUrl}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <a href="${dashboardUrl}" style="display:block;background:#000000;color:#ffffff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.2px;">
                Go to your dashboard →
              </a>
            </td>
          </tr>

          <!-- What you can do -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">What you can do</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:14px;color:#333;">📎 &nbsp;Save bookmarks with auto-fetched titles</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:14px;color:#333;">🔒 &nbsp;Mark links private — only you can see them</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="font-size:14px;color:#333;">🌐 &nbsp;Share your public profile at <strong>/${handle}</strong></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#bbb;line-height:1.6;">
                You received this because you signed up at <a href="${siteUrl}" style="color:#999;text-decoration:none;">${siteUrl}</a>.<br/>
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}
