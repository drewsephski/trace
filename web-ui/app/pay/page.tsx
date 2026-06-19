"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import PageFrame from "@/components/PageFrame";
import { CheckoutButton } from "@/components/CheckoutButton";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { useSubscription } from "@/hooks/useSubscription";
import { getBillingPlan } from "@/lib/billing/plans";

function PaymentContent() {
	const { subscription, isLoading, error } = useSubscription();
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedPlan = getBillingPlan(searchParams.get("plan"));

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

	if (isLoading) {
		return (
			<PageFrame
				eyebrow="Billing"
				title="Subscribe"
				description="One step to unlock everything."
				compact
			>
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-8">
					<div className="animate-pulse space-y-6">
						<div className="h-4 w-20 rounded-full bg-white/5" />
						<div className="h-9 w-44 rounded-lg bg-white/5" />
						<div className="h-8 w-28 rounded-lg bg-white/5" />
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="h-4 w-full rounded bg-white/5" />
							))}
						</div>
						<div className="h-12 w-full rounded-full bg-white/5" />
					</div>
				</div>
			</PageFrame>
		);
	}

	if (error) {
		return (
			<PageFrame
				eyebrow="Billing"
				title="Couldn't load billing"
				description="We hit a snag. Try again or head to your profile."
				actions={
					<>
						<button
							onClick={() => router.push("/pay")}
							className="rounded-full px-4 py-2.5 text-sm font-semibold"
							style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
						>
							Try again
						</button>
						<button
							onClick={() => router.push("/profile")}
							className="rounded-full border border-[var(--hairline)] px-4 py-2.5 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0]"
						>
							Profile
						</button>
					</>
				}
				compact
			>
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6 text-sm leading-6 text-red-300">
					{error}
				</div>
			</PageFrame>
		);
	}

	const isActive =
		subscription &&
		(subscription.status === "active" || subscription.status === "trialing") &&
		!subscription.cancel_at_period_end;

	if (isActive) {
		return (
			<PageFrame
				eyebrow="Subscription"
				title="You're subscribed"
				description={`Your ${selectedPlan.name} plan is active. Manage everything from your profile.`}
				actions={
					<button
						onClick={() => router.push("/profile")}
						className="rounded-full px-4 py-2.5 text-sm font-semibold"
						style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
					>
						Manage subscription
					</button>
				}
				compact
			>
				<SubscriptionStatus />
			</PageFrame>
		);
	}

	return (
		<PageFrame
			eyebrow="Billing"
			title="Subscribe"
			description={selectedPlan.description}
			actions={
				<button
					onClick={() => router.push("/profile")}
					className="rounded-full border border-[var(--hairline)] px-4 py-2.5 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0]"
				>
					Profile
				</button>
			}
			aside={
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6">
					<h3 className="serif text-xl" style={{ fontWeight: 500 }}>
						What happens next
					</h3>
					<div className="mt-5 space-y-5">
						<div className="flex gap-3">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10 text-xs font-semibold text-[var(--gold)]">
								1
							</span>
							<div>
								<p className="text-sm font-medium text-[#f3eee0]">Secure checkout</p>
								<p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
									Stripe handles payment, tax, and your receipt.
								</p>
							</div>
						</div>
						<div className="flex gap-3">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10 text-xs font-semibold text-[var(--gold)]">
								2
							</span>
							<div>
								<p className="text-sm font-medium text-[#f3eee0]">Instant access</p>
								<p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
									Your plan activates the moment payment clears.
								</p>
							</div>
						</div>
						<div className="flex gap-3">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10 text-xs font-semibold text-[var(--gold)]">
								3
							</span>
							<div>
								<p className="text-sm font-medium text-[#f3eee0]">Manage anytime</p>
								<p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
									Update, cancel, or change cards from your profile.
								</p>
							</div>
						</div>
					</div>
				</div>
			}
			compact
		>
			<div className="space-y-6">
				{selectedPlan.popular && (
					<div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--gold)]">
						Most popular
					</div>
				)}

				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-8">
					<h2 className="serif text-4xl leading-none" style={{ fontWeight: 500 }}>
						{selectedPlan.name}
					</h2>

					<div className="mt-5 flex items-baseline gap-1.5">
						<span className="text-5xl font-semibold tracking-tight text-[#f3eee0]">
							{selectedPlan.price}
						</span>
						{selectedPlan.interval && (
							<span className="text-sm text-[var(--muted)]">{selectedPlan.interval}</span>
						)}
					</div>

					<ul className="mt-8 space-y-3">
						{selectedPlan.features.map((feature) => (
							<li
								key={feature}
								className="flex items-start gap-3 text-sm leading-6 text-[#f3eee0]/90"
							>
								<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
								{feature}
							</li>
						))}
					</ul>

					<div className="mt-8">
						{selectedPlan.id === "custom" ? (
							<a
								href="mailto:sales@yourdomain.com?subject=Enterprise%20pricing"
								className="inline-flex w-full items-center justify-center rounded-full border border-[var(--hairline)] px-6 py-3.5 text-sm font-semibold text-[#f3eee0] transition-colors hover:border-[var(--hairline-strong)] hover:bg-white/5"
							>
								Contact sales
							</a>
						) : (
							<CheckoutButton
								planId={selectedPlan.id}
								className="inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-all hover:brightness-110 bg-[var(--gold)] text-[var(--ink)]"
							>
								{selectedPlan.cta}
							</CheckoutButton>
						)}
						{selectedPlan.id !== "custom" && (
							<p className="mt-3 text-center text-xs text-[var(--muted)]">
								No credit card required. Cancel anytime.
							</p>
						)}
					</div>
				</div>
			</div>
		</PageFrame>
	);
}

export default function PaymentPage() {
	return (
		<Suspense fallback={<div className="min-h-screen" />}>
			<PaymentContent />
		</Suspense>
	);
}
