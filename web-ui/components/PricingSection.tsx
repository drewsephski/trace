"use client";

import { motion } from "motion/react";
import { Gem, Code2, Check, Star, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { easeOut, GITHUB_REPO } from "./constants";
import { getPrimaryCtaHref } from "./site-links";

export default function PricingSection() {
  const { user } = useAuth();
  const primaryHref = getPrimaryCtaHref(!!user);

  return (
    <section id="pricing" className="py-24 px-6 scroll-mt-20" style={{ borderTop: "1px solid var(--hairline)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center mb-14"
        >
          <h2 className="serif text-4xl md:text-5xl mb-4" style={{ fontWeight: 480 }}>
            One price. <span className="text-[#f3eee0]">Forever.</span>
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            No subscriptions, no upgrade fees, no &ldquo;pro&rdquo; tier that
            withholds the features you need. What you pay is what you get — permanently.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Pro Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="relative rounded-2xl p-8 flex flex-col"
            style={{
              border: "1px solid rgba(212,168,87,0.4)",
              backgroundColor: "var(--ink-card)",
              boxShadow: "0 30px 80px -30px rgba(212,168,87,0.15)",
            }}
          >
            <div
              className="absolute -top-3 left-8 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
            >
              Most popular
            </div>
            <div className="flex items-center gap-2 mb-1 text-[var(--gold)]">
              <Gem className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide uppercase">Trace</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1 mt-2">
              <span className="serif text-5xl" style={{ fontWeight: 480 }}>$9</span>
              <span className="text-[var(--muted)] text-sm">one-time</span>
            </div>
            <p className="text-[var(--muted)] text-sm mb-5">For everyone who wants a polished app, instantly.</p>

            {/* Trust callout */}
            <div
              className="rounded-lg px-4 py-3 mb-6 text-sm"
              style={{ backgroundColor: "rgba(212,168,87,0.06)", border: "1px solid rgba(212,168,87,0.15)" }}
            >
              <p className="text-[#dcd6c7] leading-relaxed">
                Indie-built. No investors. No cloud infrastructure to fund.
                Just good software sold directly to you at a fair price.
              </p>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {[
                "Signed builds for macOS, Windows & Linux",
                "Automatic updates, forever",
                "No build step or toolchain required",
                "License key delivered instantly",
                "Priority email support",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--gold)] mt-0.5 flex-shrink-0" />
                  <span className="text-[15px] text-[#dcd6c7]">{line}</span>
                </div>
              ))}
            </div>

            <motion.a
              href={primaryHref}
              className="w-full text-center px-6 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
            >
              Get Trace — $9
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Self-Hosted Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
            className="relative rounded-2xl p-8 flex flex-col"
            style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-card)" }}
          >
            <div className="flex items-center gap-2 mb-1 text-[var(--muted)]">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide uppercase">Self-hosted</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1 mt-2">
              <span className="serif text-5xl" style={{ fontWeight: 480 }}>Free</span>
              <span className="text-[var(--muted)] text-sm">forever</span>
            </div>
            <p className="text-[var(--muted)] text-sm mb-5">
              For teams that need full control. Build from source, customize, and integrate.
            </p>

            {/* Spacer to match card height */}
            <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ backgroundColor: "transparent" }}>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Full source access under MIT license. Customize, audit, and extend freely.
              </p>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {[
                "Full source access, MIT licensed",
                "Build yourself with Cargo / Node",
                "Community support on GitHub",
                "Customize and extend freely",
                "No license key, no account needed",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
                  <span className="text-[15px] text-[#dcd6c7]">{line}</span>
                </div>
              ))}
            </div>

            <motion.a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center px-6 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
              style={{ border: "1px solid var(--hairline-strong)" }}
            >
              <Star className="w-4 h-4" />
              View source on GitHub
            </motion.a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[var(--muted)] mt-8 max-w-xl mx-auto"
        >
          Indie-built. No subscriptions. No telemetry. No cloud catch.
          Just software that respects you and your wallet.
        </motion.p>
      </div>
    </section>
  );
}
