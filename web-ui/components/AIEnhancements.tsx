"use client";

import { motion } from "motion/react";
import { Sparkles, Zap, Subtitles, MousePointer2 } from "lucide-react";
import { easeOut } from "./constants";

export default function AIEnhancements() {
  return (
    <section id="features" className="py-24 px-6 scroll-mt-20" style={{ borderTop: "1px solid var(--hairline)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 mx-auto w-fit"
            style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-raised)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="text-sm text-[var(--muted)]">AI-powered</span>
          </div>
          <h2 className="serif text-4xl md:text-5xl mb-4" style={{ fontWeight: 480 }}>
            AI enhancements
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Features that turn a raw capture into something you&apos;re proud to send —
            automatically, on your machine, with zero editing skill required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              title: "AI Auto Zoom",
              description:
                "Cursor follows naturally. Zooms happen automatically. No keyframes, no timeline scrubbing — just a polished demo that looks like you spent hours on it.",
              highlight: "No manual editing required",
            },
            {
              icon: Subtitles,
              title: "Smart Captions",
              description:
                "Speech-to-text captions generated entirely on your device. Supports 13+ languages. Stylable fonts, positions, and animations — all private, all local.",
              highlight: "100% on-device, zero uploads",
            },
            {
              icon: MousePointer2,
              title: "Cursor Effects",
              description:
                "Smooth cursor smoothing, click highlights, and elegant cursor themes. Automatically hide the cursor when idle. Make every interaction look deliberate and professional.",
              highlight: "Enhanced over Screen Studio defaults",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: easeOut }}
              className="glow-card rounded-xl p-6 transition-shadow relative overflow-hidden"
              style={{ border: "1px solid var(--hairline)", backgroundColor: "var(--ink-card)" }}
            >
              {/* Subtle gold accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
                style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "rgba(212,168,87,0.06)" }}
              >
                <feature.icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--muted)] text-[15px] leading-relaxed mb-4">{feature.description}</p>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(212,168,87,0.08)", color: "var(--gold)" }}
              >
                <Sparkles className="w-3 h-3" />
                {feature.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
