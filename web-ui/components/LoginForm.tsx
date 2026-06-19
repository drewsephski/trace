"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Chrome, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { DEMO_EMAIL } from "./site-links";

interface LoginFormProps {
	onSubmit: (email: string, password: string, isSignUp: boolean) => Promise<void>;
	onGoogleSignIn: (redirectPath?: string) => Promise<void>;
	isLoading: boolean;
	error: string;
	nextPath?: string;
}

export function LoginForm({ onSubmit, onGoogleSignIn, isLoading, error, nextPath }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const redirectPath = useMemo(() => nextPath || "/dashboard", [nextPath]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit(email, password, isSignUp);
		} finally {
			setIsSubmitting(false);
		}
	};

	const submitting = isLoading || isSubmitting;

	return (
		<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6 shadow-[0_32px_80px_-42px_rgba(0,0,0,0.9)] md:p-8">
			<div className="mb-8">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
					{isSignUp ? "Create account" : "Welcome back"}
				</p>
				<h2 className="serif mt-3 text-3xl" style={{ fontWeight: 500 }}>
					{isSignUp ? "Start your Trace account" : "Sign in to Trace"}
				</h2>
				<p className="mt-3 text-sm leading-6 text-[var(--muted)]">
					Use email or Google to continue. We&apos;ll keep the flow inside the same dark Trace system.
				</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				<button
					type="button"
					onClick={() => onGoogleSignIn(redirectPath)}
					disabled={submitting}
					className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-3 text-sm font-semibold text-[#f3eee0] transition-colors hover:border-[var(--hairline-strong)] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<Chrome className="h-4 w-4" />
					Continue with Google
				</button>
				<div className="flex items-center justify-center rounded-full border border-[var(--hairline)] px-4 py-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
					Or use email
				</div>
			</div>

			<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
				<label className="block">
					<span className="mb-2 block text-sm font-medium text-[#f3eee0]">Email</span>
					<div className="flex items-center gap-3 rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] px-4 py-3 focus-within:border-[var(--hairline-strong)]">
						<Mail className="h-4 w-4 text-[var(--gold)]" />
						<input
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="w-full bg-transparent text-sm text-[#f3eee0] outline-none placeholder:text-[var(--muted)]"
							placeholder="you@example.com"
						/>
					</div>
				</label>

				<label className="block">
					<span className="mb-2 block text-sm font-medium text-[#f3eee0]">Password</span>
					<div className="flex items-center gap-3 rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] px-4 py-3 focus-within:border-[var(--hairline-strong)]">
						<LockKeyhole className="h-4 w-4 text-[var(--gold)]" />
						<input
							type={showPassword ? "text" : "password"}
							required
							minLength={6}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="w-full bg-transparent text-sm text-[#f3eee0] outline-none placeholder:text-[var(--muted)]"
							placeholder="Minimum 6 characters"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((current) => !current)}
							className="text-[var(--muted)] transition-colors hover:text-[#f3eee0]"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</label>

				<div className="flex flex-wrap items-center justify-between gap-3 text-sm">
					<button
						type="button"
						onClick={() => setIsSignUp((current) => !current)}
						className="text-[var(--muted)] transition-colors hover:text-[#f3eee0]"
					>
						{isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
					</button>
					<Link
						href={`/reset-password?email=${encodeURIComponent(email || DEMO_EMAIL)}`}
						className="text-[var(--gold)] transition-colors hover:text-[var(--gold-bright)]"
					>
						Forgot password?
					</Link>
				</div>

				{error && (
					<div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={submitting}
					className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
					style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
				>
					{submitting ? "Working…" : isSignUp ? "Create account" : "Sign in"}
				</button>
			</form>
		</div>
	);
}
