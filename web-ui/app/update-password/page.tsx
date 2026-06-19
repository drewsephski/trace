"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import PageFrame from "@/components/PageFrame";
import { useAuth } from "@/contexts/AuthContext";

export default function UpdatePasswordPage() {
	const { supabase } = useAuth();
	const router = useRouter();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [sessionReady, setSessionReady] = useState(false);

	useEffect(() => {
		const hash = window.location.hash;
		if (!hash) {
			setError("Missing recovery link. Please request a new password reset email.");
			return;
		}

		const hashParams = new URLSearchParams(hash.slice(1));
		const accessToken = hashParams.get("access_token");
		const refreshToken = hashParams.get("refresh_token");
		const type = hashParams.get("type");

		if (type !== "recovery" || !accessToken) {
			setError("Invalid recovery link.");
			return;
		}

		supabase.auth
			.setSession({
				access_token: accessToken,
				refresh_token: refreshToken || "",
			})
			.then(({ error: sessionError }) => {
				if (sessionError) {
					setError("Failed to set the recovery session.");
					return;
				}
				setSessionReady(true);
			});
	}, [supabase.auth]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const { error: updateError } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (updateError) throw updateError;

			setSuccess(true);
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (updateErr) {
			setError(updateErr instanceof Error ? updateErr.message : "Failed to update password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PageFrame
			title="Update your password"
			description="Choose a new password to sign in with."
			compact
		>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
				className="mx-auto max-w-md"
			>
				<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6 md:p-8">
					{error && (
						<div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
							{error}
						</div>
					)}

					{success ? (
						<div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
							Password updated. Redirecting to login…
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<p className="text-sm leading-6 text-[var(--muted)]">
								{sessionReady
									? "Enter your new password below."
									: "Loading recovery session…"}
							</p>

							<label className="block">
								<span className="mb-2 block text-sm font-medium text-[#f3eee0]">New password</span>
								<input
									type="password"
									required
									minLength={6}
									value={newPassword}
									onChange={(event) => setNewPassword(event.target.value)}
									className="w-full rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] px-4 py-3 text-sm text-[#f3eee0] outline-none placeholder:text-[var(--muted)] focus:border-[var(--hairline-strong)]"
									placeholder="New password"
								/>
							</label>

							<label className="block">
								<span className="mb-2 block text-sm font-medium text-[#f3eee0]">Confirm password</span>
								<input
									type="password"
									required
									minLength={6}
									value={confirmPassword}
									onChange={(event) => setConfirmPassword(event.target.value)}
									className="w-full rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] px-4 py-3 text-sm text-[#f3eee0] outline-none placeholder:text-[var(--muted)] focus:border-[var(--hairline-strong)]"
									placeholder="Confirm password"
								/>
							</label>

							<button
								type="submit"
								disabled={isLoading || !sessionReady}
								className="inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-60"
								style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
							>
								{isLoading ? "Updating…" : "Update password"}
							</button>
						</form>
					)}
				</div>
			</motion.div>
		</PageFrame>
	);
}
