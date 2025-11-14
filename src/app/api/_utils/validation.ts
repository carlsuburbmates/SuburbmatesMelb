/**
 * SuburbMates V1.1 - Request Validation Utilities
 * Validate request data with Zod schemas
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ValidationError, zodErrorToValidationError } from '@/lib/errors';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate request body
 */
export async function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  req: NextRequest
): Promise<z.infer<T>> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      throw zodErrorToValidationError(result.error);
    }

    return result.data;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Invalid request body');
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends z.ZodTypeAny>(
  schema: T,
  req: NextRequest
): z.infer<T> {
  const { searchParams } = new URL(req.url);
  const query: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const result = schema.safeParse(query);

  if (!result.success) {
    throw zodErrorToValidationError(result.error);
  }

  return result.data;
}

/**
 * Validate URL parameters
 */
export function validateParams<T extends z.ZodTypeAny>(
  schema: T,
  params: unknown
): z.infer<T> {
  const result = schema.safeParse(params);

  if (!result.success) {
    throw zodErrorToValidationError(result.error);
  }

  return result.data;
}

/**
 * Validate request headers
 */
export function validateHeaders<T extends z.ZodTypeAny>(
  schema: T,
  req: NextRequest
): z.infer<T> {
  const headers: Record<string, string> = {};

  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const result = schema.safeParse(headers);

  if (!result.success) {
    throw zodErrorToValidationError(result.error);
  }

  return result.data;
}
