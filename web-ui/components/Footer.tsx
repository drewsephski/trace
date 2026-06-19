"use client";

import Link from "next/link";
import BrandMark from "./BrandMark";
import { GITHUB_REPO } from "./constants";
import { pageLinkGroups } from "./site-links";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <BrandMark />
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              Beautiful screen recordings without the subscription trap. Explore the full product,
              account, billing, and auth flow from the landing page.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#f3eee0]"
              >
                GitHub
              </a>
              <a
                href={`${GITHUB_REPO}/blob/main/LICENSE`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#f3eee0]"
              >
                License
              </a>
              <a
                href={`${GITHUB_REPO}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#f3eee0]"
              >
                Issues
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {pageLinkGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-[#f3eee0] transition-colors hover:text-[var(--gold)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--hairline)] pt-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>Core MIT licensed • App $9 one-time • No subscriptions</p>
          <p>Design system shared across every page in the app.</p>
        </div>
      </div>
    </footer>
  );
}
