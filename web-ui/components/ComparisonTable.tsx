"use client";

import { motion } from "motion/react";
import { Check, ArrowLeftRight } from "lucide-react";
import { easeOut, comparisonRows } from "./constants";

export default function ComparisonTable() {
  return (
    <section id="compare" className="py-24 px-6 scroll-mt-20" style={{ borderTop: "1px solid var(--hairline)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-raised)" }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="text-sm text-[var(--muted)]">Honest comparison</span>
          </div>
          <h2 className="serif text-4xl md:text-5xl mb-4" style={{ fontWeight: 480 }}>
            Trace vs Screen Studio
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Same professional output. Very different philosophy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid var(--hairline-strong)",
            backgroundColor: "var(--ink-card)",
          }}
        >
          {/* Header row */}
          <div
            className="grid grid-cols-3 gap-0 text-sm font-semibold"
            style={{ borderBottom: "1px solid var(--hairline-strong)" }}
          >
            <div className="px-5 py-4 text-left text-[var(--muted)]">Feature</div>
            <div
              className="px-5 py-4 text-center"
              style={{
                backgroundColor: "rgba(212,168,87,0.05)",
                color: "var(--gold)",
              }}
            >
              Trace
            </div>
            <div className="px-5 py-4 text-center text-[var(--muted)]">Screen Studio</div>
          </div>

          {/* Body rows */}
          {comparisonRows.map(([feature, trace, studio], i) => (
            <div
              key={feature}
              className="grid grid-cols-3 gap-0 text-sm"
              style={{
                borderBottom: i < comparisonRows.length - 1 ? "1px solid var(--hairline)" : "none",
                backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}
            >
              <div className="px-5 py-3.5 text-left text-[#dcd6c7]">{feature}</div>
              <div
                className="px-5 py-3.5 text-center font-medium"
                style={{
                  backgroundColor: "rgba(212,168,87,0.03)",
                  color: trace.startsWith("✓") ? "#4ade80" : trace === "$9 once" ? "var(--gold)" : "#f3eee0",
                }}
              >
                {trace.startsWith("✓") ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    {trace.slice(2)}
                  </span>
                ) : trace === "$9 once" ? (
                  <span className="text-[var(--gold)] font-semibold">$9 once</span>
                ) : (
                  trace
                )}
              </div>
              <div className="px-5 py-3.5 text-center text-[var(--muted)]">
                {studio.startsWith("✗") ? (
                  <span className="opacity-50">{studio}</span>
                ) : (
                  studio
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[var(--muted)] mt-6"
        >
          Screen Studio is a great product. Trace is simply a different approach: cross-platform, AI-enhanced, and permanently affordable.
        </motion.p>
      </div>
    </section>
  );
}
