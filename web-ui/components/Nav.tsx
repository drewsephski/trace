"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, GiftIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BrandMark from "./BrandMark";
import { GITHUB_REPO } from "./constants";
import { getPrimaryCtaHref, pageLinkGroups, DASHBOARD_PATH, getLoginHref } from "./site-links";

export default function Nav() {
	const { user } = useAuth();
	const primaryHref = getPrimaryCtaHref(!!user);

	return (
		<nav
			className="fixed top-0 w-full z-50 backdrop-blur-xl"
			style={{ backgroundColor: "rgba(11,10,8,0.75)", borderBottom: "1px solid var(--hairline)" }}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
				<BrandMark />

				<div className="hidden items-center gap-8 md:flex">
					<a href="#features" className="text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0]">
						Features
					</a>
					<a href="#compare" className="text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0]">
						Compare
					</a>
					<a href="#pricing" className="text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0]">
						Pricing
					</a>
					<details className="relative">
						<summary className="flex cursor-pointer list-none items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0] [&::-webkit-details-marker]:hidden">
							Pages
							<ChevronDown className="h-3.5 w-3.5" />
						</summary>
						<div
							className="absolute right-0 top-full mt-3 w-[28rem] rounded-2xl border p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
							style={{ borderColor: "var(--hairline)", backgroundColor: "var(--ink-card)" }}
						>
							<div className="grid gap-2 sm:grid-cols-2">
								{pageLinkGroups.flatMap((group) =>
									group.links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className="rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-[var(--hairline-strong)] hover:bg-white/5"
										>
											<span className="block text-sm font-medium text-[#f3eee0]">
												{link.label}
											</span>
											<span className="block text-xs text-[var(--muted)]">{link.description}</span>
										</Link>
									)),
								)}
							</div>
						</div>
					</details>
					<a
						href={GITHUB_REPO}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0]"
					>
						<GiftIcon className="h-3.5 w-3.5" />
						GitHub
					</a>
				</div>

				<div className="flex items-center gap-3">
					<Link
						href={user ? DASHBOARD_PATH : getLoginHref(DASHBOARD_PATH)}
						className="hidden rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0] md:inline-flex"
					>
						{user ? "Dashboard" : "Sign in"}
					</Link>
					<motion.a
						href={primaryHref}
						className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
						style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
					>
						{user ? "Go to billing" : "Get Trace"}
					</motion.a>
				</div>
			</div>
		</nav>
	);
}
