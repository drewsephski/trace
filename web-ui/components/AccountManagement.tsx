"use client";

import Link from "next/link";
import { LogOut, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getLoginHref } from "./site-links";

export function AccountManagement() {
	const { user, signOut } = useAuth();

	if (!user) {
		return (
			<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6">
				<p className="text-sm text-[var(--muted)]">You need to sign in before you can manage this account.</p>
				<Link
					href={getLoginHref("/profile")}
					className="mt-4 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
					style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
				>
					Sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--ink-card)] p-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
						Account
					</p>
					<h2 className="serif mt-3 text-2xl" style={{ fontWeight: 500 }}>
						{user.email}
					</h2>
					<p className="mt-3 text-sm leading-6 text-[var(--muted)]">
						Manage your profile, reset your password, and keep billing tidy from one place.
					</p>
				</div>

				<div className="flex flex-wrap gap-3">
					<Link
						href="/pay?plan=enterprise"
						className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-2.5 text-sm font-medium text-[#f3eee0] transition-colors hover:border-[var(--hairline-strong)] hover:bg-white/5"
					>
						<Wallet className="h-4 w-4 text-[var(--gold)]" />
						Billing
					</Link>
					<Link
						href="/update-password"
						className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-2.5 text-sm font-medium text-[#f3eee0] transition-colors hover:border-[var(--hairline-strong)] hover:bg-white/5"
					>
						<ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
						Password
					</Link>
					<button
						type="button"
						onClick={signOut}
						className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
						style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
					>
						<LogOut className="h-4 w-4" />
						Sign out
					</button>
				</div>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-3">
				<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
					<p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Status</p>
					<p className="mt-2 text-sm text-[#f3eee0]">Authenticated</p>
				</div>
				<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
					<p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Profile</p>
					<p className="mt-2 text-sm text-[#f3eee0]">Trace account connected</p>
				</div>
				<div className="rounded-2xl border border-[var(--hairline)] bg-[var(--ink-raised)] p-4">
					<p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Tools</p>
					<div className="mt-2 flex items-center gap-2 text-sm text-[#f3eee0]">
						<Sparkles className="h-4 w-4 text-[var(--gold)]" />
						Email, billing, and password flows
					</div>
				</div>
			</div>
		</div>
	);
}
