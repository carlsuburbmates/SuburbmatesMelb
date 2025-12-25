/**
 * SuburbMates V1.1 - Email Service
 * Transactional emails via Resend
 */

import { Resend } from 'resend';
import { PLATFORM } from './constants';

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
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
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
        <li>Browse local digital products from Melbourne businesses</li>
        <li>Create a free business directory profile</li>
        <li>Upgrade to become a vendor and sell your own digital products</li>
      </ul>
      <p>Get started by exploring our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/marketplace">marketplace</a> or <a href="${process.env.NEXT_PUBLIC_SITE_URL}/directory">directory</a>.</p>
      <p>Need help? Reply to this email or contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
    text: `Welcome to ${PLATFORM.NAME}!\n\nHi ${name},\n\nThanks for joining ${PLATFORM.NAME}. You can now browse local products, create a business profile, or become a vendor.\n\nVisit: ${process.env.NEXT_PUBLIC_SITE_URL}\n\nCheers,\nThe ${PLATFORM.NAME} Team`,
  });
}

/**
 * Vendor onboarding started
 */
export async function sendVendorOnboardingEmail(email: string, businessName: string, onboardingUrl: string): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: 'Complete Your Vendor Onboarding',
    html: `
      <h1>Welcome, ${businessName}! 🎉</h1>
      <p>You're almost ready to start selling on ${PLATFORM.NAME}.</p>
      <p>To complete your vendor setup, please finish your Stripe Connect onboarding:</p>
      <p><a href="${onboardingUrl}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Onboarding</a></p>
      <p>Once complete, you'll be able to:</p>
      <ul>
        <li>List up to 10 products (Basic tier)</li>
        <li>Receive payments directly to your account</li>
        <li>Manage orders and refunds</li>
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

export async function sendTierDowngradeEmail(params: {
  to: string;
  businessName: string;
  oldTier: string;
  newTier: string;
  unpublishedCount: number;
  productTitles: string[];
}): Promise<EmailResult> {
  const previewTitles = params.productTitles.slice(0, 5);
  const remaining = params.productTitles.length - previewTitles.length;
  const listHtml = previewTitles
    .map((title) => `<li>${title || "Untitled product"}</li>`)
    .join("");

  return sendEmail({
    to: params.to,
    subject: `Tier changed to ${params.newTier.toUpperCase()} — ${params.unpublishedCount} product(s) unpublished`,
    html: `
      <h1>Heads up from ${PLATFORM.NAME}</h1>
      <p>${params.businessName} was downgraded from <strong>${params.oldTier.toUpperCase()}</strong> to <strong>${params.newTier.toUpperCase()}</strong>.</p>
      <p>We automatically unpublished <strong>${params.unpublishedCount}</strong> of your oldest products so you stay within the new tier limit.</p>
      ${previewTitles.length ? `<p>Recently unpublished items:</p><ul>${listHtml}</ul>` : ""}
      ${remaining > 0 ? `<p>and ${remaining} more…</p>` : ""}
      <p>You can review and republish products from your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/vendor/products">dashboard</a> whenever you're ready.</p>
      <p>Questions? Reply to this email or contact ${PLATFORM.SUPPORT_EMAIL}.</p>
    `,
  });
}

/**
 * Order confirmation for customer
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderId: string;
    productTitle: string;
    amount: number;
    downloadUrl?: string;
  }
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderDetails.productTitle}`,
    html: `
      <h1>Thank you for your purchase! 🎉</h1>
      <p>Your order has been confirmed.</p>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Product:</strong> ${orderDetails.productTitle}</p>
      <p><strong>Amount:</strong> A$${(orderDetails.amount / 100).toFixed(2)}</p>
      ${orderDetails.downloadUrl ? `
        <p><strong>Download Link:</strong></p>
        <p><a href="${orderDetails.downloadUrl}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Product</a></p>
        <p><small>This link will expire in 7 days.</small></p>
      ` : ''}
      <p>Need help? Contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

/**
 * New order notification for vendor
 */
export async function sendNewOrderNotificationEmail(
  email: string,
  orderDetails: {
    orderId: string;
    productTitle: string;
    customerEmail: string;
    amount: number;
    commission: number;
    netAmount: number;
  }
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: `New Order - ${orderDetails.productTitle}`,
    html: `
      <h1>You have a new order! 🎉</h1>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Product:</strong> ${orderDetails.productTitle}</p>
      <p><strong>Customer:</strong> ${orderDetails.customerEmail}</p>
      <p><strong>Sale Amount:</strong> A$${(orderDetails.amount / 100).toFixed(2)}</p>
      <p><strong>Platform Fee:</strong> A$${(orderDetails.commission / 100).toFixed(2)}</p>
      <p><strong>Your Earnings:</strong> A$${(orderDetails.netAmount / 100).toFixed(2)}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order</a></p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

/**
 * Refund request notification for vendor
 */
export async function sendRefundRequestEmail(
  email: string,
  refundDetails: {
    orderId: string;
    productTitle: string;
    customerEmail: string;
    reason: string;
    amount: number;
  }
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: `Refund Request - ${refundDetails.productTitle}`,
    html: `
      <h1>Refund Request Received</h1>
      <p>A customer has requested a refund for one of your products.</p>
      <h2>Refund Details</h2>
      <p><strong>Order ID:</strong> ${refundDetails.orderId}</p>
      <p><strong>Product:</strong> ${refundDetails.productTitle}</p>
      <p><strong>Customer:</strong> ${refundDetails.customerEmail}</p>
      <p><strong>Refund Amount:</strong> A$${(refundDetails.amount / 100).toFixed(2)}</p>
      <p><strong>Reason:</strong> ${refundDetails.reason}</p>
      <p><strong>⚠️ Important:</strong> As the merchant of record, you are responsible for processing this refund through your Stripe dashboard.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/refunds" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Refund Request</a></p>
      <p>Please review and process within 7 days to maintain good standing.</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

/**
 * Refund processed confirmation for customer
 */
export async function sendRefundConfirmationEmail(
  email: string,
  refundDetails: {
    orderId: string;
    productTitle: string;
    amount: number;
  }
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: `Refund Processed - ${refundDetails.productTitle}`,
    html: `
      <h1>Refund Processed</h1>
      <p>Your refund has been processed by the vendor.</p>
      <h2>Refund Details</h2>
      <p><strong>Order ID:</strong> ${refundDetails.orderId}</p>
      <p><strong>Product:</strong> ${refundDetails.productTitle}</p>
      <p><strong>Refund Amount:</strong> A$${(refundDetails.amount / 100).toFixed(2)}</p>
      <p>The refund will appear in your account within 5-10 business days.</p>
      <p>Questions? Contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
      <p>Cheers,<br>The ${PLATFORM.NAME} Team</p>
    `,
  });
}

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
      <p>Your vendor account has been suspended.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>You have 14 days to appeal this decision.</strong></p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/appeals" style="background: #ff4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Submit Appeal</a></p>
      <p>For more information, contact us at ${PLATFORM.SUPPORT_EMAIL}</p>
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
 * Business contact form email
 */
export async function sendBusinessContactEmail(params: {
  toEmail: string;
  businessName: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: params.toEmail,
    replyTo: params.senderEmail,
    subject: `New Message from ${params.senderName} via ${PLATFORM.NAME}`,
    html: `
      <h1>New Message for ${params.businessName}</h1>
      <p>You have received a new inquiry via your SuburbMates profile.</p>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>From:</strong> ${params.senderName}</p>
        <p><strong>Email:</strong> <a href="mailto:${params.senderEmail}">${params.senderEmail}</a></p>
        ${params.senderPhone ? `<p><strong>Phone:</strong> <a href="tel:${params.senderPhone}">${params.senderPhone}</a></p>` : ''}

        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${params.message}</p>
      </div>

      <p>You can reply directly to this email to contact ${params.senderName}.</p>
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
