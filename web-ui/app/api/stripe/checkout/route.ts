import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isBillingPlanId } from "@/lib/billing/plans";
import { createSupabaseRouteClient } from "@/utils/supabase-route";
import { getStripeClient } from "@/utils/stripe-server";

function getPriceId(planId: string) {
	switch (planId) {
		case "pro":
			return process.env.STRIPE_PRICE_PRO;
		case "enterprise":
			return process.env.STRIPE_PRICE_ENTERPRISE;
		default:
			return undefined;
	}
}

export async function POST(request: NextRequest) {
	try {
		const stripe = getStripeClient();
		const { planId } = (await request.json()) as { planId?: string };

		if (!isBillingPlanId(planId) || planId === "custom") {
			return NextResponse.json(
				{ error: "Please choose a paid plan before checking out." },
				{ status: 400 },
			);
		}

		const priceId = getPriceId(planId);
		if (!priceId) {
			return NextResponse.json(
				{ error: `Missing Stripe price ID for plan: ${planId}` },
				{ status: 500 },
			);
		}

		const supabase = await createSupabaseRouteClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "You must sign in before purchasing." }, { status: 401 });
		}

		const { data: activeSubscription, error: subscriptionError } = await supabase
			.from("subscriptions")
			.select("status, current_period_end, cancel_at_period_end")
			.eq("user_id", user.id)
			.in("status", ["active", "trialing"])
			.maybeSingle();

		if (subscriptionError) {
			throw subscriptionError;
		}

		if (
			activeSubscription?.current_period_end &&
			new Date(activeSubscription.current_period_end) > new Date() &&
			!activeSubscription.cancel_at_period_end
		) {
			return NextResponse.json(
				{ error: "You already have an active subscription." },
				{ status: 409 },
			);
		}

		const appUrl = process.env.NEXT_PUBLIC_APP_URL;
		if (!appUrl) {
			return NextResponse.json(
				{ error: "Missing NEXT_PUBLIC_APP_URL environment variable." },
				{ status: 500 },
			);
		}

		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			allow_promotion_codes: true,
			client_reference_id: user.id,
			customer_email: user.email ?? undefined,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: `${appUrl}/profile?payment=success`,
			cancel_url: `${appUrl}/pay?plan=${planId}&canceled=true`,
			subscription_data: {
				metadata: {
					user_id: user.id,
					plan_id: planId,
				},
			},
			metadata: {
				user_id: user.id,
				plan_id: planId,
			},
		});

		if (!session.url) {
			return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
		}

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Checkout session creation failed:", error);

		return NextResponse.json(
			{
				error: "Failed to create checkout session",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
