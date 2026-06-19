"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LoginForm } from "@/components/LoginForm";
import PageFrame from "@/components/PageFrame";
import { useAuth } from "@/contexts/AuthContext";

function formatAuthError(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	if (error && typeof error === "object") {
		const candidate = error as {
			message?: unknown;
			error_description?: unknown;
			details?: unknown;
			code?: unknown;
		};

		const message =
			(typeof candidate.message === "string" && candidate.message) ||
			(typeof candidate.error_description === "string" && candidate.error_description) ||
			(typeof candidate.details === "string" && candidate.details) ||
			null;

		if (message) {
			return candidate.code && typeof candidate.code === "string"
				? `${message} (${candidate.code})`
				: message;
		}
	}

	return "Authentication failed";
}

function LoginContent() {
	const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const nextPath = searchParams.get("next") || "/dashboard";

	useEffect(() => {
		if (user) {
			router.replace(nextPath);
		} else {
			setIsLoading(false);
		}
	}, [user, router, nextPath]);

	const handleSubmit = async (email: string, password: string, isSignUp: boolean) => {
		setError("");
		setIsLoading(true);

		try {
			if (isSignUp) {
				const { data, error } = await signUpWithEmail(email, password);
				if (error) throw error;

				if (data?.user && !data.user.email_confirmed_at) {
					router.replace(
						`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`,
					);
					return;
				}

				router.replace(nextPath);
			} else {
				await signInWithEmail(email, password);
				router.replace(nextPath);
			}
		} catch (submitError) {
			setError(formatAuthError(submitError));
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<PageFrame title="Signing in" compact>
				<div className="flex items-center justify-center py-20">
					<p className="text-sm text-[var(--muted)]">Checking your credentials…</p>
				</div>
			</PageFrame>
		);
	}

	return (
		<PageFrame
			title="Sign in to Trace"
			description="Enter your account to continue."
			actions={
				<Link
					href="/"
					className="rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0]"
				>
					Back home
				</Link>
			}
			compact
		>
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
				className="mx-auto w-full max-w-md"
			>
				<LoginForm
					onSubmit={handleSubmit}
					onGoogleSignIn={signInWithGoogle}
					isLoading={isLoading}
					error={error}
					nextPath={nextPath}
				/>
			</motion.div>
		</PageFrame>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<LoginContent />
		</Suspense>
	);
}
