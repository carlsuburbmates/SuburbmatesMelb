/**
 * POST /api/contact
 * Public contact form submission
 */

import { NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { PLATFORM } from "@/lib/constants";
import { z } from "zod";
import { escapeHtml } from "@/lib/utils";
import { withApiRateLimit } from "@/middleware/rateLimit";
import { withLogging } from "@/middleware/logging";
import { withErrorHandler } from "@/middleware/errorHandler";
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse
} from "@/app/api/_utils/response";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

async function contactHandler(request: NextRequest) {
  const body = await request.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return validationErrorResponse(errors);
  }

  const { name, email, subject, message } = result.data;

  // 1. Store in Database
  if (process.env.DISABLE_DB_INSERT !== "true") {
    // Use supabaseAdmin if available (bypasses RLS) or standard supabase client (subject to public insert policy)
    const db = supabaseAdmin || supabase;

    const { error: dbError } = await db.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
      status: "new",
    });

    if (dbError) {
      logger.error("Failed to save contact submission:", dbError);
      return internalErrorResponse("Failed to submit request");
    }
  } else {
    logger.info("Skipping DB insert (DISABLE_DB_INSERT=true)");
  }

  // 2. Sanitize inputs for HTML email
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  // Sanitize message BEFORE converting newlines to <br> to prevent double escaping or injection
  const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br>");

  // 3. Send email to support
  const emailResult = await sendEmail({
    to: PLATFORM.SUPPORT_EMAIL,
    subject: `[Contact Form] ${safeSubject}`,
    replyTo: email, // Valid email from schema
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessageHtml}</p>
    `,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
  });

  if (!emailResult.success) {
    logger.error("Failed to send email:", emailResult.error);
    // We still return success because the DB record was created
  }

  return successResponse({ message: "Message sent successfully" });
}

// Apply middleware chain
export const POST = withErrorHandler(
  withLogging(
    withApiRateLimit(contactHandler)
  )
);
