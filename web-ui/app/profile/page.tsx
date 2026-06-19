"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	CreditCard,
	ExternalLink,
	Shield,
	X,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageFrame from "@/components/PageFrame";
import { AccountManagement } from "@/components/AccountManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useTrialStatus } from "@/hooks/useTrialStatus";

// ─── animation presets ───────────────────────────────────────────────────────

const fadeUp = {
	initial: { opacity: 0, y: 12 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const } },
};

// ─── status badge helper ─────────────────────────────────────────────────────

function StatusBadge({ label, variant }: { label: string; variant: "green" | "amber" | "muted" }) {
	const colors = {
		green: "bg-emerald-500/10 text-emerald-200 border-emerald-400/15",
		amber: "bg-amber-500/10 text-amber-200 border-amber-400/15",
		muted: "bg-white/5 text-[var(--muted)] border-[var(--hairline)]",
	};
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${colors[variant]}`}
		>
			<span
				className={`h-1.5 w-1.5 rounded-full ${
					variant === "green"
						? "bg-emerald-400"
						: variant === "amber"
							? "bg-amber-400"
							: "bg-[var(--muted)]"
				}`}
			/>
			{label}
		</span>
	);
}

// ─── content ─────────────────────────────────────────────────────────────────

function ProfileContent() {
	const { user } = useAuth();
	const {
		subscription,
		isLoading: isLoadingSubscription,
		syncWithStripe,
		fetchSubscription,
	} = useSubscription();
	const router = useRouter();
	const searchParams = useSearchParams();
	const paymentStatus = searchParams.get("payment");
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [isOpeningBillingPortal, setIsOpeningBillingPortal] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { isInTrial, trialEndTime } = useTrialStatus();

	// ── effects (unchanged logic) ──────────────────────────────────────────────

	useEffect(() => {
		if (paymentStatus === "success") {
			console.log("Payment successful");
		}
	}, [paymentStatus]);

	useEffect(() => {
		if (subscription?.stripe_subscription_id) {
			syncWithStripe(subscription.stripe_subscription_id);
		}
	}, [subscription?.stripe_subscription_id, syncWithStripe]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | undefined;
		let refreshAttempts = 0;
		const MAX_REFRESH_ATTEMPTS = 3;
		const REFRESH_INTERVAL = 3000;

		const attemptRefresh = async () => {
			if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
				setError(
					"Loading subscription is taking longer than expected. Please refresh the page.",
				);
				return;
			}

			refreshAttempts += 1;
			await fetchSubscription();
			timeoutId = setTimeout(attemptRefresh, REFRESH_INTERVAL);
		};

		if (isLoadingSubscription) {
			timeoutId = setTimeout(attemptRefresh, REFRESH_INTERVAL);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [fetchSubscription, isLoadingSubscription]);

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user, router]);

	useEffect(() => {
		if (user?.id) {
			fetchSubscription();
		}
	}, [user?.id, fetchSubscription]);

	// ── handlers (unchanged logic) ─────────────────────────────────────────────

	const handleCancelSubscription = async () => {
		if (!subscription?.stripe_subscription_id) return;

		setIsCancelling(true);
		try {
			const response = await fetch("/api/stripe/cancel", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subscriptionId: subscription.stripe_subscription_id,
				}),
			});

			if (!response.ok) throw new Error("Failed to cancel subscription");

			setIsCancelModalOpen(false);
			router.refresh();
		} catch (cancelError) {
			console.error("Error canceling subscription:", cancelError);
		} finally {
			setIsCancelling(false);
		}
	};

	const handleReactivateSubscription = async () => {
		if (!subscription?.stripe_subscription_id) return;

		try {
			const response = await fetch("/api/stripe/reactivate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subscriptionId: subscription.stripe_subscription_id,
				}),
			});

			if (!response.ok) throw new Error("Failed to reactivate subscription");

			router.refresh();
		} catch (reactivateError) {
			console.error("Error reactivating subscription:", reactivateError);
		}
	};

	const handleOpenBillingPortal = async () => {
		setIsOpeningBillingPortal(true);

		try {
			const response = await fetch("/api/stripe/portal", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const payload = (await response.json()) as { url?: string; error?: string };

			if (!response.ok || !payload.url) {
				throw new Error(payload.error ?? "Failed to open billing portal");
			}

			window.location.assign(payload.url);
		} catch (portalError) {
			console.error("Error opening billing portal:", portalError);
			setError(
				portalError instanceof Error
					? portalError.message
					: "Unable to open billing portal",
			);
		} finally {
			setIsOpeningBillingPortal(false);
		}
	};

	// ── redirect guard ─────────────────────────────────────────────────────────

	if (!user) {
		return (
			<PageFrame
				eyebrow="Profile"
				title="Redirecting to login"
				description="This page requires an authenticated account."
				compact
			>
				<motion.div
					{...fadeUp}
					className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] px-5 py-4 text-sm text-[var(--muted)]"
				>
					Loading your session…
				</motion.div>
			</PageFrame>
		);
	}

	// ── render ─────────────────────────────────────────────────────────────────

	return (
		<ErrorBoundary
			fallback={
				<div className="rounded-[28px] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
					Something went wrong. Please try refreshing the page.
				</div>
			}
		>
			<PageFrame
				eyebrow="Profile"
				title="Account &amp; billing"
				description="Manage your subscription, account settings, and billing information."
				compact
				actions={
					<>
						<Link
							href="/pay?plan=enterprise"
							className="rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0]"
						>
							View plans
						</Link>
						<button
							onClick={handleOpenBillingPortal}
							disabled={isOpeningBillingPortal}
							className="rounded-full px-4 py-2 text-sm font-semibold"
							style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
						>
							{isOpeningBillingPortal ? "Opening portal…" : "Manage billing"}
						</button>
					</>
				}
				aside={
					<aside className="space-y-5">
						<motion.div
							{...fadeUp}
							className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6"
						>
							<div className="flex items-center gap-2">
								<Shield className="h-3.5 w-3.5 text-[var(--gold)]" />
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
									Status
								</p>
							</div>
							<div className="mt-4 space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-[var(--muted)]">Account</span>
									<span className="flex items-center gap-1.5 text-sm text-emerald-300">
										<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
										Active
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-[var(--muted)]">Subscription</span>
									{subscription ? (
										<StatusBadge
											label={
												subscription.cancel_at_period_end
													? "Canceling"
													: subscription.status.charAt(0).toUpperCase() +
														subscription.status.slice(1)
											}
											variant={
												subscription.status === "active" && !subscription.cancel_at_period_end
													? "green"
													: "amber"
											}
										/>
									) : (
										<StatusBadge
											label={isInTrial ? "Trial" : "None"}
											variant={isInTrial ? "amber" : "muted"}
										/>
									)}
								</div>
							</div>
						</motion.div>

						<motion.div
							{...fadeUp}
							transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
							className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6"
						>
							<div className="flex items-center gap-2">
								<Calendar className="h-3.5 w-3.5 text-[var(--gold)]" />
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
									Period
								</p>
							</div>
							<div className="mt-4 space-y-2">
								<p className="text-sm leading-6 text-[var(--muted)]">
									{subscription
										? `Current billing period ends ${new Date(subscription.current_period_end).toLocaleDateString()}`
										: isInTrial
											? `Trial ends ${trialEndTime ? new Date(trialEndTime).toLocaleDateString() : "soon"}`
											: "No active billing period"}
								</p>
								<button
									onClick={handleOpenBillingPortal}
									className="inline-flex items-center gap-1 text-sm text-[var(--gold)] transition-colors hover:text-[#f3eee0]"
								>
									Billing portal
									<ExternalLink className="h-3 w-3" />
								</button>
							</div>
						</motion.div>
					</aside>
				}
			>
				<div className="space-y-6">
					{/* ── payment success banner ───────────────────────────────────── */}
					{paymentStatus === "success" && (
						<motion.div
							{...fadeUp}
							className="flex items-center gap-3 rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200"
						>
							<CheckCircle className="h-4 w-4 shrink-0" />
							<span>Payment successful — thank you for subscribing.</span>
						</motion.div>
					)}

					{/* ── account management ─────────────────────────────────────────── */}
					<motion.div {...fadeUp}>
						<AccountManagement />
					</motion.div>

					{/* ── subscription card ───────────────────────────────────────────── */}
					<motion.div
						{...fadeUp}
						transition={{ delay: 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
						className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6 md:p-8"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CreditCard className="h-3.5 w-3.5 text-[var(--gold)]" />
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
									Subscription
								</p>
							</div>
							{subscription && (
								<StatusBadge
									label={subscription.cancel_at_period_end ? "Canceling" : "Active"}
									variant={subscription.cancel_at_period_end ? "amber" : "green"}
								/>
							)}
						</div>

						{/* ── error state ───────────────────────────────────────────────── */}
						{error && (
							<div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
								<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
								<p className="text-sm text-red-200">{error}</p>
							</div>
						)}

						{/* ── loading state ──────────────────────────────────────────────── */}
						{!error && isLoadingSubscription && (
							<div className="mt-6 space-y-4">
								<div className="grid gap-3 sm:grid-cols-3">
									{[...Array(3)].map((_, i) => (
										<div
											key={i}
											className="animate-pulse rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4"
										>
											<div className="mb-2 h-2.5 w-12 rounded-full bg-white/5" />
											<div className="h-4 w-20 rounded-full bg-white/5" />
										</div>
									))}
								</div>
							</div>
						)}

						{/* ── has subscription ───────────────────────────────────────────── */}
						{!error && !isLoadingSubscription && subscription && (
							<div className="mt-5 space-y-5">
								<div className="grid gap-3 sm:grid-cols-3">
									<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
										<p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
											Plan
										</p>
										<p className="mt-1.5 text-sm font-medium text-[#f3eee0]">Enterprise</p>
									</div>
									<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
										<p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
											Started
										</p>
										<p className="mt-1.5 text-sm font-medium text-[#f3eee0]">
											{new Date(subscription.created_at).toLocaleDateString()}
										</p>
									</div>
									<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
										<p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
											Current period ends
										</p>
										<p className="mt-1.5 text-sm font-medium text-[#f3eee0]">
											{new Date(subscription.current_period_end).toLocaleDateString()}
										</p>
									</div>
								</div>

								{/* canceled — offer resubscribe */}
								{subscription.status === "canceled" && (
									<Link
										href="/pay?plan=enterprise"
										className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
										style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
									>
										Resubscribe
									</Link>
								)}

								{/* cancel_at_period_end — show resume prompt */}
								{subscription.status !== "canceled" && subscription.cancel_at_period_end && (
									<div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
										<p className="text-sm text-amber-200">
											Your subscription is set to end on{" "}
											{new Date(subscription.current_period_end).toLocaleDateString()}.
											Resume before then to keep uninterrupted access.
										</p>
										<button
											onClick={handleReactivateSubscription}
											className="mt-3 rounded-full px-4 py-2 text-sm font-semibold"
											style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
										>
											Resume subscription
										</button>
									</div>
								)}

								{/* active — show cancel */}
								{subscription.status !== "canceled" && !subscription.cancel_at_period_end && (
									<button
										onClick={() => setIsCancelModalOpen(true)}
										className="rounded-full border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/10"
									>
										Cancel subscription
									</button>
								)}
							</div>
						)}

						{/* ── no subscription / trial ────────────────────────────────────── */}
						{!error && !isLoadingSubscription && !subscription && (
							<div className="mt-5">
								{isInTrial ? (
									<div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
										<p className="text-sm text-amber-200">
											Your 48-hour trial ends{" "}
											{trialEndTime
												? new Date(trialEndTime).toLocaleDateString()
												: "soon"}
											. Subscribe to keep access.
										</p>
										<Link
											href="/pay?plan=enterprise"
											className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold"
											style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
										>
											Subscribe now
										</Link>
									</div>
								) : trialEndTime ? (
									<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
										<p className="text-sm text-red-200">
											Trial ended {new Date(trialEndTime).toLocaleDateString()}.
										</p>
										<Link
											href="/pay?plan=enterprise"
											className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold"
											style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
										>
											Subscribe
										</Link>
									</div>
								) : (
									<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
										<p className="text-sm text-[var(--muted)]">No active subscription.</p>
										<Link
											href="/pay?plan=enterprise"
											className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold"
											style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
										>
											View plans
										</Link>
									</div>
								)}
							</div>
						)}
					</motion.div>
				</div>
			</PageFrame>

			{/* ── cancel confirmation modal ──────────────────────────────────────── */}
			{isCancelModalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.96, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
						className="relative w-full max-w-md rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)]"
					>
						<button
							onClick={() => setIsCancelModalOpen(false)}
							className="absolute right-5 top-5 text-[var(--muted)] transition-colors hover:text-[#f3eee0]"
						>
							<X className="h-4 w-4" />
						</button>

						<div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
							<AlertTriangle className="h-4 w-4 text-red-300" />
						</div>

						<p className="serif mt-4 text-xl" style={{ fontWeight: 500 }}>
							Cancel subscription?
						</p>
						<p className="mt-2 text-sm leading-6 text-[var(--muted)]">
							You&apos;ll keep access until{" "}
							<strong className="text-[#f3eee0]">
								{subscription?.current_period_end
									? new Date(subscription.current_period_end).toLocaleDateString()
									: "the end of your billing period"}
							</strong>
							. No refunds are provided for partial periods.
						</p>

						<div className="mt-6 flex items-center justify-end gap-3">
							<button
								onClick={() => setIsCancelModalOpen(false)}
								disabled={isCancelling}
								className="rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0]"
							>
								Keep plan
							</button>
							<button
								onClick={handleCancelSubscription}
								disabled={isCancelling}
								className="rounded-full px-4 py-2 text-sm font-semibold"
								style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
							>
								{isCancelling ? (
									<span className="flex items-center gap-2">
										<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
										Canceling…
									</span>
								) : (
									"Yes, cancel"
								)}
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</ErrorBoundary>
	);
}

// ─── page export ────────────────────────────────────────────────────────────

export default function ProfilePage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ProfileContent />
		</Suspense>
	);
}
