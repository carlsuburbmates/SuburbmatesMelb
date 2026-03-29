/**
 * POST /api/auth/signup
 * User registration endpoint
 */

import { NextRequest } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { userSignupSchema } from '@/lib/validation';
import { sendWelcomeEmail } from '@/lib/email';
import { logger, logEvent, BusinessEvent } from '@/lib/logger';
import {
  successResponse,
  badRequestResponse,
  validationErrorResponse,
  internalErrorResponse,
} from '@/app/api/_utils/response';
import { validateBody } from '@/app/api/_utils/validation';
import { withAuthRateLimit } from '@/middleware/rateLimit';
import { withCors } from '@/middleware/cors';
import { withLogging } from '@/middleware/logging';
import { withErrorHandler } from '@/middleware/errorHandler';
import { ValidationError } from '@/lib/errors';

async function signupHandler(req: NextRequest) {
  try {
    // Validate request body
    const body = await validateBody(userSignupSchema, req);

    logger.info('User signup (OTP) attempt', { email: body.email, userType: body.user_type });

    // Initiate Magic Link Signup (Supabase auth will create user if they don't exist)
    const { error } = await supabase.auth.signInWithOtp({
      email: body.email,
      options: {
        emailRedirectTo: `${req.nextUrl.origin}/auth/callback`,
        data: {
          first_name: body.first_name,
          last_name: body.last_name,
          user_type: body.user_type,
        },
      },
    });

    if (error) {
      logger.warn('Signup (OTP) failed', { email: body.email, error: error.message });
      return badRequestResponse(error.message);
    }

    // Log business event
    logEvent(BusinessEvent.USER_SIGNUP_ATTEMPT, {
      email: body.email,
      userType: body.user_type,
    });

    // Send welcome email (async, don't block response)
    // In a pure Magic Link flow, the user record is confirmed ONLY after the link is clicked.
    // However, we can log the attempt.
    logger.info('Magic link sent for signup', { email: body.email });

    return successResponse(
      {
        message: 'Signup initiated. Please check your inbox for a magic link.',
        email: body.email,
      },
      200 // OK, but not yet "Created" since confirmation is pending link click
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error.details?.fields as Record<string, string> || {});
    }
    throw error;
  }
}

// Apply middleware
export const POST = withErrorHandler(
  withLogging(
    withCors(
      withAuthRateLimit(signupHandler)
    )
  )
);
