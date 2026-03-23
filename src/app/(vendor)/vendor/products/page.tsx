"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { useVendorProducts, VendorProduct } from "@/hooks/useVendorProducts";

interface ProductFormState {
  title: string;
  description: string;
  external_url: string;
  category: string;
  images: string;
  published: boolean;
}

const initialFormState: ProductFormState = {
  title: "",
  description: "",
  external_url: "",
  category: "",
  images: "",
  published: false,
};


function parseImagesInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function VendorProductsPage() {
  const {
    products,
    stats,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh,
  } = useVendorProducts();
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "fetching">("idle");
  const [formError, setFormError] = useState<string | null>(null);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePublished = (value: boolean) => {
    setFormState((prev) => ({ ...prev, published: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingProductId(null);
    setFormError(null);
  };

  const handleEditProduct = (product: VendorProduct) => {
    setEditingProductId(product.id);
    setFormState({
      title: product.title ?? "",
      description: product.description ?? "",
      external_url: product.external_url ?? "",
      category: product.category ?? "",
      images: (product.images ?? []).join("\n"),
      published: Boolean(product.published),
    });
  };

  const handleUrlPaste = async (e: React.ClipboardEvent | React.FocusEvent<HTMLInputElement>) => {
    let url = "";
    if ("clipboardData" in e) {
       url = e.clipboardData.getData("text");
    } else {
       url = e.target.value;
    }

    if (!url || !url.startsWith("http")) return;

    // Use a small delay for blur event to ensure state is updated
    setTimeout(async () => {
      if (formState.title && formState.description) return;

      setFormStatus("fetching");
      try {
        const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          setFormState((prev) => ({
            ...prev,
            title: prev.title || data.title || "",
            description: prev.description || data.description || "",
            images: prev.images || data.image || "",
          }));
        }
      } catch (err) {
        console.error("Scraping error:", err);
      } finally {
        setFormStatus("idle");
      }
    }, 100);
  };


const handleDelete = async (productId: string) => {
  if (!confirm("Delete this product? This action cannot be undone.")) {
    return;
  }
  setFormError(null);
  try {
    await deleteProduct(productId);
    if (editingProductId === productId) {
      resetForm();
    }
  } catch (err) {
    setFormError(
      err instanceof Error ? err.message : "Unable to delete product."
    );
  }
};

const handleTogglePublish = async (product: VendorProduct) => {
  try {
    await updateProduct(product.id, { published: !product.published });
  } catch (err) {
    setFormError(
      err instanceof Error
        ? err.message
        : "Unable to update publish status. Please try again."
    );
  }
};

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormStatus("saving");
    setFormError(null);

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      external_url: formState.external_url.trim(),
      category: formState.category.trim() || undefined,
      images: parseImagesInput(formState.images),
      published: formState.published,
    };

    if (!payload.external_url) {
      setFormError("External URL is required.");
      setFormStatus("idle");
      return;
    }


    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
      } else {
        await createProduct(payload);
      }
      resetForm();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to save product. Please try again."
      );
    } finally {
      setFormStatus("idle");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">
          Product management
        </h1>
        <p className="text-gray-600">
          Add products sold through your own external website. SuburbMates
          tracks clicks and surfaces your listings to local buyers.
        </p>

      </div>

      <section className="grid gap-6 lg:grid-cols-[1.15fr,1fr]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProductId ? "Update product" : "Create product"}
              </h2>
              <p className="text-sm text-gray-500">
                {editingProductId
                  ? "Editing an existing listing updates the live product immediately."
                  : "Draft products can be published later without losing data."}
              </p>
            </div>
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-11 min-w-[110px] items-center justify-center rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Reset
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="product-url" className="block text-sm font-medium text-gray-700 mb-1">
                External URL
              </label>
              <div className="relative">
                <input
                  required
                  id="product-url"
                  name="external_url"
                  type="url"
                  value={formState.external_url}
                  onChange={handleInputChange}
                  onPaste={handleUrlPaste}
                  onBlur={handleUrlPaste}
                  placeholder="https://your-site.com/product"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {formStatus === "fetching" && (
                  <div className="absolute right-3 top-3">
                    <Save className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Paste a URL to automatically fetch title, description, and images.
              </p>
            </div>

            <div>
              <label htmlFor="product-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title {formStatus === "fetching" && "(autofilling...)"}
              </label>
              <input
                required
                id="product-title"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                placeholder="e.g. Melbourne Branding Toolkit"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                id="product-description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe what buyers will receive."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  id="product-category"
                  name="category"
                  value={formState.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Digital templates"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>


            <div>
              <label htmlFor="product-images" className="block text-sm font-medium text-gray-700 mb-1">
                Image URLs (max 3, one per line)
              </label>
              <textarea
                id="product-images"
                name="images"
                value={formState.images}
                onChange={handleInputChange}
                rows={3}
                placeholder="https://example.com/cover.jpg"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={formState.published}
                  onChange={(e) => handleTogglePublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-gray-700"
                >
                  Publish immediately
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Publishing respects your tier cap and FIFO downgrade rules.
              </p>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === "saving"}
              className="btn-primary w-full inline-flex items-center justify-center space-x-2"
            >
              {formStatus === "saving" ? (
                <>
                  <Save className="w-4 h-4 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  {editingProductId ? (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Update product</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create product</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <UploadCloud className="w-10 h-10 text-gray-900" />
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">
                Publish checklist
              </p>
              <p className="text-lg font-semibold text-gray-900">
                Approved formats only
              </p>
            </div>
          </div>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• No customer service promises (non-negotiable #2).</li>
            <li>• External links must be direct to product pages.</li>
            <li>
              • FIFO downgrade unpublishes the oldest published products first.
            </li>
            <li>
              • Premium tier unlocks 3 featured slots and analytics exports.
            </li>
          </ul>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-900">
              Tier utilisation
            </p>
            <p className="text-sm text-gray-600">
              {stats?.productQuota
                ? `${stats.totalProducts} of ${stats.productQuota} slots used`
                : "Configure vendor.product_quota to enable per-tier caps."}
            </p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Need more slots?</span>
              <Link href="/pricing" className="font-medium text-gray-900">
                View tiers →
              </Link>
            </div>
          </div>

          <button
            onClick={refresh}
            type="button"
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            Refresh product list
          </button>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Your products
            </h2>
            <p className="text-sm text-gray-500">
              Published and draft entries. Delete operations are permanent.
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {stats?.totalProducts ?? 0} total
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-600">Loading products…</div>
        ) : error ? (
          <div className="p-6 text-red-600 text-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-gray-600 text-sm">
            No products yet. Use the form above to create your first listing.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4">Actions</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {product.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(product.updated_at ?? undefined)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditProduct(product as VendorProduct)
                          }
                          className="inline-flex min-h-[44px] min-w-[110px] items-center justify-center rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(product)}
                          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-full border border-gray-900 px-4 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                        >
                          {product.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex min-h-[44px] min-w-[110px] items-center justify-center rounded-full border border-red-200 px-4 text-sm font-semibold text-red-600 hover:border-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
