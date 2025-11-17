/**
 * POST /api/auth/logout
 * User logout endpoint
 */

import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { 
  successResponse, 
  internalErrorResponse,
} from '@/app/api/_utils/response';
import { withCors } from '@/middleware/cors';
import { withLogging } from '@/middleware/logging';
import { withErrorHandler } from '@/middleware/errorHandler';

async function logoutHandler(req: NextRequest) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('Supabase logout failed', error);
        return internalErrorResponse('Logout failed');
      }
    }

    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Error in /api/auth/logout', error);
    return internalErrorResponse('Internal server error');
  }
}

// Apply middleware
export const POST = withErrorHandler(
  withLogging(
    withCors(logoutHandler)
  )
);