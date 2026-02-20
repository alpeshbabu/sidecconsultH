import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "SIDEC Consulting <noreply@sidecconsult.com>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email to:", to);
    return;
  }

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}
