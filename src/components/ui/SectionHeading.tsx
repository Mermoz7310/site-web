"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({ eyebrow, title, description, align = "center" }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`max-w-2xl ${alignClass}`}
    >
      <div className={`flex items-center gap-3 mb-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 thread-gradient" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-brand-cyan)]">
          {eyebrow}
        </span>
        <span className="h-px w-8 thread-gradient" aria-hidden />
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-ink)] text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-[var(--color-ink-muted)] leading-relaxed text-pretty">
          {description}
        </p>
      )}
    </motion.div>
  );
}
