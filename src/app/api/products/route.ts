import { withApiRateLimit } from '@/middleware/rateLimit';
import { withErrorHandler } from '@/middleware/errorHandler';
import { withLogging } from '@/middleware/logging';
import { productsHandler } from './products.logic';

export const GET = withErrorHandler(
  withLogging(
    withApiRateLimit(productsHandler)
  )
);
