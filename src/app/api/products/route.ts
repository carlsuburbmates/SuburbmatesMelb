import { withApiRateLimit, withLogging, withErrorHandler } from '@/middleware';
import { getProducts } from './products.logic';

export const GET = withErrorHandler(withLogging(withApiRateLimit(getProducts)));
