import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { PLATFORM } from "@/lib/constants";
import { z } from "zod";
import { escapeHtml } from "@/lib/utils";
import { withApiRateLimit } from "@/middleware/rateLimit";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

async function handleContact(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
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
        console.error("Failed to save contact submission:", dbError);
        return NextResponse.json(
          { error: "Failed to submit request" },
          { status: 500 }
        );
      }
    } else {
      console.log("Skipping DB insert (DISABLE_DB_INSERT=true)");
    }

    // Sanitize inputs for email HTML context
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // 2. Send email to support
    const emailResult = await sendEmail({
      to: PLATFORM.SUPPORT_EMAIL,
      subject: `[Contact Form] ${subject}`, // Plain text subject
      replyTo: email,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, "<br>")}</p>
      `,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    });

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // We still return success because the DB record was created
      // But we log the error for investigation
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withApiRateLimit(handleContact);
