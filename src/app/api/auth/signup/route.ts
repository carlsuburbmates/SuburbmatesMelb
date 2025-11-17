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

    logger.info('User signup attempt', { email: body.email, userType: body.user_type });

    let createdUserId: string | null = null;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          first_name: body.first_name,
          last_name: body.last_name,
          user_type: body.user_type,
        },
      });

      if (error) {
        logger.warn('Supabase admin signup failed', { email: body.email, error: error.message });
        return badRequestResponse(error.message);
      }

      createdUserId = data.user?.id ?? null;
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            first_name: body.first_name,
            last_name: body.last_name,
            user_type: body.user_type,
          },
        },
      });

      if (error) {
        logger.warn('Supabase auth signup failed', { email: body.email, error: error.message });
        return badRequestResponse(error.message);
      }

      createdUserId = data.user?.id ?? null;
    }

    if (!createdUserId) {
      return internalErrorResponse('User registration failed');
    }

    // Create user record in database
    const dbClient = supabaseAdmin ?? supabase;
    const { error: dbError } = await dbClient.from('users').insert({
      id: createdUserId,
      email: body.email,
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      user_type: body.user_type,
      deleted_at: null,
      created_as_business_owner_at: null,
    } as any);

    if (dbError) {
      logger.error('Failed to create user in database', dbError, { userId: createdUserId });
      return internalErrorResponse(`Database error: ${dbError.message}`);
    }

    // Log business event
    logEvent(BusinessEvent.USER_SIGNUP, {
      userId: createdUserId,
      email: body.email,
      userType: body.user_type,
    });

    // Send welcome email (async, don't block response)
    sendWelcomeEmail(body.email, body.first_name).catch((error) => {
      logger.error('Failed to send welcome email', error, {
        userId: createdUserId,
        email: body.email,
      });
    });

    logger.info('User signup successful', { userId: createdUserId });

    return successResponse(
      {
        message: 'User registered successfully. Please check your email.',
        user: {
          id: createdUserId,
          email: body.email,
          user_type: body.user_type,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error.details?.fields as Record<string, string>);
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
