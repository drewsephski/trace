"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { easeOut } from "./constants";

export default function FinishingTools() {
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
  );
}
