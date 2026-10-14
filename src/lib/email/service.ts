/**
 * ==============================================================================
 * PROJECT DHURANDHAR: TRANSACTIONAL EMAIL SERVICE
 * Supports Resend API (Direct REST) & Supabase Auth Mailer
 * Complies with Section 8 & Section 16 (AC-26 Secret Protection)
 * ==============================================================================
 */

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailSendResult {
  delivered: boolean;
  id?: string;
  provider: "resend" | "mock" | "error";
  error?: string;
  simulated?: boolean;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_FROM =
  process.env.EMAIL_FROM ||
  "Project Dhurandhar <noreply@mail.automationlabs.online>";

export const isResendConfigured = Boolean(
  RESEND_API_KEY &&
  !RESEND_API_KEY.includes("your-resend-key") &&
  RESEND_API_KEY.startsWith("re_")
);

/**
 * Send transactional email using Resend REST API or clean fallback in development
 */
export async function sendTransactionalEmail(
  options: SendEmailOptions
): Promise<EmailSendResult> {
  const recipients = Array.isArray(options.to) ? options.to : [options.to];
  const from = options.from || DEFAULT_FROM;

  if (isResendConfigured && RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: recipients,
          subject: options.subject,
          html: options.html,
          text: options.text || options.subject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn("Resend email delivery error:", data);
        return {
          delivered: false,
          provider: "resend",
          error: data.message || "Failed to deliver email through Resend API",
        };
      }

      return {
        delivered: true,
        id: data.id,
        provider: "resend",
      };
    } catch (err: any) {
      console.error("Resend API request failed:", err);
      return {
        delivered: false,
        provider: "error",
        error: err.message,
      };
    }
  }

  // Development / Mock fallback
  console.log(`[EMAIL DISPATCH - ${from} -> ${recipients.join(", ")}]`);
  console.log(`Subject: ${options.subject}`);
  console.log(`(Email delivery simulated. Configure RESEND_API_KEY in .env.local for live production delivery.)`);

  return {
    delivered: false,
    simulated: true,
    provider: "mock",
    id: `mock-email-${Date.now()}`,
  };
}

/**
 * Send notification to moderators when a first-time user comment requires approval
 */
export async function sendCommentModerationAlert(params: {
  commentId: string;
  authorName: string;
  episodeTitle: string;
  commentBody: string;
}): Promise<EmailSendResult> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@automationlabs.online";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b1120; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-top: 0;">New Comment Awaiting Moderation</h2>
      <p style="color: #94a3b8; font-size: 14px;">A new community member has posted their first comment on <strong>${params.episodeTitle}</strong>.</p>
      
      <div style="background: #020617; padding: 16px; border-radius: 8px; border-left: 4px solid #38bdf8; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #38bdf8;"><strong>Author:</strong> ${params.authorName}</p>
        <p style="margin: 0; font-size: 14px; color: #e2e8f0; line-height: 1.5;">"${params.commentBody}"</p>
      </div>

      <div style="margin-top: 24px;">
        <a href="https://projectdhurandhar.automationlabs.online/admin/comments" style="display: inline-block; background: #38bdf8; color: #020617; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px;">
          Open Moderation Console →
        </a>
      </div>
      
      <p style="margin-top: 32px; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px;">
        Project Dhurandhar Control Center • Automated notification
      </p>
    </div>
  `;

  return sendTransactionalEmail({
    to: adminEmail,
    subject: `[Moderation Required] New comment on "${params.episodeTitle}" by ${params.authorName}`,
    html,
    text: `New comment on ${params.episodeTitle} by ${params.authorName}: ${params.commentBody}. Review at https://projectdhurandhar.automationlabs.online/admin/comments`,
  });
}

/**
 * Send email verification link to user
 */
export async function sendVerificationEmail(
  to: string,
  verificationUrl: string
): Promise<EmailSendResult> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b1120; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-top: 0;">Verify Your Email Address</h2>
      <p style="color: #94a3b8; font-size: 14px;">Welcome to Project Dhurandhar — Road to ₹30CR Revenue. Please verify your email to activate commenting and community privileges.</p>
      
      <div style="margin: 28px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: #38bdf8; color: #020617; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
          Confirm Email Address →
        </a>
      </div>
      
      <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
        If you did not create an account on Project Dhurandhar, you can safely ignore this email.<br/>
        This link will expire in 24 hours.
      </p>
      <p style="margin-top: 24px; font-size: 11px; color: #475569; border-top: 1px solid #1e293b; padding-top: 16px;">
        Project Dhurandhar • mail.automationlabs.online
      </p>
    </div>
  `;

  return sendTransactionalEmail({
    to,
    subject: "Confirm your Project Dhurandhar account",
    html,
    text: `Confirm your Project Dhurandhar account: ${verificationUrl}`,
  });
}

/**
 * Send password reset link to user
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<EmailSendResult> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b1120; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #f59e0b; margin-top: 0;">Reset Your Password</h2>
      <p style="color: #94a3b8; font-size: 14px;">We received a request to reset the password for your Project Dhurandhar account.</p>
      
      <div style="margin: 28px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #f59e0b; color: #020617; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
          Set New Password →
        </a>
      </div>
      
      <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.<br/>
        For security, this link is valid for 1 hour.
      </p>
      <p style="margin-top: 24px; font-size: 11px; color: #475569; border-top: 1px solid #1e293b; padding-top: 16px;">
        Project Dhurandhar Control Center • mail.automationlabs.online
      </p>
    </div>
  `;

  return sendTransactionalEmail({
    to,
    subject: "Reset your Project Dhurandhar password",
    html,
    text: `Reset your Project Dhurandhar password: ${resetUrl}`,
  });
}

