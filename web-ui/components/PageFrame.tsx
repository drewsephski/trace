"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BrandMark from "./BrandMark";
import {
	getLoginHref,
	getPrimaryCtaHref,
	pageLinkGroups,
} from "./site-links";

interface PageFrameProps {
	eyebrow?: string;
	title: string;
	description?: string;
	actions?: ReactNode;
	children: ReactNode;
	aside?: ReactNode;
	compact?: boolean;
}

export default function PageFrame({
	eyebrow,
	title,
	description,
	actions,
	children,
	aside,
	compact = false,
}: PageFrameProps) {
	const { user } = useAuth();

	const primaryHref = getPrimaryCtaHref(!!user);
	const primaryLabel = user ? "Open billing" : "Get Trace";

	return (
		<div className="min-h-screen text-[#f3eee0] selection:bg-[#d4a857] selection:text-[#0b0a08]">
			<div className="grain">
				<header
					className="sticky top-0 z-50 backdrop-blur-xl"
					style={{ backgroundColor: "rgba(11,10,8,0.78)", borderBottom: "1px solid var(--hairline)" }}
				>
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
						<BrandMark />

						<nav className="hidden items-center gap-7 lg:flex">
							{pageLinkGroups[0].links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0]"
								>
									{link.label}
								</Link>
							))}
							<details className="relative">
								<summary className="flex cursor-pointer list-none items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[#f3eee0] [&::-webkit-details-marker]:hidden">
									Pages
									<ChevronDown className="h-3.5 w-3.5" />
								</summary>
								<div
									className="absolute left-0 top-full mt-3 w-[28rem] rounded-2xl border p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
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
													<span className="block text-xs text-[var(--muted)]">
														{link.description}
													</span>
												</Link>
											)),
										)}
									</div>
								</div>
							</details>
						</nav>

						<div className="flex items-center gap-3">
							{user ? (
								<div className="hidden items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--ink-raised)] px-3 py-2 text-xs text-[var(--muted)] md:flex">
									<span className="h-2 w-2 rounded-full bg-emerald-400" />
									Signed in
								</div>
							) : (
								<Link
									href={getLoginHref("/dashboard")}
									className="hidden rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[#f3eee0] md:inline-flex"
								>
									Sign in
								</Link>
							)}
							<Link
								href={primaryHref}
								className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
								style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
							>
								{primaryLabel}
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</header>

				<main className={compact ? "px-6 py-12" : "px-6 py-14 lg:py-20"}>
					<div className="mx-auto max-w-7xl">
						<div className={aside ? "grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_380px]" : ""}>
							<section>
								{eyebrow && (
									<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
										{eyebrow}
									</p>
								)}
								<div className={eyebrow ? "mt-4" : ""}>
									<h1
										className="serif text-4xl leading-[1.03] md:text-5xl lg:text-6xl"
										style={{ fontWeight: 500 }}
									>
										{title}
									</h1>
									{description && (
										<p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
											{description}
										</p>
									)}
								</div>

								{actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}

								<div className="mt-10">{children}</div>
							</section>

							{aside && <aside className="lg:sticky lg:top-28">{aside}</aside>}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
