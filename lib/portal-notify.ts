import { sendEmail } from "@/lib/email";
import {
  portalNewDocumentEmail,
  portalNewMessageEmail,
} from "@/lib/email-templates";

type Actor = "ADMIN" | "CLIENT";

interface ProjectForNotify {
  id: string;
  title: string;
  client: { name: string | null; email: string };
}

function portalBase(): string {
  return process.env.NEXTAUTH_URL || "https://sidecconsult.com";
}

/**
 * Notify the *other* party about a new document. Fire-and-forget; errors are
 * logged but never block the request.
 */
export function notifyDocumentUploaded(
  project: ProjectForNotify,
  uploaderRole: Actor,
  fileName: string
) {
  if (uploaderRole === "ADMIN") {
    // Admin uploaded → notify the client (they view it in the portal).
    const link = `${portalBase()}/portal/projects/${project.id}`;
    const tpl = portalNewDocumentEmail({
      recipientName: project.client.name,
      projectTitle: project.title,
      fileName,
      link,
    });
    sendEmail({ to: project.client.email, subject: tpl.subject, html: tpl.html }).catch(
      (err) => console.error("Failed to notify client of document:", err)
    );
  } else {
    // Client uploaded → notify the admin.
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) return;
    const link = `${portalBase()}/admin/projects/${project.id}`;
    const tpl = portalNewDocumentEmail({
      recipientName: "Team",
      projectTitle: project.title,
      fileName,
      link,
    });
    sendEmail({ to: adminEmail, subject: tpl.subject, html: tpl.html }).catch((err) =>
      console.error("Failed to notify admin of document:", err)
    );
  }
}

/** Notify the other party about a new message. Fire-and-forget. */
export function notifyNewMessage(
  project: ProjectForNotify,
  authorRole: Actor,
  body: string
) {
  const snippet = body.length > 200 ? `${body.slice(0, 200)}…` : body;
  if (authorRole === "ADMIN") {
    const link = `${portalBase()}/portal/projects/${project.id}`;
    const tpl = portalNewMessageEmail({
      recipientName: project.client.name,
      projectTitle: project.title,
      snippet,
      link,
    });
    sendEmail({ to: project.client.email, subject: tpl.subject, html: tpl.html }).catch(
      (err) => console.error("Failed to notify client of message:", err)
    );
  } else {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) return;
    const link = `${portalBase()}/admin/projects/${project.id}`;
    const tpl = portalNewMessageEmail({
      recipientName: "Team",
      projectTitle: project.title,
      snippet,
      link,
    });
    sendEmail({ to: adminEmail, subject: tpl.subject, html: tpl.html }).catch((err) =>
      console.error("Failed to notify admin of message:", err)
    );
  }
}
