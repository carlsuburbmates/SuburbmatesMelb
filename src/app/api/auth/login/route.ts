/**
 * POST /api/auth/login
 * User login endpoint
 */

import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { userLoginSchema } from '@/lib/validation';
import { logger, logEvent, BusinessEvent, logSecurityEvent, SecurityEvent } from '@/lib/logger';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
} from '@/app/api/_utils/response';
import { withAuthRateLimit } from '@/middleware/rateLimit';
import { withCors } from '@/middleware/cors';
import { withLogging } from '@/middleware/logging';
import { withErrorHandler } from '@/middleware/errorHandler';
import { ValidationError } from '@/lib/errors';
import { Vendor } from '@/lib/types';

async function loginHandler(req: NextRequest) {
  try {
    // Validate request body
    const body = await validateBody(userLoginSchema, req);

    logger.info('User login (OTP) attempt', { email: body.email });

    // Send Magic Link (OTP) via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: body.email,
      options: {
        emailRedirectTo: `${req.nextUrl.origin}/auth/callback`,
      },
    });

    if (error) {
      logger.warn('Login (OTP) failed', { email: body.email, error: error.message });
      logSecurityEvent(SecurityEvent.AUTH_FAILED, { 
        email: body.email,
        reason: error.message,
      });
      return internalErrorResponse('Failed to send magic link. Please try again later.');
    }

    // Log business event
    logEvent(BusinessEvent.USER_LOGIN_ATTEMPT, {
      email: body.email,
    });

    logSecurityEvent(SecurityEvent.AUTH_SUCCESS, {
      email: body.email,
      context: 'magic_link_sent'
    });

    logger.info('Magic link sent successfully', { email: body.email });

    return successResponse({
      message: 'Magic link sent. Please check your email.',
      email: body.email
    });
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
      withAuthRateLimit(loginHandler)
    )
  )
);
