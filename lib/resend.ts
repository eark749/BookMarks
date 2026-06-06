import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, handle: string) {
  await resend.emails.send({
    from: "BookMarks <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to BookMarks!",
    html: `
      <h1>Welcome to BookMarks, @${handle}!</h1>
      <p>Your account is ready. Your public profile is available at:</p>
      <p><strong>${process.env.NEXT_PUBLIC_SITE_URL}/${handle}</strong></p>
      <p>Start adding bookmarks from your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">dashboard</a>.</p>
    `,
  });
}
