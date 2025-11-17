import { NextRequest } from "next/server";
import { zodErrorToValidationError } from "@/lib/errors";
import {
  ProductCreate,
  ProductUpdate,
  productCreateSchema,
  productUpdateSchema,
} from "@/lib/validation";
import type { ZodTypeAny } from "zod";

type JsonRecord = Record<string, unknown>;

function normalizeProductPayload(raw: JsonRecord): JsonRecord {
  const normalized: JsonRecord = { ...raw };

  if (!normalized.title && typeof raw.name === "string") {
    normalized.title = raw.name;
  }

  if (!normalized.description && typeof raw.details === "string") {
    normalized.description = raw.details;
  }

  if (normalized.published === undefined) {
    if (typeof raw.status === "string") {
      normalized.published = raw.status === "published";
    } else if (typeof raw.status === "boolean") {
      normalized.published = raw.status;
    }
  }

  if (typeof normalized.price === "string") {
    const parsed = parseFloat(normalized.price);
    if (!Number.isNaN(parsed)) {
      normalized.price = parsed;
    }
  }

  if (
    normalized.images === undefined &&
    (Array.isArray(raw.image) || typeof raw.image === "string")
  ) {
    normalized.images = Array.isArray(raw.image)
      ? raw.image
      : [raw.image as string];
  }

  return normalized;
}

function validatePayload<T>(
  schema: ZodTypeAny,
  payload: JsonRecord
): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw zodErrorToValidationError({
      issues: result.error.issues.map((issue) => ({
        path: issue.path.map((segment) => String(segment)),
        message: issue.message,
      })),
    });
  }

  return result.data as T;
}

export async function parseProductCreateRequest(
  req: NextRequest
): Promise<ProductCreate> {
  const raw = (await req.json()) as JsonRecord;
  const normalized = normalizeProductPayload(raw);
  return validatePayload<ProductCreate>(productCreateSchema, normalized);
}

export async function parseProductUpdateRequest(
  req: NextRequest
): Promise<ProductUpdate> {
  const raw = (await req.json()) as JsonRecord;
  const normalized = normalizeProductPayload(raw);
  return validatePayload<ProductUpdate>(productUpdateSchema, normalized);
}
