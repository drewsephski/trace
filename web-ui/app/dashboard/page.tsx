"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	CreditCard,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageFrame from "@/components/PageFrame";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { supabase } from "@/utils/supabase";

const AUTH_TIMEOUT = 15000;

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function trialRemaining(trialEndTime: string): string {
	const now = Date.now();
	const end = new Date(trialEndTime).getTime();
	const diffMs = end - now;
	if (diffMs <= 0) return "Expired";
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	if (days > 0) return `${days}d ${hours}h remaining`;
	return `${hours}h remaining`;
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.08 },
	},
};

const rise = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
	},
};

export default function Dashboard() {
	const { user, isSubscriber, isLoading: isAuthLoading, signOut } = useAuth();
	const router = useRouter();
	const { subscription, isLoading: isSubLoading, fetchSubscription } = useSubscription();
	const { isInTrial, isLoading: isTrialLoading, trialEndTime } = useTrialStatus();
	const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);
	const [authTimeout, setAuthTimeout] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);

	/* ── keep existing redirect / auth logic ── */

	useEffect(() => {
		if (isSubLoading || isTrialLoading) return;

		const hasValidSubscription = ["active", "trialing"].includes(subscription?.status || "");
		if (!hasValidSubscription && !isInTrial) {
			router.replace("/profile");
		}
	}, [subscription?.status, isSubLoading, isTrialLoading, router, isInTrial]);

	useEffect(() => {
		if (isAuthLoading || isTrialLoading) return;

		if (!hasCheckedSubscription) {
			setHasCheckedSubscription(true);
			if (!user || (!isSubscriber && !isInTrial && !isAuthLoading)) {
				router.replace("/profile");
			}
		}
	}, [isSubscriber, isAuthLoading, hasCheckedSubscription, router, user, isTrialLoading, isInTrial]);

	useEffect(() => {
		if (user?.id) {
			fetchSubscription();
		}
	}, [user?.id, fetchSubscription]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user && (isAuthLoading || isTrialLoading)) {
				setAuthTimeout(true);
			}
		}, AUTH_TIMEOUT);

		return () => clearTimeout(timer);
	}, [user, isAuthLoading, isTrialLoading]);

	useEffect(() => {
		if (user?.id) {
			const checkOnboarding = async () => {
				const { data } = await supabase
					.from("user_preferences")
					.select("has_completed_onboarding")
					.eq("user_id", user.id)
					.single();

				console.log("hasCompletedOnboarding:", !!data?.has_completed_onboarding);
			};

			checkOnboarding();
		}
	}, [user?.id]);

	/* ── handlers ── */

	const handleSignOut = async () => {
		setIsSigningOut(true);
		await signOut();
	};

	/* ── loading / verifying state ── */

	if (!user && (isAuthLoading || isTrialLoading) && !hasCheckedSubscription) {
		return (
			<PageFrame
				eyebrow="Dashboard"
				title="Verifying access"
				description={
					authTimeout
						? "Taking longer than usual? Try refreshing the page."
						: "Checking your session and subscription."
				}
				compact
			>
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] px-5 py-4 text-sm text-[var(--muted)]">
					{authTimeout
						? "Connection timed out. Please refresh the page."
						: "Verifying your session\u2026"}
				</div>
			</PageFrame>
		);
	}

	/* ── derived display values ── */

	const firstName =
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || null;
	const email = user?.email || "";
	const memberSince = user?.created_at ? formatDate(user.created_at) : null;

	const hasSubscription = !!subscription;
	const planName = hasSubscription ? "Premium" : isInTrial ? "Trial" : "Free";
	const isPlanActive = hasSubscription || isInTrial;
	const planStatusLabel = hasSubscription
		? subscription?.status === "trialing"
			? "Trialing"
			: "Active"
		: isInTrial
			? "Active"
			: "Inactive";

	return (
		<PageFrame
			eyebrow="Dashboard"
			title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
			description="Your workspace and subscription at a glance."
			actions={
				<>
					<div className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)]">
						<span
							className={`h-1.5 w-1.5 rounded-full ${
								isPlanActive ? "bg-emerald-400" : "bg-[var(--muted)]"
							}`}
						/>
						{planName}
					</div>
					<button
						onClick={() => router.push("/profile")}
						className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
						style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
					>
						Manage account
						<ArrowRight className="h-3.5 w-3.5" />
					</button>
				</>
			}
			compact
			aside={
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="space-y-3"
				>
					{/* ── Account settings ── */}
					<motion.div variants={rise}>
						<button
							onClick={() => router.push("/profile")}
							className="glow-card flex w-full items-center gap-4 rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-5 text-left transition-colors hover:border-[var(--hairline-strong)]"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--ink-raised)] text-[var(--gold)]">
								<Settings className="h-4 w-4" />
							</div>
							<div className="min-w-0">
								<p className="text-sm font-medium text-[var(--foreground)]">
									Account settings
								</p>
								<p className="mt-0.5 text-xs text-[var(--muted)]">
									Profile, preferences &amp; more
								</p>
							</div>
							<ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[var(--muted)]" />
						</button>
					</motion.div>

					{/* ── Billing & plan ── */}
					<motion.div variants={rise}>
						<button
							onClick={() => router.push("/pay?plan=enterprise")}
							className="glow-card flex w-full items-center gap-4 rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-5 text-left transition-colors hover:border-[var(--hairline-strong)]"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--ink-raised)] text-[var(--gold)]">
								<CreditCard className="h-4 w-4" />
							</div>
							<div className="min-w-0">
								<p className="text-sm font-medium text-[var(--foreground)]">
									Billing &amp; plan
								</p>
								<p className="mt-0.5 text-xs text-[var(--muted)]">
									Subscription &amp; invoices
								</p>
							</div>
							<ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[var(--muted)]" />
						</button>
					</motion.div>

					{/* ── Sign out ── */}
					<motion.div variants={rise}>
						<button
							onClick={handleSignOut}
							disabled={isSigningOut}
							className="glow-card flex w-full items-center gap-4 rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-5 text-left transition-colors hover:border-[var(--hairline-strong)] disabled:opacity-50"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--ink-raised)] text-[var(--muted)]">
								<LogOut className="h-4 w-4" />
							</div>
							<div className="min-w-0">
								<p className="text-sm font-medium text-[var(--muted)]">
									{isSigningOut ? "Signing out\u2026" : "Sign out"}
								</p>
								<p className="mt-0.5 text-xs text-[var(--muted)]">End this session</p>
							</div>
						</button>
					</motion.div>
				</motion.div>
			}
		>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
			>
				{/* ── Main status card ── */}
				<motion.div
					variants={rise}
					className="glow-card rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] overflow-hidden"
				>
					<div className="p-8 md:p-10">
						{/* ── User identity ── */}
						<div className="flex items-start gap-5">
							<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--hairline-strong)] bg-[var(--ink-raised)]">
								<User className="h-6 w-6 text-[var(--gold)]" />
							</div>
							<div className="min-w-0 pt-0.5">
								<p className="serif text-xl text-[var(--foreground)]" style={{ fontWeight: 500 }}>
									{email}
								</p>
								{memberSince && (
									<p className="mt-1 text-sm text-[var(--muted)]">
										Member since {memberSince}
									</p>
								)}
							</div>
						</div>

						{/* ── Divider ── */}
						<div className="my-7 h-px bg-[var(--hairline)]" />

						{/* ── Plan section ── */}
						<div className="flex flex-wrap items-end justify-between gap-6">
							<div>
								<div className="flex items-center gap-3">
									<span
										className="serif text-2xl text-[var(--foreground)]"
										style={{ fontWeight: 500 }}
									>
										{planName}
									</span>
									<span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
										<span
											className={`h-1.5 w-1.5 rounded-full ${
												isPlanActive ? "bg-emerald-400" : "bg-[var(--muted)]"
											}`}
										/>
										{planStatusLabel}
									</span>
								</div>

								{hasSubscription && subscription?.current_period_end && (
									<p className="mt-2 text-sm text-[var(--muted)]">
										Next billing date —{" "}
										<span className="text-[var(--foreground)]">
											{formatDate(subscription.current_period_end)}
										</span>
									</p>
								)}

								{isInTrial && trialEndTime && (
									<p className="mt-2 text-sm text-[var(--muted)]">
										Trial —{" "}
										<span className="text-[var(--gold)]">
											{trialRemaining(trialEndTime)}
										</span>
									</p>
								)}

								{!hasSubscription && !isInTrial && (
									<p className="mt-2 text-sm text-[var(--muted)]">No active plan</p>
								)}
							</div>

							{/* ── Upgrade CTA (trial users only) ── */}
							{isInTrial && (
								<button
									onClick={() => router.push("/pay?plan=enterprise")}
									className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
									style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
								>
									Upgrade now
									<ArrowRight className="h-3.5 w-3.5" />
								</button>
							)}
						</div>
					</div>
				</motion.div>
			</motion.div>
		</PageFrame>
	);
}
