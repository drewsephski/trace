"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { useSubscription } from "@/hooks/useSubscription";
import { getBillingPlan } from "@/lib/billing/plans";

export default function PaymentPage() {
	const { subscription, isLoading, error } = useSubscription();
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedPlan = getBillingPlan(searchParams.get("plan"));

	// Redirect if already subscribed
	useEffect(() => {
		if (
			(subscription?.status === "active" || subscription?.status === "trialing") &&
			!subscription.cancel_at_period_end
		) {
			const timer = setTimeout(() => {
				router.push("/profile");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [subscription, router]);

	// Check if user can subscribe
	const canSubscribe =
		!isLoading &&
		(!subscription || (subscription.status === "canceled" && !subscription.cancel_at_period_end));

	// Add error handling
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
				<h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
					Error Loading Subscription
				</h1>
				<p className="text-gray-600 mb-4 text-center">
					Unable to load subscription information. Please try again later.
				</p>
				<button
					onClick={() => router.push("/pay")}
					className="bg-primary hover:bg-primary-darker text-white px-6 py-2 rounded-lg"
				>
					Retry
				</button>
			</div>
		);
	}

	if (!canSubscribe) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
				<h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
					Subscription Not Available
				</h1>
				<p className="text-gray-600 mb-4 text-center">
					You already have an active or pending subscription.
				</p>
				<button
					onClick={() => router.push("/profile")}
					className="bg-primary hover:bg-primary-darker text-white px-6 py-2 rounded-lg"
				>
					View Subscription
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-[80vh] px-4 py-12">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
				<div className="text-center">
					<h1 className="text-2xl md:text-3xl font-bold">Complete Your Purchase</h1>
					<p className="mt-3 text-slate-600 dark:text-slate-300">
						Checkout uses Stripe-hosted subscriptions so payment, tax, and renewal handling stay
						with Stripe.
					</p>
				</div>

				<SubscriptionStatus />

				<div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
					<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<p className="text-sm font-medium text-primary">Selected plan</p>
						<h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
							{selectedPlan.name}
						</h2>
						<div className="mt-4 flex items-baseline gap-2">
							<span className="text-4xl font-bold text-slate-900 dark:text-white">
								{selectedPlan.price}
							</span>
							<span className="text-slate-500 dark:text-slate-400">{selectedPlan.interval}</span>
						</div>
						<p className="mt-4 text-slate-600 dark:text-slate-300">{selectedPlan.description}</p>

						<ul className="mt-6 space-y-3">
							{selectedPlan.features.map((feature) => (
								<li
									key={feature}
									className="flex items-start gap-3 text-slate-700 dark:text-slate-200"
								>
									<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
									<span>{feature}</span>
								</li>
							))}
						</ul>

						{selectedPlan.id === "custom" ? (
							<a
								href="mailto:sales@yourdomain.com?subject=Enterprise%20pricing"
								className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-dark"
							>
								Contact Sales
							</a>
						) : (
							<CheckoutButton
								planId={selectedPlan.id}
								className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-dark disabled:opacity-70"
							>
								{selectedPlan.cta}
							</CheckoutButton>
						)}
					</section>

					<aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
							What happens next
						</h3>
						<ol className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
							<li>1. Stripe collects the payment with a hosted checkout page.</li>
							<li>2. The webhook stores the subscription in Supabase.</li>
							<li>3. Your profile page shows the subscription and billing status.</li>
							<li>4. The billing portal handles updates, cancellations, and card changes.</li>
						</ol>

						<div className="mt-8 rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
							Need a different plan? Switch the URL to{" "}
							<code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-700">
								/pay?plan=pro
							</code>{" "}
							or{" "}
							<code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-700">
								/pay?plan=enterprise
							</code>
							.
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
