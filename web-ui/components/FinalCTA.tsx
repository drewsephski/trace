"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { easeOut, GITHUB_REPO } from "./constants";
import { getPrimaryCtaHref } from "./site-links";

export default function FinalCTA() {
  const { user } = useAuth();
  const primaryHref = getPrimaryCtaHref(!!user);

  return (
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
              href={primaryHref}
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
  );
}
