"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";

export interface VendorProduct {
  id: string;
  title: string;
  description?: string| null;
  category_id?: number | null;
  product_url: string;
  slug?: string | null;
  image_urls?: string[] | null;
  is_active: boolean;
  is_archived: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}


export interface VendorProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  featuredSlots: number;
  lastUpdated: string | null;
}

interface ProductPayload {
  title: string;
  description: string;
  product_url: string;
  category_id?: number;
  images?: string[];
  is_active?: boolean;
  is_archived?: boolean;
}


interface VendorProductsResponse {
  products: VendorProduct[];
  stats: VendorProductStats;
}

export function useVendorProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [stats, setStats] = useState<VendorProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!token) {
      setProducts([]);
      setStats(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/vendor/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        success: boolean;
        data?: VendorProductsResponse;
        error?: { message?: string };
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(
          payload.error?.message ?? "Unable to load vendor products"
        );
      }

      setProducts(payload.data.products ?? []);
      setStats(payload.data.stats ?? null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const init = async () => {
      await fetchProducts();
    };
    init();
  }, [fetchProducts]);

  const createProduct = useCallback(
    async (payload: ProductPayload) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/vendor/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ?? "Unable to create product, please try again."
        );
      }

      await fetchProducts();
      return data.data.product as VendorProduct;
    },
    [token, fetchProducts]
  );

  const updateProduct = useCallback(
    async (productId: string, payload: Partial<ProductPayload>) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ?? "Unable to update product. Please try again."
        );
      }

      await fetchProducts();
      return data.data.product as VendorProduct;
    },
    [token, fetchProducts]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(
          data.error?.message ?? "Unable to delete product. Please try again."
        );
      }

      await fetchProducts();
    },
    [token, fetchProducts]
  );

  return {
    products,
    stats,
    isLoading,
    error,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
