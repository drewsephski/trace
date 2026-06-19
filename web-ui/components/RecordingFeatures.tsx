"use client";

import { motion } from "motion/react";
import { Monitor, Mic, Camera, Shield } from "lucide-react";
import { easeOut } from "./constants";

export default function RecordingFeatures() {
  return (
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
  );
}
