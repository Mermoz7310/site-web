"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/site";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const current = testimonials[index];

  return (
    <section className="relative section-pad bg-[var(--color-surface)]/40">
      <div className="absolute top-0 inset-x-0 h-px thread-gradient opacity-30" aria-hidden />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Témoignages"
          title="Ils nous ont fait confiance"
        />

        <div className="mt-12 relative">
          <div className="glass rounded-[var(--radius-card)] p-8 md:p-12 min-h-[240px] flex flex-col justify-center">
            <Quote size={32} className="text-[var(--color-brand-blue)]/40 mb-4" />
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-lg md:text-xl text-[var(--color-ink)] leading-relaxed text-pretty">
                  {current.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-cyan)] text-sm font-bold text-white">
                    {current.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{current.author}</p>
                    <p className="text-xs text-[var(--color-ink-faint)]">
                      {current.role} · {current.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Témoignage ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-[var(--color-brand-cyan)]" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Témoignage précédent"
                className="grid place-items-center h-9 w-9 rounded-full glass hover:border-[var(--color-border-glow)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Témoignage suivant"
                className="grid place-items-center h-9 w-9 rounded-full glass hover:border-[var(--color-border-glow)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
