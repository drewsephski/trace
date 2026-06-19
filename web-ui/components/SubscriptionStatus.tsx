"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { getLoginHref } from "./site-links";

export function SubscriptionStatus() {
	const { user } = useAuth();
	const { subscription, isLoading, error } = useSubscription();
	const { isInTrial, trialEndTime } = useTrialStatus();

	if (!user) {
		return (
			<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
					Access required
				</p>
				<h2 className="serif mt-3 text-2xl" style={{ fontWeight: 500 }}>
					Sign in to continue to billing
				</h2>
				<p className="mt-3 text-sm leading-6 text-[var(--muted)]">
					We use the same authentication flow for checkout, billing, and account management.
				</p>
				<Link
					href={getLoginHref("/pay?plan=enterprise")}
					className="mt-5 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
					style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
				>
					Sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6">
			<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
				Billing status
			</p>
			<div className="mt-4">
				{error ? (
					<p className="text-sm text-red-300">{error}</p>
				) : isLoading ? (
					<p className="text-sm text-[var(--muted)]">Loading subscription details…</p>
				) : subscription ? (
					<div className="space-y-3 text-sm text-[var(--muted)]">
						<p>
							<span className="text-[#f3eee0]">Status:</span>{" "}
							<span className="text-emerald-400">
								{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
							</span>
						</p>
						<p>
							<span className="text-[#f3eee0]">Next billing date:</span>{" "}
							{new Date(subscription.current_period_end).toLocaleDateString()}
						</p>
					</div>
				) : isInTrial ? (
					<div className="space-y-3 text-sm text-[var(--muted)]">
						<p className="text-[#f3eee0]">You&apos;re in your trial period.</p>
						<p>
							Trial ends {trialEndTime ? new Date(trialEndTime).toLocaleDateString() : "soon"}.
						</p>
					</div>
				) : (
					<p className="text-sm text-[var(--muted)]">No active subscription is attached to this account.</p>
				)}
			</div>
		</div>
	);
}
