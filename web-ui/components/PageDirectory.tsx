"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { pageLinkGroups } from "./site-links";

interface PageDirectoryProps {
	title?: string;
	description?: string;
	compact?: boolean;
}

export default function PageDirectory({
	title = "All pages",
	description = "Jump straight into any route in the app.",
	compact = false,
}: PageDirectoryProps) {
	return (
		<section className={compact ? "" : "py-20 px-6"}>
			<div className={compact ? "" : "max-w-7xl mx-auto"}>
				<div
					className="rounded-[28px] border p-6 md:p-8"
					style={{ borderColor: "var(--hairline)", backgroundColor: "var(--ink-card)" }}
				>
					<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
								{title}
							</p>
							<h2 className="serif text-3xl md:text-4xl mt-2" style={{ fontWeight: 500 }}>
								Find every surface in one place
							</h2>
						</div>
						<p className="max-w-xl text-sm md:text-base text-[var(--muted)]">{description}</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{pageLinkGroups.map((group) => (
							<div
								key={group.title}
								className="rounded-2xl border p-4"
								style={{ borderColor: "var(--hairline)", backgroundColor: "var(--ink-raised)" }}
							>
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
									{group.title}
								</p>
								<div className="mt-4 space-y-2">
									{group.links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className="group flex items-start justify-between gap-4 rounded-xl border px-4 py-3 transition-colors hover:border-[var(--hairline-strong)] hover:bg-white/5"
											style={{ borderColor: "transparent" }}
										>
											<span>
												<span className="block text-sm font-semibold text-[#f3eee0]">
													{link.label}
												</span>
												<span className="mt-1 block text-xs text-[var(--muted)]">
													{link.description}
												</span>
											</span>
											<ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)] opacity-70 transition-transform group-hover:translate-x-0.5" />
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
