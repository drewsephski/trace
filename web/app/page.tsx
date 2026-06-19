"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  Zap,
  Shield,
  Star,
  ArrowRight,
  Check,
  Monitor,
  Mic,
  Camera,
  Sparkles,
  Gem,
  Code2,
  GiftIcon,
  ChevronDown,
  MousePointer2,
  Subtitles,
  ArrowLeftRight,
} from "lucide-react";

const GITHUB_REPO = "https://github.com/drewsephski/trace";
// TODO: wire this up to a real checkout (Stripe Payment Link, Gumroad, Lemon Squeezy, etc.)
const PURCHASE_URL = "#pricing";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LOGO_SRC = "/trace.png";

const captions = [
  "Welcome to Trace — your recordings will never be the same",
  "Auto zoom follows your every move",
  "Smart captions generated on-device",
  "Smooth cursor effects, automatically",
];

const comparisonRows: [string, string, string][] = [
  ["Price", "$9 once", "$29/month"],
  ["Windows", "✓", "✗"],
  ["Linux", "✓", "✗"],
  ["macOS", "✓", "✓"],
  ["AI Auto Zoom", "✓", "✓"],
  ["AI Captions / Subtitles", "✓", "✓"],
  ["Cursor Effects", "✓ Enhanced", "Basic"],
  ["Local / On-Device AI", "✓", "✓"],
  ["Open Source", "✓ MIT", "✗ Closed"],
  ["Export 4K 60fps", "✓", "✓"],
  ["GIF Export", "✓", "✓"],
  ["Lifetime Ownership", "✓", "Subscription only"],
];

const faqItems = [
  {
    q: "How is Trace different from Screen Studio?",
    a: "Trace costs $9 once instead of $29/month. We run on Windows, macOS, and Linux — Screen Studio is macOS only. We offer AI-powered captions and enhanced cursor effects, all processed locally on your machine. Our core is MIT-licensed open source. Same professional output, radically different philosophy.",
  },
  {
    q: "Why is it only $9? What's the catch?",
    a: "No catch. Trace is indie-built with no investors, no cloud infrastructure to fund, and no sales team to pay. We sell software directly to users. $9 is a fair price for a polished app that you own forever. The open-source core is free if you want to build it yourself — $9 is for the convenience of signed builds, auto-updates, and priority support.",
  },
  {
    q: "Is it as polished as Screen Studio?",
    a: "Trace produces the same quality output — 4K 60fps, smooth auto zooms, motion blur, professional captions. Our interface is designed for speed: record, auto-enhance, and export in minutes. The best way to judge is to try it. If it doesn't meet your standards, we'll refund it.",
  },
  {
    q: "Does it work on Windows and Linux?",
    a: "Yes. Trace is built with Electron and runs natively on macOS (Intel + Apple Silicon), Windows 10+, and most Linux distributions. The same features, the same quality, on every platform. Screen Studio is macOS-only.",
  },
  {
    q: "Are future updates included?",
    a: "Yes. Your $9 purchase includes all future updates — forever. No upgrade fees, no renewal, no version 2.0 that you have to buy again. When we ship new features, you get them.",
  },
  {
    q: "Can I use it commercially?",
    a: "Absolutely. The paid version is a standard commercial license. The open-source core is MIT licensed, which permits commercial use, modification, and redistribution. Use Trace to create product demos, tutorials, social media content, client work — anything you want.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionIndex((i) => (i + 1) % captions.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen text-[#f3eee0] selection:bg-[#d4a857] selection:text-[#0b0a08]"
      style={{ fontFamily: "var(--font-body)", backgroundColor: "#0b0a08" }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340..600;1,9..144,400..500&family=Manrope:wght@400;500;600;700;800&display=swap");

        :root {
          --font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
          --font-body: "Manrope", -apple-system, BlinkMacSystemFont, sans-serif;
          --gold: #d4a857;
          --gold-bright: #e6c179;
          --gold-soft: rgba(212, 168, 87, 0.14);
          --ink: #0b0a08;
          --ink-raised: #14120e;
          --ink-card: #110f0b;
          --hairline: rgba(245, 238, 222, 0.09);
          --hairline-strong: rgba(245, 238, 222, 0.16);
          --muted: #a39a87;
        }

        body {
          background-color: var(--ink);
        }

        .grain {
          position: relative;
        }
        .grain::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 30;
          pointer-events: none;
          opacity: 0.045;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .serif {
          font-family: var(--font-display);
        }

        .gold-gradient-text {
          background: linear-gradient(120deg, #f3eee0 0%, #f3eee0 40%, var(--gold) 70%, var(--gold-bright) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .glow-card:hover {
          box-shadow: 0 0 0 1px var(--hairline-strong), 0 24px 60px -20px rgba(212, 168, 87, 0.18);
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="grain">
        {/* Navigation */}
        <nav
          className="fixed top-0 w-full z-50 backdrop-blur-xl"
          style={{ backgroundColor: "rgba(11,10,8,0.75)", borderBottom: "1px solid var(--hairline)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-raised)" }}
              >
                <Image src={LOGO_SRC} alt="" width={24} height={24} className="w-6 h-6 rounded-md" />
              </div>
              <span className="serif text-xl tracking-tight" style={{ fontWeight: 500 }}>
                Trace
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--muted)] hover:text-[#f3eee0] transition-colors">
                Features
              </a>
              <a href="#compare" className="text-sm text-[var(--muted)] hover:text-[#f3eee0] transition-colors">
                Compare
              </a>
              <a href="#pricing" className="text-sm text-[var(--muted)] hover:text-[#f3eee0] transition-colors">
                Pricing
              </a>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--muted)] hover:text-[#f3eee0] transition-colors flex items-center gap-1.5"
              >
                <GiftIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
            <motion.a
              href={PURCHASE_URL}
              className="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
            >
              Get Trace
            </motion.a>
          </div>
        </nav>

        {/* ─────────────────── HERO ─────────────────── */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
          {/* Decorative gradient blobs */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(212,168,87,0.16), rgba(212,168,87,0.05) 55%, transparent 80%)",
              filter: "blur(10px)",
            }}
          />
          <div
            className="absolute top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(closest-side, rgba(122,90,40,0.18), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-9"
              style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-raised)" }}
            >
              <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-current" />
              <span className="text-sm text-[var(--muted)]">
                The <strong className="text-[#f3eee0]">$9</strong> Screen Studio alternative
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
              className="serif gold-gradient-text text-5xl md:text-7xl leading-[1.05] mb-7 max-w-4xl mx-auto"
              style={{ fontWeight: 480 }}
            >
              Screen Studio quality.<br />
              <span className="text-[#f3eee0]">One-tenth</span> the price.
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: easeOut }}
              className="text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto mb-11 leading-relaxed"
            >
              The first screen recorder that competes with $29/month apps —{/* no-widow */}
              {" "}AI auto zooms, smart captions, and cursor effects on macOS, Windows, and Linux.
              {" "}One payment. <em className="text-[#f3eee0] not-italic">Forever.</em>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: easeOut }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <motion.a
                href={PURCHASE_URL}
                className="px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2"
                style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
              >
                Get Trace — $9
              </motion.a>
              <motion.a
                href="#compare"
                className="px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2"
                style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-raised)" }}
              >
                See the comparison
                <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.a>
            </motion.div>

            {/* Platforms */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="text-sm text-[var(--muted)] mb-8"
            >
              macOS · Windows · Linux — one payment, lifetime updates
            </motion.p>

            {/* ─── Hero Visual (Showcase) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
              className="mt-8 relative"
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to top, #0b0a08, transparent 30%)" }}
              />
              <div
                className="rounded-2xl mx-auto max-w-5xl w-full overflow-hidden relative"
                style={{
                  border: "1px solid var(--hairline-strong)",
                  boxShadow: "0 40px 100px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,87,0.06)",
                  backgroundColor: "var(--ink-raised)",
                }}
              >
                {/* Window title bar */}
                <div
                  className="flex items-center gap-2 px-5 py-3.5"
                  style={{ borderBottom: "1px solid var(--hairline)", backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                    <div className="w-3 h-3 rounded-full bg-[var(--gold)]/50" />
                  </div>
                  <span className="text-[11px] text-[var(--muted)] font-medium ml-3 tracking-wide">Trace Editor</span>
                </div>

                {/* Content area */}
                <div
                  className="relative w-full aspect-video flex items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(160deg, #161310, #0e0c09)" }}
                >
                  {/* Subtle grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Mock desktop background */}
                  <div
                    className="absolute inset-6 rounded-xl overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #1c1814 0%, #12100d 50%, #0f0d0a 100%)",
                      border: "1px solid var(--hairline)",
                    }}
                  >
                    {/* Mock window being recorded */}
                    <div
                      className="absolute top-6 left-6 right-20 bottom-20 rounded-lg overflow-hidden"
                      style={{
                        border: "1px solid rgba(245,238,222,0.06)",
                        background: "linear-gradient(180deg, rgba(245,238,222,0.02), transparent)",
                      }}
                    >
                      {/* Mock content inside window */}
                      <div
                        className="h-8 flex items-center gap-2 px-3"
                        style={{ borderBottom: "1px solid rgba(245,238,222,0.04)" }}
                      >
                        <div className="w-2 h-2 rounded-full bg-[var(--gold)]/30" />
                        <div className="w-2 h-2 rounded-full bg-[var(--gold)]/20" />
                        <div className="w-2 h-2 rounded-full bg-[var(--gold)]/15" />
                        <div className="w-20 h-2 rounded-sm ml-2" style={{ backgroundColor: "rgba(212,168,87,0.1)" }} />
                      </div>
                      <div className="p-4 space-y-2.5">
                        <div className="h-3 w-3/4 rounded-sm" style={{ backgroundColor: "rgba(212,168,87,0.06)" }} />
                        <div className="h-3 w-1/2 rounded-sm" style={{ backgroundColor: "rgba(212,168,87,0.04)" }} />
                        <div
                          className="h-20 rounded-md mt-3"
                          style={{ backgroundColor: "rgba(212,168,87,0.03)", border: "1px solid rgba(212,168,87,0.06)" }}
                        />
                      </div>
                    </div>

                    {/* Timeline bar at bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-14 flex items-center gap-1 px-4"
                      style={{
                        borderTop: "1px solid var(--hairline)",
                        backgroundColor: "rgba(11,10,8,0.7)",
                      }}
                    >
                      {/* Waveform bars */}
                      <div className="flex items-end gap-[2px] h-8 flex-1">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-t"
                            style={{
                              height: `${20 + Math.sin(i * 0.5) * 15 + (i % 7) * 1.5}%`,
                              backgroundColor: i > 40 ? "var(--gold)" : "rgba(245,238,222,0.08)",
                              opacity: 0.6,
                            }}
                          />
                        ))}
                      </div>
                      {/* Caption track indicator */}
                      <div
                        className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px]"
                        style={{ backgroundColor: "rgba(212,168,87,0.1)", color: "var(--gold)" }}
                      >
                        <Subtitles className="w-3 h-3" />
                        <span>CC</span>
                      </div>
                    </div>

                    {/* Cursor with glow effect */}
                    <motion.div
                      className="absolute pointer-events-none z-20"
                      style={{ left: "45%", top: "42%" }}
                      animate={{ x: [0, 25, 0, -15, 0], y: [0, -12, -20, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* Outer glow */}
                      <div
                        className="absolute -inset-4 rounded-full"
                        style={{
                          background: "radial-gradient(circle, rgba(212,168,87,0.25) 0%, transparent 70%)",
                        }}
                      />
                      {/* Zoom indicator ring */}
                      <motion.div
                        className="absolute -inset-2 rounded-full border-2"
                        style={{ borderColor: "rgba(212,168,87,0.3)" }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Cursor dot */}
                      <div
                        className="w-5 h-5 rounded-full relative z-10"
                        style={{
                          backgroundColor: "var(--gold)",
                          boxShadow: "0 0 15px rgba(212,168,87,0.5), 0 0 40px rgba(212,168,87,0.15)",
                        }}
                      />
                    </motion.div>

                    {/* Feature badges floating */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="absolute top-4 right-4 flex flex-col gap-1.5"
                    >
                      {[
                        { icon: Zap, label: "Auto Zoom" },
                        { icon: Subtitles, label: "Captions" },
                        { icon: MousePointer2, label: "Cursor FX" },
                      ].map((badge, i) => (
                        <motion.div
                          key={badge.label}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.15, duration: 0.4 }}
                          className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(11,10,8,0.8)",
                            border: "1px solid var(--hairline-strong)",
                            color: "var(--muted)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <badge.icon className="w-3 h-3 text-[var(--gold)]" />
                          {badge.label}
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Animated caption overlay */}
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={captionIndex}
                          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                          transition={{ duration: 0.4, ease: easeOut }}
                          className="px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.75)",
                            border: "1px solid var(--hairline)",
                            backdropFilter: "blur(8px)",
                            color: "#f3eee0",
                          }}
                        >
                          {captions[captionIndex]}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Record indicator (persistent from original) */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 h-8 w-48 rounded-lg flex items-center justify-center gap-2 z-20"
                    style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "rgba(11,10,8,0.7)" }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-[11px] text-[var(--muted)] font-medium tracking-wide">
                      REC 00:00:15
                    </span>
                  </div>
                </div>
              </div>

              {/* Caption below preview */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-center text-xs text-[var(--muted)] mt-4 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[var(--gold)]" />
                Auto zoom · Smart captions · Cursor effects — all applied automatically
              </motion.p>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-14 flex items-center justify-center gap-8 md:gap-14 flex-wrap"
            >
              {[
                ["4K", "Capture"],
                ["60fps", "Smooth motion"],
                ["13+", "Languages"],
                ["MIT", "Core license"],
              ].map(([stat, label], i) => (
                <div key={stat} className="flex items-center gap-8 md:gap-14">
                  <div className="text-center">
                    <div className="serif text-2xl text-[#f3eee0]">{stat}</div>
                    <div className="text-xs text-[var(--muted)] mt-1 tracking-wide uppercase">{label}</div>
                  </div>
                  {i < 3 && <div className="hidden md:block w-px h-8" style={{ backgroundColor: "var(--hairline)" }} />}
                </div>
              ))}
              {/* GitHub stars */}
              <div className="flex items-center gap-8 md:gap-14">
                <div className="text-center">
                  <div className="serif text-2xl text-[#f3eee0] flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-current text-[var(--gold)]" />
                    2k+
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1 tracking-wide uppercase">GitHub</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>



        {/* ─────────────────── COMPARISON ─────────────────── */}
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

        {/* ─────────────────── AI ENHANCEMENTS ─────────────────── */}
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

        {/* ─────────────────── RECORDING FEATURES ─────────────────── */}
        <section className="py-20 px-6" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="text-center mb-14"
            >
              <h2 className="serif text-3xl md:text-4xl mb-3" style={{ fontWeight: 480 }}>
                Everything you need to record
              </h2>
              <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
                The essentials, done well. No bloat, no confusing menus.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Monitor,
                  title: "Screen & Window",
                  description: "Record any window or your entire display in crystal clear quality.",
                },
                {
                  icon: Mic,
                  title: "Audio Recording",
                  description: "Microphone, system audio, or both. Clean capture, no configuration needed.",
                },
                {
                  icon: Camera,
                  title: "Webcam Overlay",
                  description: "Picture-in-picture webcam with drag positioning and shape options.",
                },
                {
                  icon: Shield,
                  title: "100% Private",
                  description: "No telemetry, no cloud uploads, no accounts. Everything renders locally.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.6, ease: easeOut }}
                  className="glow-card rounded-xl p-5 transition-shadow"
                  style={{ border: "1px solid var(--hairline)", backgroundColor: "var(--ink-card)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                    style={{ border: "1px solid var(--hairline-strong)" }}
                  >
                    <feature.icon className="w-4.5 h-4.5 text-[var(--gold)]" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5">{feature.title}</h3>
                  <p className="text-[var(--muted)] text-[14px] leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────── MORE FEATURES ─────────────────── */}
        <section className="py-20 px-6" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="text-center mb-14"
            >
              <h2 className="serif text-3xl md:text-4xl mb-3" style={{ fontWeight: 480 }}>
                Professional finishing tools
              </h2>
              <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
                Polish your recordings like a pro editor — without being one.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                [
                  "Motion blur for smooth, natural transitions",
                  "Timeline with audio waveform for precise editing",
                  "Per-segment speed control",
                  "Custom wallpapers and background images",
                ],
                [
                  "Text, arrow, and image annotations",
                  "Export to MP4, GIF, or shareable links",
                  "Support for 13+ languages in captions",
                  "Keyboard shortcut display for tutorials",
                ],
              ].map((features, colIndex) => (
                <div key={colIndex} className="space-y-3">
                  {features.map((feature) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: colIndex === 0 ? -12 : 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: easeOut }}
                      className="flex items-center gap-3 rounded-lg p-3.5"
                      style={{ border: "1px solid var(--hairline)", backgroundColor: "rgba(255,255,255,0.012)" }}
                    >
                      <Check className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                      <span className="text-sm text-[#dcd6c7]">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────── PRICING ─────────────────── */}
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
                  href={PURCHASE_URL}
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

        {/* ─────────────────── FAQ ─────────────────── */}
        <section className="py-24 px-6" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="text-center mb-14"
            >
              <h2 className="serif text-4xl md:text-5xl mb-4" style={{ fontWeight: 480 }}>
                Questions? Answered.
              </h2>
              <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
                Everything you were about to search for.
              </p>
            </motion.div>

            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: "1px solid var(--hairline)",
                    backgroundColor: "var(--ink-card)",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-semibold text-[#dcd6c7]">{item.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-[var(--muted)]" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? "auto" : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-[14px] text-[var(--muted)] leading-relaxed">{item.a}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────── CTA ─────────────────── */}
        <section className="py-24 px-6" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="rounded-2xl p-12 md:p-16"
              style={{
                border: "1px solid rgba(212,168,87,0.3)",
                background: "linear-gradient(150deg, rgba(212,168,87,0.08), rgba(212,168,87,0.02))",
              }}
            >
              <h2 className="serif text-3xl md:text-5xl mb-4" style={{ fontWeight: 480 }}>
                Start recording like a pro —<br />
                <span className="text-[var(--gold)]">for $9</span>
              </h2>
              <p className="text-lg text-[var(--muted)] mb-8 max-w-xl mx-auto">
                Join the creators switching from $29/month tools to a fairer model.
                One payment. Professional output. No regrets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a
                  href={PURCHASE_URL}
                  className="px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2"
                  style={{ backgroundColor: "var(--gold)", color: "var(--ink)" }}
                >
                  Get Trace — $9
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[#f3eee0] underline underline-offset-4 transition-colors"
                >
                  or self-host the open-source core for free
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────── FOOTER ─────────────────── */}
        <footer className="py-12 px-6" style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ border: "1px solid var(--hairline-strong)", backgroundColor: "var(--ink-raised)" }}
              >
                  <Image src={LOGO_SRC} alt="" width={24} height={24} className="w-6 h-6 rounded-md" />
              </div>
                <span className="serif text-xl tracking-tight" style={{ fontWeight: 500 }}>
                  Trace
                </span>
              </div>
              <div className="flex items-center gap-6 text-[var(--muted)] text-sm">
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f3eee0] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={`${GITHUB_REPO}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f3eee0] transition-colors"
                >
                  License
                </a>
                <a
                  href={`${GITHUB_REPO}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f3eee0] transition-colors"
                >
                  Issues
                </a>
              </div>
              <p className="text-[var(--muted)] text-sm">
                Core MIT Licensed &bull; App $9 One-Time &bull; No Subscriptions
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
