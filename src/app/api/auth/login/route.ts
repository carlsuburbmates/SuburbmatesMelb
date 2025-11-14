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
  unauthorizedResponse,
  validationErrorResponse,
  internalErrorResponse,
} from '@/app/api/_utils/response';
import { validateBody } from '@/app/api/_utils/validation';
import { withAuthRateLimit } from '@/middleware/rateLimit';
import { withCors } from '@/middleware/cors';
import { withLogging } from '@/middleware/logging';
import { withErrorHandler } from '@/middleware/errorHandler';
import { ValidationError } from '@/lib/errors';

async function loginHandler(req: NextRequest) {
  try {
    // Validate request body
    const body = await validateBody(userLoginSchema, req);

    logger.info('User login attempt', { email: body.email });

    // Sign in user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      logger.warn('Login failed - invalid credentials', { email: body.email });
      logSecurityEvent(SecurityEvent.AUTH_FAILED, { 
        email: body.email,
        reason: error.message,
      });
      return unauthorizedResponse('Invalid email or password');
    }

    if (!data.user) {
      return internalErrorResponse('Authentication failed');
    }

    // Get user data from database
    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id);

    if (dbError || !users || users.length === 0) {
      logger.error('User not found in database after auth', dbError, { userId: data.user.id });
      return internalErrorResponse('Database error');
    }

    const userData = users[0];

    // Get vendor data if user has vendor account
    let vendorData = null;
    const { data: vendors } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', data.user.id);

    if (vendors && vendors.length > 0) {
      vendorData = vendors[0];
    }

    // Log successful login
    logEvent(BusinessEvent.USER_LOGIN, {
      userId: userData.id,
      email: userData.email,
      userType: userData.user_type,
    });

    logSecurityEvent(SecurityEvent.AUTH_SUCCESS, {
      userId: userData.id,
      email: userData.email,
    });

    logger.info('User login successful', { userId: userData.id });

    return successResponse({
      message: 'Login successful',
      user: {
        ...userData,
        token: data.session?.access_token,
      },
      vendor: vendorData,
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });
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
      withAuthRateLimit(loginHandler)
    )
  )
);