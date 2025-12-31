"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { AlertTriangle, MapPin, Package, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { TIER_LIMITS, FEATURED_SLOT } from "@/lib/constants";

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

/* TIER DETAILS (Outcome-led framing) */
const TIER_DETAILS = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    description: "A simple listing inside the directory.",
    action: "Stay on Basic",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/mo",
    description: "A shareable mini-site that presents your work professionally.",
    action: "Upgrade to Pro",
    highlight: true,
  },
];

function formatDate(dateString?: string | null) {
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

interface TierManagementCardProps {
  currentTier: string;
  tierLoading: boolean;
  tierMessage: string | null;
  tierError: string | null;
  preview: {
    target: string;
    willUnpublish: number;
    affectedProducts: Array<{
      id: string;
      title: string;
      created_at: string | null;
    }>;
  } | null;
  previewLoading: boolean;
  onTierChange: (tier: string) => Promise<void>;
  onPreview: (tier: string) => Promise<void>;
}

function TierManagementCard({
  currentTier,
  tierLoading,
  tierMessage,
  tierError,
  preview,
  previewLoading,
  onTierChange,
  onPreview,
}: TierManagementCardProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Plan & tier
          </h2>
          <p className="text-sm text-gray-500">
            Switch tiers anytime. Downgrades unpublish oldest products first
            (FIFO).
          </p>
        </div>
      </div>

      {(tierError || tierMessage) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            tierError
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {tierError ?? tierMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {TIER_DETAILS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          const isDowngrade = currentTier === "pro" && tier.id === "basic";

          return (
            <div
              key={tier.id}
              className={`rounded-xl border p-4 ${
                isCurrent ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {tier.name}
                  </p>
                  <p className="text-sm text-gray-500">{tier.price}</p>
                </div>
                {isCurrent && (
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
              <div className="space-y-2">
                <button
                  type="button"
                  className={`w-full btn-primary justify-center ${
                    isCurrent || tierLoading ? "opacity-60" : ""
                  }`}
                  disabled={isCurrent || tierLoading}
                  onClick={() => onTierChange(tier.id)}
                >
                  {isCurrent
                    ? "Current plan"
                    : isDowngrade
                    ? "Downgrade to Basic"
                    : "Upgrade to Pro"}
                </button>
                {isDowngrade && !isCurrent && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 min-h-[44px] min-w-[140px]"
                    disabled={previewLoading}
                    onClick={() => onPreview(tier.id)}
                  >
                    {previewLoading && preview?.target === tier.id
                      ? "Loading preview..."
                      : "Preview downgrade impact"}
                  </button>
                )}
                {preview && preview.target === tier.id && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                    {preview.willUnpublish === 0 ? (
                      <p>No products would be unpublished.</p>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          {preview.willUnpublish} product
                          {preview.willUnpublish === 1 ? "" : "s"} would be
                          unpublished (oldest first):
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {preview.affectedProducts.slice(0, 5).map((prod) => (
                            <li key={prod.id}>{prod.title}</li>
                          ))}
                        </ul>
                        {preview.affectedProducts.length > 5 && (
                          <p className="text-xs">
                            +{preview.affectedProducts.length - 5} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface FeaturedPlacementCardProps {
  token: string | null;
}

function FeaturedPlacementCard({ token }: FeaturedPlacementCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<
    Array<{ id: string; suburbLabel: string | null; endDate: string | null }>
  >([]);
  const [queue, setQueue] = useState<
    Array<{ id: string; suburbLabel: string | null; position: number; status: string | null }>
  >([]);
  const [suburbInput, setSuburbInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const suburbFieldId = "featured-slot-suburb";

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch("/api/vendor/featured-slots", {
        headers,
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error?.message ?? "Unable to load featured slots");
      }
      setSlots(json.data.slots ?? []);
      setQueue(json.data.queue ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load featured slots");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!suburbInput.trim()) {
      setError("Please enter a suburb to feature in.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch("/api/vendor/featured-slots", {
        method: "POST",
        headers,
        body: JSON.stringify({ suburb: suburbInput }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error?.message ?? "Unable to request featured slot");
      }
      if (json.data.status === "pending_payment" && json.data.checkoutUrl) {
        setSuccessMessage("Redirecting you to Stripe to complete payment…");
        window.location.href = json.data.checkoutUrl as string;
        return;
      }
      if (json.data.status === "queued") {
        setSuccessMessage(
          `Slots are full. You're queued for ${json.data.suburb} (position #${json.data.position}).`
        );
      } else {
        const scheduledStart = json.data.scheduledStartDate ? new Date(json.data.scheduledStartDate) : new Date();
        const isFuture = scheduledStart.getTime() > Date.now() + 1000 * 60; // 1 min buffer
        
        if (isFuture) {
          setSuccessMessage(
            `Featured placement scheduled to start on ${scheduledStart.toLocaleDateString("en-AU")}.`
          );
        } else {
          setSuccessMessage(`Featured placement activated for the next ${FEATURED_SLOT.DURATION_DAYS} days.`);
        }
      }
      setSuburbInput("");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request featured placement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Featured placement
          </h2>
          <p className="text-sm text-gray-500">
            Promote your business profile at the top of suburb search results.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">
          {successMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Active placements
          </h3>
          {isLoading ? (
            <p className="text-sm text-gray-600">Loading featured slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-gray-600">
              You don&apos;t have any active featured placements yet.
            </p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700">
              {slots.map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{slot.suburbLabel ?? "Unknown suburb"}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Ends {slot.endDate ? new Date(slot.endDate).toLocaleDateString("en-AU") : "soon"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Queue</h3>
          {isLoading ? (
            <p className="text-sm text-gray-600">Loading queue…</p>
          ) : queue.length === 0 ? (
            <p className="text-sm text-gray-600">Not currently queued for any suburbs.</p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700">
              {queue.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                >
                  <span>{entry.suburbLabel ?? "Unknown suburb"}</span>
                  <span className="text-xs text-gray-500">
                    Position #{entry.position}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor={suburbFieldId} className="block text-sm font-medium text-gray-700">
          Request a featured placement
        </label>
        <input
          id={suburbFieldId}
          type="text"
          value={suburbInput}
          onChange={(event) => setSuburbInput(event.target.value)}
          placeholder="e.g. St Kilda"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          disabled={submitting}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Get Featured"}
        </button>
      </form>
    </section>
  );
}

export default function VendorDashboardPage() {
  const { token } = useAuth();
  const { products, stats, isLoading, error, tierUtilization, refresh } =
    useVendorProducts();
  const [tierLoading, setTierLoading] = useState(false);
  const [tierMessage, setTierMessage] = useState<string | null>(null);
  const [tierError, setTierError] = useState<string | null>(null);
  const [preview, setPreview] = useState<
    | {
        target: string;
        willUnpublish: number;
        affectedProducts: Array<{
          id: string;
          title: string;
          created_at: string | null;
        }>;
      }
    | null
  >(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3 text-gray-600">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-gray-900" />
          <p className="text-sm font-medium">Loading dashboard insights…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        <p className="font-semibold">Unable to load dashboard</p>
        <p className="text-sm mt-2">
          {error ?? "Please refresh the page or try again in a few minutes."}
        </p>
      </div>
    );
  }

  const productQuota = stats.productQuota ?? undefined;
  const remainingQuota =
    productQuota !== undefined && productQuota !== null
      ? Math.max(productQuota - stats.totalProducts, 0)
      : null;

  const quotaWarning =
    productQuota && stats.totalProducts >= productQuota * 0.8
      ? "You're close to your product limit. Consider upgrading to unlock more listings."
      : null;

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-10">
      <TierManagementCard
        currentTier={stats.tier}
        tierLoading={tierLoading}
        tierMessage={tierMessage}
        tierError={tierError}
        preview={preview}
        previewLoading={previewLoading}
        onPreview={async (target) => {
          if (tierLoading) return;
          setTierError(null);
          setPreviewLoading(true);
          try {
            const headers: Record<string, string> = {};
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }
            const response = await fetch(`/api/vendor/tier?target=${target}`, {
              headers,
            });
            const json = await response.json();
            if (!response.ok || !json.success) {
              throw new Error(
                json.error?.message ?? "Unable to load downgrade preview"
              );
            }
            if (json.data.preview) {
              setPreview({
                target,
                willUnpublish: json.data.preview.willUnpublish,
                affectedProducts: json.data.preview.affectedProducts,
              });
            } else {
              setPreview(null);
            }
          } catch (err) {
            setTierError(
              err instanceof Error
                ? err.message
                : "Unable to load downgrade preview"
            );
          } finally {
            setPreviewLoading(false);
          }
        }}
        onTierChange={async (target) => {
          if (tierLoading || target === stats.tier) return;
          setTierLoading(true);
          setTierMessage(null);
          setTierError(null);
          try {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }
            const response = await fetch("/api/vendor/tier", {
              method: "PATCH",
              headers,
              body: JSON.stringify({ tier: target }),
            });
            const json = await response.json();
            if (!response.ok || !json.success) {
              throw new Error(
                json.error?.message ?? "Unable to change subscription tier"
              );
            }
            setTierMessage(
              json.data.unpublishedCount && json.data.unpublishedCount > 0
                ? `${json.data.unpublishedCount} product${
                    json.data.unpublishedCount === 1 ? "" : "s"
                  } were unpublished to meet the new tier limit.`
                : "Tier updated successfully."
            );
            setPreview(null);
            await refresh();
          } catch (err) {
            setTierError(
              err instanceof Error
                ? err.message
                : "Unable to change subscription tier"
            );
          } finally {
            setTierLoading(false);
          }
        }}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Live products"
          value={stats.publishedProducts}
          hint={
            remainingQuota !== null
              ? `${remainingQuota} slots remaining`
              : undefined
          }
          icon={<Package className="w-5 h-5 text-white" />}
          accent="bg-gray-900"
        />
        <StatCard
          label="Drafts"
          value={stats.draftProducts}
          hint="Finish drafts to grow your reach"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          accent="bg-gray-800"
        />
        <StatCard
          label="Featured placements"
          value={stats.featuredSlots}
          hint={`Feature up to ${FEATURED_SLOT.MAX_SLOTS_PER_VENDOR} suburbs at a time`}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          accent="bg-gray-800"
        />
        <StatCard
          label="Last update"
          value={formatDate(stats.lastUpdated)}
          hint="Keep products fresh for better ranking"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          accent="bg-gray-800"
        />
      </section>

      <FeaturedPlacementCard token={token} />

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Product performance
              </h2>
              <p className="text-sm text-gray-500">
                Snapshot of your latest listings
              </p>
            </div>
            <Link
              href="/vendor/products"
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              Manage products →
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Create your first product to get started.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Updated {formatDate(product.updated_at ?? undefined)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {currencyFormatter.format(product.price || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Tier utilization
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {productQuota
                ? `${stats.totalProducts} of ${productQuota} product slots used`
                : "Product quota unavailable (apply migration 009)."}
            </p>
            <div className="mt-4 h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all"
                style={{ width: `${tierUtilization * 100}%` }}
              />
            </div>
            {quotaWarning && (
              <div className="mt-4 flex items-start space-x-3 text-sm text-amber-600">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{quotaWarning}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5" />
              <p className="text-sm uppercase tracking-widest">
                Quick next steps
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li>
                • Publish drafts to unlock featured slot eligibility and higher
                ranking.
              </li>
              <li>
                • Add multiple media assets per product to improve profile
                quality, buyer trust, and conversion.
              </li>
              <li>
                • Premium tier unlocks ${FEATURED_SLOT.MAX_SLOTS_PER_VENDOR} featured slots + analytics exports.
              </li>
            </ul>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center w-full btn-secondary bg-white text-gray-900"
            >
              Explore tiers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
  accent?: string;
}

function StatCard({ label, value, hint, icon, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          accent ?? "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      </div>
    </div>
  );
}
