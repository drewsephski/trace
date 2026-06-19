import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/utils/supabase-route";
import { getStripeClient } from "@/utils/stripe-server";

export async function POST() {
	try {
		const stripe = getStripeClient();
		const supabase = await createSupabaseRouteClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "You must sign in to manage billing." }, { status: 401 });
		}

		const { data: subscription, error: subscriptionError } = await supabase
			.from("subscriptions")
			.select("stripe_customer_id")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false })
			.maybeSingle();

		if (subscriptionError) {
			throw subscriptionError;
		}

		if (!subscription?.stripe_customer_id) {
			return NextResponse.json(
				{ error: "No billing customer exists for this account yet." },
				{ status: 404 },
			);
		}

		const appUrl = process.env.NEXT_PUBLIC_APP_URL;
		if (!appUrl) {
			return NextResponse.json(
				{ error: "Missing NEXT_PUBLIC_APP_URL environment variable." },
				{ status: 500 },
			);
		}

		const session = await stripe.billingPortal.sessions.create({
			customer: subscription.stripe_customer_id,
			return_url: `${appUrl}/profile`,
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Billing portal session creation failed:", error);

		return NextResponse.json(
			{
				error: "Failed to open the billing portal",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
