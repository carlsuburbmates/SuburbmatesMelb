import { NextRequest } from 'next/server';
import { validateBody } from '@/app/api/_utils/validation';
import { contactFormSchema } from '@/lib/validation';
import { sendContactFormEmail } from '@/lib/email';
import { successResponse, internalErrorResponse } from '@/app/api/_utils/response';
import { withErrorHandler } from '@/middleware/errorHandler';
import { withCors } from '@/middleware/cors';
import { withLogging } from '@/middleware/logging';

async function contactHandler(req: NextRequest) {
  const body = await validateBody(contactFormSchema, req);

  const result = await sendContactFormEmail(body);

  if (!result.success) {
    return internalErrorResponse('Failed to send message');
  }

  return successResponse({ message: 'Message sent successfully' });
}

export const POST = withErrorHandler(withLogging(withCors(contactHandler)));
