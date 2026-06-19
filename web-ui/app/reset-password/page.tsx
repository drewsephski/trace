"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageFrame from "@/components/PageFrame";
import { useAuth } from "@/contexts/AuthContext";

function ResetPasswordContent() {
	const { supabase } = useAuth();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = async () => {
		if (!email) return;

		setIsLoading(true);
		setError("");

		try {
			const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/update-password#`,
			});
			if (resetError) throw resetError;
			setSuccess(true);
		} catch (resetErr) {
			setError(resetErr instanceof Error ? resetErr.message : "Failed to send reset email");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (email && !success && !isLoading) {
			handleResetPassword();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, success, isLoading]);

	return (
		<PageFrame
			title="Reset your password"
			description={email ? `Sending a recovery link to ${email}.` : "No email address provided."}
			compact
		>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
				className="mx-auto max-w-md"
			>
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6">
					{!email ? (
						<p className="text-sm leading-6 text-[var(--muted)]">
							Invalid request. Please request a new password reset link from the login page.
						</p>
					) : error ? (
						<div className="space-y-4">
							<div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
								{error}
							</div>
							<button
								onClick={handleResetPassword}
								className="inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
								style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
							>
								Try again
							</button>
						</div>
					) : success ? (
						<div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
							Reset link sent. Check your inbox and follow the prompt to choose a new password.
						</div>
					) : (
						<p className="text-sm text-[var(--muted)]">
							{isLoading ? "Sending reset link…" : "Preparing…"}
						</p>
					)}
				</div>
			</motion.div>
		</PageFrame>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ResetPasswordContent />
		</Suspense>
	);
}
