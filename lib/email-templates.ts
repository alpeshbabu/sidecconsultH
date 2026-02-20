interface ContactInquiryData {
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceInterest: string;
  projectTimeline?: string | null;
  message: string;
}

interface AppointmentData {
  name: string;
  email: string;
  bookedAt: Date;
  bookedEndAt: Date;
  serviceInterest?: string | null;
  notes?: string | null;
  phone?: string | null;
  companyName?: string | null;
  timeZone?: string | null;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sidecconsult.com";
const PRIMARY_COLOR = "#2563eb";

function formatDateTime(date: Date, timeZone?: string | null): string {
  const tz = timeZone || "America/New_York";
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
    timeZoneName: "short",
  });
}

function formatTime(date: Date, timeZone?: string | null): string {
  const tz = timeZone || "America/New_York";
  return new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
    timeZoneName: "short",
  });
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr><td style="background-color:${PRIMARY_COLOR};padding:24px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">SIDEC Consulting</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;color:#6b7280;font-size:12px;">SIDEC Consulting — Medical Device Manufacturing Excellence</p>
          <p style="margin:8px 0 0;color:#6b7280;font-size:12px;"><a href="${SITE_URL}" style="color:${PRIMARY_COLOR};text-decoration:none;">sidecconsult.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function appointmentDetailsBlock(appt: AppointmentData): string {
  const rows = [
    { label: "Date & Time", value: formatDateTime(appt.bookedAt, appt.timeZone) },
    { label: "End Time", value: formatTime(appt.bookedEndAt, appt.timeZone) },
  ];
  if (appt.serviceInterest) rows.push({ label: "Service", value: appt.serviceInterest });
  if (appt.notes) rows.push({ label: "Notes", value: appt.notes });

  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:6px;padding:16px;margin:16px 0;">
    ${rows.map((r) => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:14px;font-weight:600;width:120px;vertical-align:top;">${r.label}</td><td style="padding:6px 12px;color:#111827;font-size:14px;">${r.value}</td></tr>`).join("")}
  </table>`;
}

export function bookingConfirmationEmail(appt: AppointmentData) {
  return {
    subject: "Your Consultation Request Has Been Received — SIDEC Consulting",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Thank You, ${appt.name}!</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">We've received your consultation request. Our team will review it and get back to you shortly to confirm your appointment.</p>
      ${appointmentDetailsBlock(appt)}
      <p style="margin:16px 0 0;color:#374151;font-size:15px;line-height:1.6;"><strong>What happens next?</strong></p>
      <ul style="margin:8px 0 0;padding-left:20px;color:#374151;font-size:15px;line-height:1.8;">
        <li>We'll review your request within 1 business day</li>
        <li>You'll receive a confirmation email once approved</li>
        <li>A reminder will be sent 24 hours before your consultation</li>
      </ul>
    `),
  };
}

export function appointmentConfirmedEmail(appt: AppointmentData) {
  return {
    subject: "Your Consultation Is Confirmed — SIDEC Consulting",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Consultation Confirmed!</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Hi ${appt.name}, your consultation has been confirmed. We look forward to speaking with you.</p>
      ${appointmentDetailsBlock(appt)}
      <p style="margin:16px 0 0;color:#374151;font-size:15px;line-height:1.6;"><strong>To prepare:</strong></p>
      <ul style="margin:8px 0 0;padding-left:20px;color:#374151;font-size:15px;line-height:1.8;">
        <li>Have a brief summary of your manufacturing challenge or project goals ready</li>
        <li>Note any specific regulatory or quality requirements you're working with</li>
        <li>We'll send a reminder 24 hours before your consultation</li>
      </ul>
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${SITE_URL}/resources" style="display:inline-block;background-color:${PRIMARY_COLOR};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Browse Our Resources</a>
      </p>
    `),
  };
}

export function appointmentCancelledEmail(appt: AppointmentData) {
  return {
    subject: "Your Consultation Has Been Cancelled — SIDEC Consulting",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Consultation Cancelled</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Hi ${appt.name}, we regret to inform you that your consultation has been cancelled.</p>
      ${appointmentDetailsBlock(appt)}
      <p style="margin:16px 0 0;color:#374151;font-size:15px;line-height:1.6;">If you'd like to reschedule, you can book a new consultation at any time.</p>
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${SITE_URL}/schedule" style="display:inline-block;background-color:${PRIMARY_COLOR};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Schedule New Consultation</a>
      </p>
    `),
  };
}

export function appointmentReminderEmail(appt: AppointmentData) {
  return {
    subject: "Reminder: Your Consultation Is Tomorrow — SIDEC Consulting",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Reminder: Consultation Tomorrow</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Hi ${appt.name}, this is a friendly reminder that your consultation is scheduled for tomorrow.</p>
      ${appointmentDetailsBlock(appt)}
      <p style="margin:16px 0 0;color:#374151;font-size:15px;line-height:1.6;">We look forward to speaking with you. If you need to reschedule, please contact us as soon as possible.</p>
    `),
  };
}

export function adminNotificationEmail(appt: AppointmentData) {
  const rows = [
    { label: "Name", value: appt.name },
    { label: "Email", value: appt.email },
    { label: "Date & Time", value: formatDateTime(appt.bookedAt, appt.timeZone) },
    { label: "End Time", value: formatTime(appt.bookedEndAt, appt.timeZone) },
  ];
  if (appt.phone) rows.push({ label: "Phone", value: appt.phone });
  if (appt.companyName) rows.push({ label: "Company", value: appt.companyName });
  if (appt.serviceInterest) rows.push({ label: "Service Interest", value: appt.serviceInterest });
  if (appt.notes) rows.push({ label: "Notes", value: appt.notes });

  const detailsBlock = `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:6px;padding:16px;margin:16px 0;">
    ${rows.map((r) => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:14px;font-weight:600;width:120px;vertical-align:top;">${r.label}</td><td style="padding:6px 12px;color:#111827;font-size:14px;">${r.value}</td></tr>`).join("")}
  </table>`;

  return {
    subject: `New Consultation Request from ${appt.name}`,
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">New Consultation Request</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">A new consultation request has been submitted and is awaiting your review.</p>
      ${detailsBlock}
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${SITE_URL}/admin/appointments" style="display:inline-block;background-color:${PRIMARY_COLOR};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">View in Admin Panel</a>
      </p>
    `),
  };
}

// --- Contact Inquiry Templates ---

function contactInquiryDetailsBlock(inquiry: ContactInquiryData): string {
  const rows: { label: string; value: string }[] = [
    { label: "Name", value: inquiry.name },
    { label: "Email", value: inquiry.email },
    { label: "Service", value: inquiry.serviceInterest },
  ];
  if (inquiry.projectTimeline) rows.push({ label: "Timeline", value: inquiry.projectTimeline });
  if (inquiry.phone) rows.push({ label: "Phone", value: inquiry.phone });
  if (inquiry.companyName) rows.push({ label: "Company", value: inquiry.companyName });
  rows.push({ label: "Message", value: inquiry.message });

  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:6px;padding:16px;margin:16px 0;">
    ${rows.map((r) => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:14px;font-weight:600;width:120px;vertical-align:top;">${r.label}</td><td style="padding:6px 12px;color:#111827;font-size:14px;">${r.value}</td></tr>`).join("")}
  </table>`;
}

export function contactInquiryConfirmationEmail(inquiry: ContactInquiryData) {
  return {
    subject: "We've Received Your Inquiry — SIDEC Consulting",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Thank You, ${inquiry.name}!</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">We've received your inquiry and our team will review it shortly. You can expect a response within <strong>24–48 business hours</strong>.</p>
      <p style="margin:0 0 8px;color:#374151;font-size:15px;line-height:1.6;"><strong>Here's a summary of your inquiry:</strong></p>
      ${contactInquiryDetailsBlock(inquiry)}
      <p style="margin:16px 0 0;color:#374151;font-size:15px;line-height:1.6;">In the meantime, feel free to explore our resources for insights on medical device manufacturing and quality systems.</p>
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${SITE_URL}/resources" style="display:inline-block;background-color:${PRIMARY_COLOR};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Browse Our Resources</a>
      </p>
    `),
  };
}

export function contactInquiryAdminNotificationEmail(inquiry: ContactInquiryData) {
  const rows: { label: string; value: string }[] = [
    { label: "Name", value: inquiry.name },
    { label: "Email", value: inquiry.email },
    { label: "Service", value: inquiry.serviceInterest },
  ];
  if (inquiry.projectTimeline) rows.push({ label: "Timeline", value: inquiry.projectTimeline });
  if (inquiry.phone) rows.push({ label: "Phone", value: inquiry.phone });
  if (inquiry.companyName) rows.push({ label: "Company", value: inquiry.companyName });
  rows.push({ label: "Message", value: inquiry.message });

  const detailsBlock = `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:6px;padding:16px;margin:16px 0;">
    ${rows.map((r) => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:14px;font-weight:600;width:120px;vertical-align:top;">${r.label}</td><td style="padding:6px 12px;color:#111827;font-size:14px;">${r.value}</td></tr>`).join("")}
  </table>`;

  return {
    subject: `New Contact Inquiry from ${inquiry.name}`,
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">New Contact Inquiry</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">A new contact inquiry has been submitted and is awaiting your review.</p>
      ${detailsBlock}
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${SITE_URL}/admin/inquiries" style="display:inline-block;background-color:${PRIMARY_COLOR};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">View in Admin Panel</a>
      </p>
    `),
  };
}

// --- Newsletter Templates ---

export function newsletterWelcomeEmail(email: string) {
  return {
    subject: "Welcome to the SIDEC Consulting Newsletter!",
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Welcome Aboard!</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Thank you for subscribing to the SIDEC Consulting newsletter. You'll receive insights on medical device manufacturing, quality systems, and regulatory compliance directly in your inbox.</p>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">In the meantime, check out our latest articles and resources:</p>
      <p style="margin:24px 0 0;text-align:center;">
        <a href="${SITE_URL}/resources" style="display:inline-block;background-color:${PRIMARY_COLOR};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Explore Resources</a>
      </p>
    `),
  };
}
