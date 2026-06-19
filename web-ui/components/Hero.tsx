/** biome-ignore-all assist/source/organizeImports: false positive */
"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Star,
  ArrowRight,
  Sparkles,
  Subtitles,
  Zap,
  MousePointer2,
  Play,
  Pause,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { easeOut, captions } from "./constants";
import { getPrimaryCtaHref } from "./site-links";

/* ─── Static data ─── */

const codeLineData = [
  { width: 72, highlighted: true },
  { width: 48, highlighted: false },
  { width: 88, highlighted: true },
  { width: 56, highlighted: false },
  { width: 34, highlighted: false },
  { width: 92, highlighted: true },
  { width: 62, highlighted: false },
  { width: 78, highlighted: true },
];

type FeatureKey = "autoZoom" | "captions" | "cursorFX";

const featureItems: { key: FeatureKey; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { key: "autoZoom", icon: Zap, label: "Auto Zoom" },
  { key: "captions", icon: Subtitles, label: "Captions" },
  { key: "cursorFX", icon: MousePointer2, label: "Cursor FX" },
];

type TrailPoint = { x: number; y: number; id: number };

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Component ─── */

export default function Hero() {
	const { user } = useAuth();
	const primaryHref = getPrimaryCtaHref(!!user);

  /* ------ State ------ */
  const [captionIndex, setCaptionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [beforeAfter, setBeforeAfter] = useState<"before" | "after">("after");
  const [featureToggles, setFeatureToggles] = useState<Record<FeatureKey, boolean>>({
    autoZoom: true,
    captions: true,
    cursorFX: true,
  });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isDemoHovered, setIsDemoHovered] = useState(false);
  const [visibleCodeLines, setVisibleCodeLines] = useState(0);
  const [waveformPhase, setWaveformPhase] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [typedLength, setTypedLength] = useState(0);

  /* ------ Refs ------ */
  const demoAreaRef = useRef<HTMLDivElement>(null);
  const mouseRafRef = useRef<number | null>(null);
  const latestPosRef = useRef({ x: 50, y: 50 });
  const trailIdRef = useRef(0);

  /* ------ Derived values ------ */
  const isAfter = beforeAfter === "after";
  const autoZoomActive = isAfter && featureToggles.autoZoom;
  const captionsActive = isAfter && featureToggles.captions;
  const cursorFxActive = isAfter && featureToggles.cursorFX;
  // Clamp so the zoom never centers on an extreme edge of the frame
  const zoomOriginX = Math.min(75, Math.max(25, mousePos.x));
  const zoomOriginY = Math.min(75, Math.max(25, mousePos.y));

  /* ------ Effect: Auto-cycle captions (pauses when not playing) ------ */
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCaptionIndex((i) => (i + 1) % captions.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ------ Effect: Recording timer ------ */
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ------ Effect: Code typing animation ------ */
  useEffect(() => {
    if (!isPlaying) {
      setVisibleCodeLines((prev) => Math.max(prev, 3));
      return;
    }
    const interval = setInterval(() => {
      setVisibleCodeLines((i) => (i >= codeLineData.length ? 1 : i + 1));
    }, 700);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ------ Effect: Waveform pulse ------ */
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveformPhase((p) => p + 0.15);
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ------ Effect: Clear cursor trail when Cursor FX is off ------ */
  useEffect(() => {
    if (!cursorFxActive) setTrail([]);
  }, [cursorFxActive]);

  /* ------ Effect: Live-typing transcription panel ------ */
  useEffect(() => {
    if (!captionsActive) {
      setTypedLength(0);
      return;
    }
    setTypedLength(0);
    const text = captions[captionIndex];
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedLength(i);
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [captionIndex, captionsActive]);

  /* ------ Effect: Clean up RAF on unmount ------ */
  useEffect(() => {
    return () => {
      if (mouseRafRef.current !== null) cancelAnimationFrame(mouseRafRef.current);
    };
  }, []);

  /* ------ Handlers ------ */

  const toggleFeature = useCallback(
    (key: FeatureKey) => {
      if (beforeAfter === "before") return;
      setFeatureToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [beforeAfter],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!demoAreaRef.current) return;
      const rect = demoAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      latestPosRef.current = {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      };
      if (mouseRafRef.current === null) {
        mouseRafRef.current = requestAnimationFrame(() => {
          setMousePos(latestPosRef.current);
          if (beforeAfter === "after" && featureToggles.cursorFX) {
            trailIdRef.current += 1;
            const point: TrailPoint = { ...latestPosRef.current, id: trailIdRef.current };
            setTrail((prev) => [...prev.slice(-14), point]);
          }
          mouseRafRef.current = null;
        });
      }
    },
    [beforeAfter, featureToggles.cursorFX],
  );

  const handleCaptionClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCaptionIndex((i) => (i + 1) % captions.length);
  }, []);

  const handleDemoClick = useCallback(() => {
    setRippleKey((k) => k + 1);
  }, []);

  return (
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
            href={primaryHref}
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

        {/* ─── Hero Visual (Interactive Showcase) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
          className="mt-8 relative"
        >
          {/* Gradient fade at top */}
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
            {/* ─── Window title bar ─── */}
            <div
              className="flex items-center gap-2 px-5 py-3.5"
              style={{ borderBottom: "1px solid var(--hairline)", backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                <div className="w-3 h-3 rounded-full bg-[var(--gold)]/50" />
              </div>
              <span className="text-[11px] text-[var(--muted)] font-medium ml-3 tracking-wide">
                Trace Editor
              </span>
            </div>

            {/* ─── Demo content area ─── */}
            <div
              ref={demoAreaRef}
              className="relative w-full aspect-video flex items-center justify-center overflow-hidden select-none"
              style={{ background: "linear-gradient(160deg, #161310, #0e0c09)" }}
              onPointerMove={handlePointerMove}
              onPointerEnter={() => setIsDemoHovered(true)}
              onPointerLeave={() => setIsDemoHovered(false)}
            >
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* ─── Mock desktop background ─── */}
              <div
                className="absolute inset-6 rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1c1814 0%, #12100d 50%, #0f0d0a 100%)",
                  border: "1px solid var(--hairline)",
                }}
                onClick={handleDemoClick}
              >
                {/* ─── Mock window being recorded (scales when Auto Zoom is active) ─── */}
                <motion.div
                  className="absolute top-6 left-6 right-20 bottom-20 rounded-lg overflow-hidden"
                  style={{
                    border: "1px solid rgba(245,238,222,0.06)",
                    background: "linear-gradient(180deg, rgba(245,238,222,0.02), transparent)",
                    transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`,
                  }}
                  animate={{
                    scale: autoZoomActive ? 1.3 : 1,
                    borderColor: isAfter
                      ? ["rgba(212,168,87,0.08)", "rgba(212,168,87,0.16)", "rgba(212,168,87,0.08)"]
                      : "rgba(245,238,222,0.06)",
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 140, damping: 16, mass: 0.6 },
                    borderColor: isAfter
                      ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.4 },
                  }}
                >
                  {/* Mock window title bar */}
                  <div
                    className="h-8 flex items-center gap-2 px-3"
                    style={{ borderBottom: "1px solid rgba(245,238,222,0.04)" }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--gold)]/30" />
                    <div className="w-2 h-2 rounded-full bg-[var(--gold)]/20" />
                    <div className="w-2 h-2 rounded-full bg-[var(--gold)]/15" />
                    <div
                      className="w-20 h-2 rounded-sm ml-2"
                      style={{ backgroundColor: "rgba(212,168,87,0.1)" }}
                    />
                  </div>

                  {/* Animated code content */}
                  <div className="p-4 space-y-2.5">
                    {codeLineData.map((line, i) => {
                      const isVisible = i < visibleCodeLines;
                      const justAppeared = i === visibleCodeLines - 1;
                      return (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={{
                            opacity: isVisible ? 1 : 0,
                            x: isVisible ? 0 : -4,
                            height: isVisible ? "auto" : 0,
                          }}
                          transition={{
                            duration: justAppeared ? 0.35 : 0.25,
                            ease: easeOut,
                          }}
                          className="h-3 rounded-sm overflow-hidden"
                          style={{
                            width: `${line.width}%`,
                            backgroundColor: line.highlighted
                              ? "rgba(212,168,87,0.08)"
                              : "rgba(212,168,87,0.03)",
                            ...(line.highlighted && isAfter
                              ? { boxShadow: "0 0 8px rgba(212,168,87,0.04)" }
                              : {}),
                          }}
                        />
                      );
                    })}

                    {/* Code block */}
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.8 }}
                      animate={{
                        opacity: visibleCodeLines >= 5 ? 1 : 0,
                        scaleY: visibleCodeLines >= 5 ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.4, ease: easeOut }}
                      className="h-20 rounded-md mt-3 p-3 origin-top"
                      style={{
                        backgroundColor: "rgba(212,168,87,0.03)",
                        border: "1px solid rgba(212,168,87,0.06)",
                      }}
                    >
                      <div
                        className="h-2 w-3/4 rounded-sm mb-2"
                        style={{ backgroundColor: "rgba(212,168,87,0.07)" }}
                      />
                      <div
                        className="h-2 w-1/2 rounded-sm mb-2"
                        style={{ backgroundColor: "rgba(212,168,87,0.04)" }}
                      />
                      <div
                        className="h-2 w-2/3 rounded-sm"
                        style={{ backgroundColor: "rgba(212,168,87,0.05)" }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* ─── Zoom viewfinder overlay (Auto Zoom) ─── */}
                <AnimatePresence>
                  {autoZoomActive && (
                    <motion.div
                      key="zoom-box"
                      className="absolute pointer-events-none z-20"
                      style={{
                        left: `${zoomOriginX}%`,
                        top: `${zoomOriginY}%`,
                        translateX: "-50%",
                        translateY: "-50%",
                        width: "38%",
                        height: "38%",
                      }}
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.35, ease: easeOut }}
                    >
                      <div
                        className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
                        style={{ borderColor: "var(--gold)" }}
                      />
                      <div
                        className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
                        style={{ borderColor: "var(--gold)" }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
                        style={{ borderColor: "var(--gold)" }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
                        style={{ borderColor: "var(--gold)" }}
                      />
                      <div
                        className="absolute -top-5 left-0 flex items-center gap-1 text-[9px] font-medium tracking-wide uppercase"
                        style={{ color: "var(--gold)" }}
                      >
                        <Zap className="w-2.5 h-2.5" />
                        1.3×
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ─── Timeline / Waveform ─── */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-14 flex items-center gap-1 px-4"
                  style={{
                    borderTop: "1px solid var(--hairline)",
                    backgroundColor: "rgba(11,10,8,0.7)",
                  }}
                >
                  {/* Waveform bars */}
                  <div className="flex items-end gap-[2px] h-8 flex-1">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const heightStatic = 20 + Math.sin(i * 0.5) * 15 + (i % 7) * 1.5;
                      const heightDynamic =
                        heightStatic +
                        (isPlaying ? Math.sin(i * 1.2 + waveformPhase * 2) * 7 + Math.sin(i * 0.3 + waveformPhase) * 4 : 0);
                      const isGold = captionsActive || i > 40;
                      return (
                        <div
                          key={i}
                          className="w-[3px] rounded-t transition-all duration-300"
                          style={{
                            height: `${heightDynamic}%`,
                            backgroundColor: isGold
                              ? "var(--gold)"
                              : isAfter
                                ? "rgba(245,238,222,0.08)"
                                : "rgba(245,238,222,0.04)",
                            opacity: isAfter ? 0.6 : 0.25,
                            transitionDelay: captionsActive ? `${Math.min(i, 30) * 6}ms` : "0ms",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* CC indicator */}
                  <motion.div
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] shrink-0"
                    style={{ backgroundColor: "rgba(212,168,87,0.1)", color: "var(--gold)" }}
                    animate={{ opacity: isAfter ? 1 : 0.3 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Subtitles className="w-3 h-3" />
                    <span>CC</span>
                  </motion.div>
                </div>

                {/* ─── Live transcription panel (Captions) ─── */}
                <AnimatePresence>
                  {captionsActive && (
                    <motion.div
                      key="transcript-panel"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                      className="absolute bottom-4 left-4 z-20 max-w-[170px] px-2.5 py-2 rounded-lg"
                      style={{
                        backgroundColor: "rgba(11,10,8,0.78)",
                        border: "1px solid rgba(212,168,87,0.22)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div
                        className="flex items-center gap-1 mb-1 text-[8.5px] font-semibold uppercase tracking-wider"
                        style={{ color: "var(--gold)" }}
                      >
                        <Subtitles className="w-2.5 h-2.5" />
                        Live transcript
                      </div>
                      <p className="text-[10px] leading-snug" style={{ color: "var(--muted)" }}>
                        {captions[captionIndex].slice(0, typedLength)}
                        <motion.span
                          className="inline-block w-[2px] h-2.5 ml-0.5 align-middle"
                          style={{ backgroundColor: "var(--gold)" }}
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ─── Feature Toggle Pills ─── */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-30">
                  {featureItems.map((item, i) => {
                    const active = featureToggles[item.key] && isAfter;
                    return (
                      <motion.button
                        key={item.key}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.15, duration: 0.4 }}
                        onClick={() => toggleFeature(item.key)}
                        className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
                        style={{
                          backgroundColor: active
                            ? "rgba(212,168,87,0.15)"
                            : "rgba(11,10,8,0.8)",
                          border: active
                            ? "1px solid rgba(212,168,87,0.3)"
                            : "1px solid var(--hairline-strong)",
                          color: active ? "var(--gold)" : "var(--muted)",
                          backdropFilter: "blur(8px)",
                        }}
                        whileTap={{ scale: 0.92 }}
                        whileHover={
                          isAfter ? { scale: 1.04 } : {}
                        }
                      >
                        <item.icon
                          className={`w-3 h-3 transition-colors duration-300 ${
                            active ? "text-[var(--gold)]" : "text-[var(--muted)]"
                          }`}
                        />
                        {item.label}
                      </motion.button>
                    );
                  })}
                </div>

                {/* ─── Cursor trail (Cursor FX) ─── */}
                <AnimatePresence>
                  {cursorFxActive &&
                    trail.map((point, idx) => {
                      const ratio = (idx + 1) / trail.length;
                      const size = 3 + ratio * 6;
                      return (
                        <motion.div
                          key={point.id}
                          className="absolute rounded-full pointer-events-none z-10"
                          style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            width: size,
                            height: size,
                            translateX: "-50%",
                            translateY: "-50%",
                            backgroundColor: "var(--gold)",
                          }}
                          initial={{ opacity: 0.4 * ratio, scale: 1 }}
                          animate={{ opacity: 0, scale: 0.3 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                        />
                      );
                    })}
                </AnimatePresence>

                {/* ─── Interactive Cursor ─── */}
                <motion.div
                  className="absolute pointer-events-none z-20"
                  animate={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                    opacity: isDemoHovered ? (isAfter ? 1 : 0.5) : 0,
                  }}
                  transition={{
                    type: "spring",
                    damping: 22,
                    stiffness: 280,
                    mass: 0.4,
                  }}
                  style={{
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                >
                  {/* Cursor glow */}
                  {cursorFxActive && (
                    <motion.div
                      className="absolute -inset-5 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(212,168,87,0.22) 0%, transparent 70%)",
                      }}
                      animate={
                        isPlaying
                          ? { scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }
                          : { scale: 1, opacity: 0.25 }
                      }
                      transition={
                        isPlaying
                          ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.3 }
                      }
                    />
                  )}

                  {/* Zoom indicator ring */}
                  {autoZoomActive && (
                    <motion.div
                      className="absolute -inset-3 rounded-full border-2"
                      style={{ borderColor: "rgba(212,168,87,0.3)" }}
                      animate={
                        isPlaying
                          ? { scale: [1, 1.18, 1], opacity: [0.35, 0.75, 0.35] }
                          : { scale: 1, opacity: 0.3 }
                      }
                      transition={
                        isPlaying
                          ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.3 }
                      }
                    />
                  )}

                  {/* Cursor dot */}
                  <motion.div
                    className="w-5 h-5 rounded-full relative z-10"
                    style={{
                      backgroundColor: isAfter ? "var(--gold)" : "rgba(245,238,222,0.35)",
                      boxShadow:
                        isAfter && featureToggles.cursorFX
                          ? "0 0 15px rgba(212,168,87,0.5), 0 0 40px rgba(212,168,87,0.15)"
                          : "none",
                      filter: cursorFxActive ? "blur(0.6px)" : "none",
                    }}
                    animate={{ scale: isDemoHovered ? 1 : 0.6 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                {/* ─── Click Ripple Effect ─── */}
                <AnimatePresence mode="popLayout">
                  {rippleKey > 0 && (
                    <motion.div
                      key={rippleKey}
                      className="absolute inset-0 z-25 pointer-events-none"
                      initial={{ opacity: 0.15 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(212,168,87,0.06), transparent 60%)",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* ─── Caption Overlay (always visible in Processed mode, clickable) ─── */}
                {isAfter && (
                  <div
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                    onClick={handleCaptionClick}
                    onTouchEnd={handleCaptionClick}
                  >
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={captionIndex}
                        initial={{ opacity: 0, y: 6, filter: "blur(4px)", scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                        exit={{ opacity: 0, y: -6, filter: "blur(4px)", scale: 0.97 }}
                        transition={{ duration: 0.35, ease: easeOut }}
                        className="px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.75)",
                          border: "1px solid var(--hairline)",
                          backdropFilter: "blur(8px)",
                          color: "#f3eee0",
                        }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {captions[captionIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* ─── Record Indicator ─── */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 h-8 w-48 rounded-lg flex items-center justify-center gap-2 z-20"
                style={{
                  border: "1px solid var(--hairline-strong)",
                  backgroundColor: "rgba(11,10,8,0.7)",
                }}
                animate={
                  isAfter
                    ? { borderColor: "rgba(212,168,87,0.2)" }
                    : { borderColor: "var(--hairline-strong)" }
                }
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isPlaying ? "#ef4444" : "rgba(245,238,222,0.25)" }}
                  animate={
                    isPlaying
                      ? { opacity: [1, 0.25, 1] }
                      : { opacity: 0.4 }
                  }
                  transition={
                    isPlaying
                      ? { duration: 1.5, repeat: Infinity }
                      : { duration: 0.3 }
                  }
                />
                <span className="text-[11px] text-[var(--muted)] font-medium tracking-wide">
                  {isPlaying ? `REC ${formatTime(recordingTime)}` : `PAUSED ${formatTime(recordingTime)}`}
                </span>
              </motion.div>
            </div>

            {/* ─── Control Bar ─── */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderTop: "1px solid var(--hairline)",
                backgroundColor: "rgba(255,255,255,0.01)",
              }}
            >
              {/* Left: Play/Pause + Timer */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(212,168,87,0.12)",
                    color: "var(--gold)",
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.88 }}
                  aria-label={isPlaying ? "Pause recording" : "Play recording"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </motion.button>
                <motion.span
                  className="text-xs font-mono tracking-wider"
                  style={{ color: "var(--muted)" }}
                  key={recordingTime}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {formatTime(recordingTime)}
                </motion.span>
              </div>

              {/* Right: Before / After toggle */}
              <div
                className="flex items-center gap-1 rounded-full p-0.5"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                {(["before", "after"] as const).map((mode) => {
                  const label = mode === "before" ? "Raw" : "Processed";
                  const active = beforeAfter === mode;
                  return (
                    <motion.button
                      key={mode}
                      onClick={() => setBeforeAfter(mode)}
                      className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: active ? "var(--gold)" : "transparent",
                        color: active ? "var(--ink)" : "var(--muted)",
                      }}
                      whileTap={{ scale: 0.94 }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
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
              {i < 3 && (
                <div className="hidden md:block w-px h-8" style={{ backgroundColor: "var(--hairline)" }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
