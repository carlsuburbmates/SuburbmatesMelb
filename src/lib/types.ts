/**
 * Shared TypeScript types for SuburbMates application
 */

import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

// Canonical database-derived models
export type User = Tables["users"]["Row"];
export type Vendor = Tables["vendors"]["Row"];
export type Product = Tables["products"]["Row"];
export type BusinessProfile = Tables["business_profiles"]["Row"];

// API helpers
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  businesses?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AuthSession {
  user: User;
  vendor?: Vendor | null;
  token: string;
}

export interface ProductWithVendor extends Product {
  vendors: Vendor;
}

export interface BusinessProfileWithUser extends BusinessProfile {
  users: {
    email: string;
    user_type: string | null;
  };
}
