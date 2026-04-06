"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Edit, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { useVendorProducts, VendorProduct } from "@/hooks/useVendorProducts";

interface ProductFormState {
  title: string;
  description: string;
  product_url: string;
  category_id: string; // Keep as string for input, convert to number on submit
  images: string;
  is_active: boolean;
  is_archived: boolean;
}

const initialFormState: ProductFormState = {
  title: "",
  description: "",
  product_url: "",
  category_id: "",
  images: "",
  is_active: false,
  is_archived: false,
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

  const handleToggleActive = (value: boolean) => {
    setFormState((prev) => ({ ...prev, is_active: value }));
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
      product_url: product.product_url ?? "",
      category_id: product.category_id?.toString() ?? "",
      images: (product.image_urls ?? []).join("\n"),
      is_active: Boolean(product.is_active),
      is_archived: Boolean(product.is_archived),
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

const handleToggleStatus = async (product: VendorProduct) => {
  try {
    await updateProduct(product.id, { is_active: !product.is_active });
  } catch (err) {
    setFormError(
      err instanceof Error
        ? err.message
        : "Unable to update status. Please try again."
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
      product_url: formState.product_url.trim(),
      category_id: parseInt(formState.category_id) || undefined,
      images: parseImagesInput(formState.images),
      is_active: formState.is_active,
      is_archived: formState.is_archived,
    };

    if (!payload.product_url) {
      setFormError("Product URL is required.");
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
    <div className="space-y-16 pb-24">
      <header className="pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-ink-primary">
            Asset Management
          </h1>
          <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.2em] mt-3 max-w-xl leading-relaxed">
            Configure directory listings and external routing parameters. Suburbmates tracks interaction signals and surfaces your assets to the local network.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 border border-white/5 bg-ink-surface-1 rounded-sm">
            <p className="text-[8px] font-black text-ink-tertiary uppercase tracking-widest mb-1">Utilization</p>
            <p className="text-sm font-black text-ink-primary tracking-tight">
              {stats?.totalProducts ?? 0} <span className="text-white/20">/</span> 10 SLOTS
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-3 border border-white/5 hover:border-white/20 transition-colors rounded-sm group"
            title="Refresh Data"
          >
            <UploadCloud className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary transition-colors" />
          </button>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.2fr,1fr]">
        {/* Form Container */}
        <section className="bg-ink-surface-1 border border-white/5 p-8 lg:p-12 space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-ink-primary uppercase tracking-[0.3em]">
                {editingProductId ? "Update Sequence" : "Entry Initialization"}
              </h2>
              <p className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest mt-2">
                Configure primary metadata for directory lookup
              </p>
            </div>
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-[9px] font-black text-ink-tertiary uppercase tracking-widest hover:text-ink-primary transition-colors border-b border-white/5 hover:border-white/20 pb-0.5"
              >
                Abort Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-[9px] font-black text-ink-tertiary uppercase tracking-[0.3em]">
                Source URL
              </label>
              <div className="relative">
                <input
                  required
                  name="product_url"
                  type="url"
                  value={formState.product_url}
                  onChange={handleInputChange}
                  onPaste={handleUrlPaste}
                  onBlur={handleUrlPaste}
                  placeholder="HTTPS://YOUR-INSTANCE.COM/PRODUCT-SLUG"
                  className="w-full bg-black border border-white/10 px-6 py-4 text-xs font-bold tracking-wider text-ink-primary focus:border-white/40 outline-none transition-all placeholder:text-white/10 rounded-sm"
                />
                {formStatus === "fetching" && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-t-2 border-white/40 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-[9px] font-black text-ink-tertiary uppercase tracking-[0.3em]">
                  Asset Title
                </label>
                <input
                  required
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="MELBOURNE BRANDING TOOLKIT"
                  className="w-full bg-black border border-white/10 px-6 py-4 text-xs font-bold tracking-wider text-ink-primary focus:border-white/40 outline-none transition-all placeholder:text-white/10 rounded-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[9px] font-black text-ink-tertiary uppercase tracking-[0.3em]">
                  Category Identifier
                </label>
                <input
                  name="category_id"
                  type="number"
                  value={formState.category_id}
                  onChange={handleInputChange}
                  placeholder="01"
                  className="w-full bg-black border border-white/10 px-6 py-4 text-xs font-bold tracking-wider text-ink-primary focus:border-white/40 outline-none transition-all placeholder:text-white/10 rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[9px] font-black text-ink-tertiary uppercase tracking-[0.3em]">
                Functional Description
              </label>
              <textarea
                required
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="DEFINE THE CORE VALUE PROPOSITION FOR LOCAL BUYERS."
                className="w-full bg-black border border-white/10 px-6 py-4 text-xs font-bold tracking-wider text-ink-primary focus:border-white/40 outline-none transition-all placeholder:text-white/10 rounded-sm resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[9px] font-black text-ink-tertiary uppercase tracking-[0.3em]">
                Visual Assets (ONE PER LINE)
              </label>
              <textarea
                name="images"
                value={formState.images}
                onChange={handleInputChange}
                rows={3}
                placeholder="HTTPS://EXAMPLE.COM/ASSET-01.JPG"
                className="w-full bg-black border border-white/10 px-6 py-4 text-xs font-bold tracking-wider text-ink-primary focus:border-white/40 outline-none transition-all placeholder:text-white/10 rounded-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleToggleActive(!formState.is_active)}
                  className={`w-10 h-5 px-1 rounded-full transition-colors flex items-center ${
                    formState.is_active ? "bg-white" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-transform ${
                      formState.is_active
                        ? "translate-x-5 bg-black"
                        : "translate-x-0 bg-white/40"
                    }`}
                  />
                </button>
                <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">
                  Live Status Protocol
                </span>
              </div>
            </div>

            {formError && (
              <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-sm text-[10px] font-bold uppercase tracking-widest text-red-400">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === "saving"}
              className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group rounded-sm"
            >
              {formStatus === "saving" ? (
                "Processing..."
              ) : (
                <span className="flex items-center justify-center gap-3">
                  {editingProductId ? "Update Asset" : "Initialize Asset"}
                </span>
              )}
            </button>
          </form>
        </section>

        {/* List Container */}
        <div className="space-y-8">
          <section className="bg-ink-surface-1 border border-white/5 p-8 lg:p-12 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-ink-primary uppercase tracking-[0.3em]">
                Portfolio Feed
              </h2>
              <span className="text-[10px] font-black text-ink-tertiary uppercase tracking-widest">
                {products.length} INSTANCES
              </span>
            </div>

            {products.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/5">
                <p className="text-[10px] font-black text-ink-tertiary uppercase tracking-[0.4em]">
                  Portfolio Empty
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {products.map((product) => (
                  <div key={product.id} className="py-8 space-y-6 group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[11px] font-black text-ink-primary uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest mt-1">
                          {product.is_active ? "Signal Active" : "Signal Dormant"} • {formatDate(product.updated_at ?? undefined)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditProduct(product as VendorProduct)}
                          className="p-2 border border-white/5 rounded-sm hover:border-white/20 hover:bg-white/5 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 text-white/40" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 border border-white/5 rounded-sm hover:border-red-900/40 hover:bg-red-900/10 transition-all group"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white/20 group-hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Guidelines */}
          <section className="bg-black/40 border border-white/5 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-4 h-4 text-white/20" />
              <h3 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.3em]">
                Listing Protocols
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                "No client service promises or direct support links.",
                "External URLs must resolve directly to source pages.",
                "FIFO logic deactivates oldest assets if over quota.",
                "Region featured slots require separate allocation."
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-white/10 text-[9px] mt-0.5">0{i+1}</span>
                  <p className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider leading-relaxed">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
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
