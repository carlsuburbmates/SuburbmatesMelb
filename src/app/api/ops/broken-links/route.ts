import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendBrokenLinkEmail } from "@/lib/email";

const URL_CHECK_TIMEOUT_MS = 8000;

interface ProductWithVendor {
  id: string;
  title: string;
  product_url: string;
  vendor_id: string;
  vendors: {
    business_name: string | null;
    users: { email: string | null } | { email: string | null }[];
  } | {
    business_name: string | null;
    users: { email: string | null } | { email: string | null }[];
  }[];
}

async function isUrlAlive(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), URL_CHECK_TIMEOUT_MS);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    return res.status < 400;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  try {
    if (!process.env.CRON_SECRET) {
      console.error("[ops/broken-links] CRON_SECRET not set");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    if (!supabaseAdmin) {
      console.error("[ops/broken-links] supabaseAdmin unavailable");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: products, error: fetchError } = await supabaseAdmin
      .from("products")
      .select(`
        id,
        title,
        product_url,
        vendor_id,
        vendors (
          business_name,
          users ( email )
        )
      `)
      .eq("is_active", true)
      .eq("is_archived", false)
      .not("product_url", "is", null);

    if (fetchError) throw fetchError;
    if (!products || products.length === 0) {
      return NextResponse.json({ success: true, checked: 0, flagged: 0 });
    }

    const typedProducts = products as unknown as ProductWithVendor[];

    let checked = 0;
    let flagged = 0;
    const errors: { product_id: string; error: string }[] = [];

    for (const product of typedProducts) {
      checked++;
      const alive = await isUrlAlive(product.product_url);
      if (alive) continue;

      flagged++;

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", product.id);

      if (updateError) {
        errors.push({ product_id: product.id, error: updateError.message });
        continue;
      }

      try {
        const vendor = Array.isArray(product.vendors)
          ? product.vendors[0]
          : product.vendors;
        const user = vendor?.users
          ? Array.isArray(vendor.users)
            ? vendor.users[0]
            : vendor.users
          : null;

        if (vendor && user?.email) {
          await sendBrokenLinkEmail(
            user.email,
            vendor.business_name || "Creator",
            product.title,
            product.product_url
          );
        }
      } catch (emailErr) {
        console.warn(`[ops/broken-links] Email failed for product ${product.id}:`, emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      checked,
      flagged,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("[ops/broken-links] Failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
