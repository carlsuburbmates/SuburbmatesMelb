import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { PLATFORM } from "@/lib/constants";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { withApiRateLimit } from "@/middleware/rateLimit";
import { withLogging } from "@/middleware/logging";
import { withErrorHandler } from "@/middleware/errorHandler";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

async function contactHandler(request: NextRequest) {
  // Sentinel: Added defensive rate limiting and improved logging
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      logger.warn("Invalid contact form submission", { details: result.error.issues });
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
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
        logger.error("Failed to save contact submission", new Error(dbError.message), { code: dbError.code });
        return NextResponse.json(
          { error: "Failed to submit request" },
          { status: 500 }
        );
      }
    } else {
      logger.info("Skipping DB insert (DISABLE_DB_INSERT=true)");
    }

    // 2. Send email to support
    const emailResult = await sendEmail({
      to: PLATFORM.SUPPORT_EMAIL,
      subject: `[Contact Form] ${subject}`,
      replyTo: email,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    });

    if (!emailResult.success) {
      logger.error("Failed to send contact email", emailResult.error);
      // We still return success because the DB record was created
      // But we log the error for investigation
    }

    logger.info("Contact form submitted successfully", { email: email });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Contact form unexpected error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withErrorHandler(
  withLogging(
    withApiRateLimit(contactHandler)
  )
);
