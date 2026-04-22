"use client";

import { useState } from "react";
import { AlertCircle, Edit, Trash2, UploadCloud } from "lucide-react";
import { useVendorProducts, VendorProduct } from "@/hooks/useVendorProducts";

interface ProductFormState { title: string; description: string; product_url: string; category_id: string; images: string; is_active: boolean; is_archived: boolean; }
const initialFormState: ProductFormState = { title: "", description: "", product_url: "", category_id: "", images: "", is_active: false, is_archived: false };

function parseImagesInput(value: string): string[] { return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean); }

function formatDate(dateString?: string) { if (!dateString) return "\u2014"; try { return new Date(dateString).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }); } catch { return dateString; } }

export default function VendorProductsPage() {
  const { products, stats, createProduct, updateProduct, deleteProduct, refresh } = useVendorProducts();
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "fetching">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormState((prev) => ({ ...prev, [name]: value })); };
  const handleToggleActive = (value: boolean) => { setFormState((prev) => ({ ...prev, is_active: value })); };
  const resetForm = () => { setFormState(initialFormState); setEditingProductId(null); setFormError(null); };
  const handleEditProduct = (product: VendorProduct) => { setEditingProductId(product.id); setFormState({ title: product.title ?? "", description: product.description ?? "", product_url: product.product_url ?? "", category_id: product.category_id?.toString() ?? "", images: (product.image_urls ?? []).join("\n"), is_active: Boolean(product.is_active), is_archived: Boolean(product.is_archived) }); };

  const handleUrlPaste = async (e: React.ClipboardEvent | React.FocusEvent<HTMLInputElement>) => {
    let url = ""; if ("clipboardData" in e) url = e.clipboardData.getData("text"); else url = e.target.value;
    if (!url || !url.startsWith("http")) return;
    setTimeout(async () => { if (formState.title && formState.description) return; setFormStatus("fetching"); try { const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`); if (res.ok) { const data = await res.json(); setFormState((prev) => ({ ...prev, title: prev.title || data.title || "", description: prev.description || data.description || "", images: prev.images || data.image || "" })); } } catch {} finally { setFormStatus("idle"); } }, 100);
  };

  const handleDelete = async (productId: string) => { if (!confirm("Delete this product?")) return; setFormError(null); try { await deleteProduct(productId); if (editingProductId === productId) resetForm(); } catch (err) { setFormError(err instanceof Error ? err.message : "Unable to delete."); } };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setFormStatus("saving"); setFormError(null);
    const payload = { title: formState.title.trim(), description: formState.description.trim(), product_url: formState.product_url.trim(), category_id: parseInt(formState.category_id) || undefined, images: parseImagesInput(formState.images), is_active: formState.is_active, is_archived: formState.is_archived };
    if (!payload.product_url) { setFormError("Product URL is required."); setFormStatus("idle"); return; }
    try { if (editingProductId) await updateProduct(editingProductId, payload); else await createProduct(payload); resetForm(); } catch (err) { setFormError(err instanceof Error ? err.message : "Unable to save."); } finally { setFormStatus("idle"); }
  };

  return (
    <div className="space-y-12 pb-24" data-testid="vendor-products">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Product Management</h1>
          <p className="text-sm mt-1 max-w-xl" style={{ color: "var(--text-tertiary)" }}>Manage your listings and external routing.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Slots</p>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{stats?.totalProducts ?? 0} / 10</p>
          </div>
          <button onClick={refresh} className="p-2.5 rounded-xl transition-all hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text-tertiary)" }} title="Refresh"><UploadCloud className="w-4 h-4" /></button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
        {/* Form */}
        <section className="rounded-2xl p-8 lg:p-10 space-y-8" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editingProductId ? "Edit Product" : "Add Product"}</h2>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Configure product details</p>
            </div>
            {editingProductId && <button type="button" onClick={resetForm} className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Cancel</button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Product URL</label>
              <div className="relative">
                <input required name="product_url" type="url" value={formState.product_url} onChange={handleInputChange} onPaste={handleUrlPaste} onBlur={handleUrlPaste} placeholder="https://your-site.com/product" className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                {formStatus === "fetching" && <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="w-4 h-4 border-t-2 rounded-full animate-spin" style={{ borderColor: "var(--accent-atmosphere)" }} /></div>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Title</label><input required name="title" value={formState.title} onChange={handleInputChange} placeholder="Product name" className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>
              <div><label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Category ID</label><input name="category_id" type="number" value={formState.category_id} onChange={handleInputChange} placeholder="1" className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>
            </div>
            <div><label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Description</label><textarea required name="description" value={formState.description} onChange={handleInputChange} rows={3} placeholder="What does this product do?" className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>
            <div><label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Image URLs (one per line)</label><textarea name="images" value={formState.images} onChange={handleInputChange} rows={2} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>

            <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <button type="button" onClick={() => handleToggleActive(!formState.is_active)} className="w-10 h-5 px-1 rounded-full transition-colors flex items-center" style={{ background: formState.is_active ? "var(--accent-atmosphere)" : "rgba(255,255,255,0.1)" }}>
                <div className="w-3 h-3 rounded-full transition-transform" style={{ background: formState.is_active ? "white" : "rgba(255,255,255,0.4)", transform: formState.is_active ? "translateX(20px)" : "translateX(0)" }} />
              </button>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Visible in directory</span>
            </div>

            {formError && <div className="p-3 rounded-xl text-sm flex items-center gap-2" style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444" }}><AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}</div>}
            <button type="submit" disabled={formStatus === "saving"} className="btn-primary w-full justify-center disabled:opacity-30">{formStatus === "saving" ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}</button>
          </form>
        </section>

        {/* List */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 lg:p-8" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>Your Products</h2><span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{products.length} items</span></div>
            {products.length === 0 ? (
              <div className="py-16 text-center rounded-xl" style={{ background: "var(--bg-surface-2)", border: "1px dashed var(--border)" }}><p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No products yet</p></div>
            ) : (
              <div style={{ borderTop: "1px solid var(--border)" }}>
                {products.map((product) => (
                  <div key={product.id} className="py-4 flex items-start justify-between group" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{product.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{product.is_active ? "Live" : "Draft"} &middot; {formatDate(product.updated_at ?? undefined)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditProduct(product as VendorProduct)} className="p-2 rounded-lg transition-all hover:bg-white/5" style={{ color: "var(--text-tertiary)" }} title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg transition-all hover:bg-red-500/10" style={{ color: "var(--text-tertiary)" }} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
