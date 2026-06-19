"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageFrame from "@/components/PageFrame";
import { useAuth } from "@/contexts/AuthContext";

function VerifyEmailContent() {
	const { user } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const nextPath = searchParams.get("next") || "/dashboard";
	const [countdown, setCountdown] = useState(60);

	useEffect(() => {
		if (user?.email_confirmed_at) {
			router.replace(nextPath);
		}
	}, [user, router, nextPath]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleResendEmail = async () => {
		setCountdown(60);
	};

	return (
		<PageFrame
			title="Check your email"
			description={email ? `Verification link sent to ${email}.` : "Verification link on its way."}
			compact
		>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
				className="mx-auto max-w-md"
			>
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6 md:p-8">
					<p className="text-sm leading-6 text-[var(--muted)]">
						Click the link in the email to continue.
					</p>

					<div className="mt-6 rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] px-4 py-3 text-sm text-[var(--muted)]">
						{countdown > 0 ? (
							<span>Resend available in {countdown}s</span>
						) : (
							<button
								onClick={handleResendEmail}
								className="text-[var(--gold)] transition-colors hover:text-[var(--gold-bright)]"
							>
								Resend verification email
							</button>
						)}
					</div>

					<div className="mt-6 flex items-center gap-3">
						<Link
							href="/login"
							className="rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0]"
						>
							Back to login
						</Link>
						<Link
							href={nextPath}
							className="rounded-full px-4 py-2 text-sm font-semibold"
							style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
						>
							I verified it
						</Link>
					</div>
				</div>
			</motion.div>
		</PageFrame>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<VerifyEmailContent />
		</Suspense>
	);
}
