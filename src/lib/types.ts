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

export interface BusinessImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface BusinessProfileExtended {
  id: string;
  business_name: string;
  profile_description?: string | null;
  profile_image_url?: string | null;
  created_at?: string | null;
  user_id: string;
  suburb?: string;
  category?: string;
  email?: string;
  address?: string;
  phone?: string | null;
  website?: string | null;
  is_vendor?: boolean | null;
  product_count?: number;
  abn_verified?: boolean;
  images?: BusinessImage[];
  template_key?: string | null;
  slug?: string;
  business_hours?: Record<string, string>;
  specialties?: string[];
  social_media?: Record<string, string>;
}

export interface MappedBusinessProfile {
  name: string;
  slug: string;
  description: string;
  location: string;
  address?: string;
  category?: string;
  heroImage: string;
  logoUrl: string; // derived from images or placeholder
  verified: boolean;
  isVendor: boolean;
  sections: {
    about: boolean;
    products: boolean;
    gallery: boolean;
    contact: boolean;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
  };
  rating: number;
  reviewCount: number;
  createdAt: string;
  businessHours?: Record<string, string>;
  specialties?: string[];
  socialMedia?: Record<string, string>;
  yearsActive?: number;
  clientsServed?: number;
  awards?: string[];
  certifications?: string[];
  achievements?: {
    icon: string;
    title: string;
    value: string;
    description: string;
  }[];
}
