"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[var(--color-brand-cyan)]";

  const styles =
    variant === "primary"
      ? "text-white bg-[var(--color-brand-blue-bright)] hover:bg-[var(--color-brand-blue)] shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_8px_30px_-8px_rgba(59,130,246,0.6)] hover:shadow-[0_0_0_1px_rgba(59,130,246,0.6),0_12px_40px_-8px_rgba(59,130,246,0.8)]"
      : "text-[var(--color-ink)] glass hover:border-[var(--color-border-glow)] hover:bg-white/5";

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    </motion.div>
  );
}
