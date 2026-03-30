/**
 * SuburbMates V1.1 - Email Service
 * Transactional emails via Resend
 */

import { Resend } from 'resend';
import { PLATFORM } from './constants';
import { UNIVERSAL_PRODUCT_LIMIT } from './tier-utils';
import { stripNewlines } from './html-sanitizer';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ============================================================================
// BASE EMAIL SENDER
// ============================================================================

/**
 * Send email via Resend
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  if (
    process.env.DISABLE_RATE_LIMIT === 'true' ||
    process.env.SKIP_EMAILS === 'true'
  ) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[email] Skipping send (test mode):', options.subject);
    }
    return { success: true, id: 'test-mode' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: options.from || PLATFORM.NO_REPLY_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: stripNewlines(options.subject),
      html: options.html,
      text: options.text,
      replyTo: options.replyTo ? stripNewlines(options.replyTo) : undefined,
      cc: options.cc,
      bcc: options.bcc,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Welcome email for new customers
 */
export async function sendWelcomeEmail(email: string, firstName?: string): Promise<EmailResult> {
  const name = firstName || 'there';
  
  return sendEmail({
    to: email,
    subject: `Welcome to ${PLATFORM.NAME}!`,
    html: `
      <h1>Welcome to ${PLATFORM.NAME}! 👋</h1>
      <p>Hi ${name},</p>
      <p>Thanks for joining ${PLATFORM.NAME}, Melbourne's hyper-local marketplace for digital products!</p>
      <p>You can now:</p>
      <ul>
        <li>Browse local creators in the Melbourne directory</li>
        <li>Create a free business directory profile</li>
        <li>Upgrade to become a vendor and sell your own digital products</li>
      </ul>
      <p>Get started by exploring our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/regions">creator directory</a>.</p>
      <p>Need help? Reply to this email or contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
    text: `Welcome to ${PLATFORM.NAME}!\n\nHi ${name},\n\nThanks for joining ${PLATFORM.NAME}. You can now browse local products, create a business profile, or become a vendor.\n\nVisit: ${process.env.NEXT_PUBLIC_SITE_URL}\n\nCheers,\nThe ${PLATFORM.NAME} Team`,
  });
}

/**
 * Vendor profile claimed/created
 */
export async function sendVendorOnboardingEmail(email: string, businessName: string, dashboardUrl: string): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: `Welcome to the ${PLATFORM.NAME} Creator Community`,
    html: `
      <h1>Welcome, ${businessName}! 🎉</h1>
      <p>Your directory profile is now ready on ${PLATFORM.NAME}.</p>
      <p>Log in to your dashboard to start adding your digital products:</p>
      <p><a href="${dashboardUrl}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
      <p>Benefits of your free profile:</p>
      <ul>
        <li>List up to ${UNIVERSAL_PRODUCT_LIMIT} products with external links</li>
        <li>Automatic metadata scraping for fast listing</li>
        <li>Direct traffic to your Gumroad, Stripe, or personal store</li>
      </ul>
      <p>Questions? Contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

/**
 * Vendor onboarding complete
 */
export async function sendVendorApprovedEmail(email: string, businessName: string): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: '🎉 Your Vendor Account is Active!',
    html: `
      <h1>Congratulations, ${businessName}! 🎉</h1>
      <p>Your vendor account is now active on ${PLATFORM.NAME}.</p>
      <p>You can now:</p>
      <ul>
        <li>Create and publish digital products</li>
        <li>Accept payments from customers</li>
        <li>Manage your vendor dashboard</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/products" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
      <p>Happy selling!<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

// Tier downgrade emails removed in SSOT v2.0 (Single Tier Model)

// MoR email templates removed in SSOT v2 Phase 2:
// - sendOrderConfirmationEmail
// - sendNewOrderNotificationEmail
// - sendRefundRequestEmail
// - sendRefundConfirmationEmail

/**
 * Vendor suspension warning
 */
export async function sendVendorWarningEmail(
  email: string,
  businessName: string,
  reason: string
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: '⚠️ Account Warning - Action Required',
    html: `
      <h1>Account Warning</h1>
      <p>Hi ${businessName},</p>
      <p>Your vendor account has received a warning:</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please review our policies and take corrective action to avoid account suspension.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background: #ff4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a></p>
      <p>Questions? Contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Regards,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

/**
 * Vendor suspension notice
 */
export async function sendVendorSuspensionEmail(
  email: string,
  businessName: string,
  reason: string
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: '🚨 Account Suspended',
    html: `
      <h1>Account Suspended</h1>
      <p>Hi ${businessName},</p>
      <p>Your directory profile has been suspended.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is an error, please contact us at ${PLATFORM.SUPPORT_EMAIL}.</p>
      <p>Regards,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

/**
 * Appeal decision notification
 */
export async function sendAppealDecisionEmail(
  email: string,
  businessName: string,
  decision: 'approved' | 'rejected',
  notes: string
): Promise<EmailResult> {
  const approved = decision === 'approved';
  
  return sendEmail({
    to: email,
    subject: approved ? '✅ Appeal Approved' : '❌ Appeal Rejected',
    html: `
      <h1>Appeal Decision: ${approved ? 'Approved' : 'Rejected'}</h1>
      <p>Hi ${businessName},</p>
      <p>Your appeal has been ${decision}.</p>
      <p><strong>Decision Notes:</strong></p>
      <p>${notes}</p>
      ${approved ? `
        <p>Your account has been reinstated. You can now resume selling on ${PLATFORM.NAME}.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
      ` : `
        <p>The suspension remains in effect. You may contact us at ${PLATFORM.SUPPORT_EMAIL} for further clarification.</p>
      `}
      <p>Regards,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}


/**
 * Featured slot expiry reminder
 */
export async function sendFeaturedSlotExpiryEmail(
  email: string,
  businessName: string,
  suburb: string,
  expiryDate: string,
  daysRemaining: number
): Promise<EmailResult> {
  const formattedDate = new Date(expiryDate).toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return sendEmail({
    to: email,
    subject: `Featured Slot Expiring Soon - ${suburb}`,
    html: `
      <h1>Your Featured Slot is Expiring Soon</h1>
      <p>Hi ${businessName},</p>
      <p>Your featured slot for <strong>${suburb}</strong> will expire on <strong>${formattedDate}</strong> (in ${daysRemaining} days).</p>
      <p>To keep your top spot and continue getting premium visibility, you can renew your slot from your dashboard.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/vendor/dashboard" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Manage Featured Slots</a></p>
      <p>If you choose not to renew, your slot will become available for other local studios.</p>
      <p>Questions? Contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

// ============================================================================
// BATCH EMAIL
// ============================================================================

/**
 * Send batch emails (useful for notifications)
 */
export async function sendBatchEmails(emails: EmailOptions[]): Promise<EmailResult[]> {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Batch email ${index} failed:`, result.reason);
      return {
        success: false,
        error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
      };
    }
  });
}
