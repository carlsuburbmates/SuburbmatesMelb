import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { items, vendorStripeId, platformFee } = await req.json();

    // Create Stripe Checkout Session (Connect Standard)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items,
      payment_intent_data: {
        application_fee_amount: platformFee,
      },
      stripe_account: vendorStripeId,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
