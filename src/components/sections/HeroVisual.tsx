"use client";

import { motion } from "framer-motion";

/**
 * Signature hero visual: a "build console" — a live product panel that
 * communicates software delivery. The woven thread lines running through it
 * are the discrete African identity motif, kept abstract and geometric.
 */
export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Ambient glow behind panel */}
      <div
        className="absolute -inset-8 rounded-[2rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(59,130,246,0.35), transparent 70%), radial-gradient(50% 50% at 70% 80%, rgba(34,211,238,0.25), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative glass rounded-[1.5rem] p-1 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
          <span className="h-3 w-3 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-[var(--color-ink-faint)] font-mono">
            221belcode · deploy
          </span>
        </div>

        {/* Woven network canvas */}
        <div className="relative rounded-[1.1rem] bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] overflow-hidden">
          <svg viewBox="0 0 400 240" className="w-full" aria-hidden>
            <defs>
              <linearGradient id="thread" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="0.5" stopColor="#22D3EE" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {/* Horizontal woven threads */}
            {[60, 100, 140, 180].map((y, i) => (
              <motion.line
                key={`h-${y}`}
                x1="20" y1={y} x2="380" y2={y}
                stroke="url(#thread)" strokeWidth="1"
                strokeOpacity={0.25 + i * 0.08}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.4 + i * 0.15, ease: "easeOut" }}
              />
            ))}

            {/* Nodes on the weave */}
            {[
              { x: 90, y: 60 }, { x: 200, y: 100 }, { x: 310, y: 140 },
              { x: 140, y: 180 }, { x: 260, y: 60 }, { x: 90, y: 140 },
            ].map((n, i) => (
              <motion.g key={`n-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.12 }}
              >
                <circle cx={n.x} cy={n.y} r="9" fill="#3B82F6" fillOpacity="0.12" />
                <circle cx={n.x} cy={n.y} r="3.5" fill="url(#thread)" />
              </motion.g>
            ))}

            {/* Connecting diagonals */}
            <motion.path
              d="M90 60 L200 100 L310 140 M200 100 L140 180 M260 60 L200 100 M90 140 L200 100"
              stroke="url(#thread)" strokeWidth="1" fill="none" strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 1.2, ease: "easeInOut" }}
            />

            {/* Traveling pulse along a thread */}
            <motion.circle
              r="3" fill="#22D3EE"
              animate={{
                cx: [20, 380],
                cy: [100, 100],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
            />
          </svg>

          {/* Deploy log strip */}
          <div className="border-t border-[var(--color-border-subtle)] px-4 py-3 font-mono text-[11px] space-y-1.5">
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
              className="text-[var(--color-ink-faint)]"
            >
              <span className="text-[var(--color-brand-cyan)]">›</span> build · compiling modules
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.1 }}
              className="text-[var(--color-ink-muted)]"
            >
              <span className="text-green-400">✓</span> tests passed · 128/128
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.6 }}
              className="text-[var(--color-ink)]"
            >
              <span className="text-green-400">✓</span> deployed to production
            </motion.p>
          </div>
        </div>
      </div>

      {/* Floating metric chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="absolute -right-4 top-16 glass rounded-xl px-3 py-2 shadow-lg hidden sm:block"
      >
        <p className="text-[10px] text-[var(--color-ink-faint)]">Lighthouse</p>
        <p className="text-lg font-bold text-[var(--color-brand-cyan)] font-[family-name:var(--font-display)]">98</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="absolute -left-4 bottom-20 glass rounded-xl px-3 py-2 shadow-lg hidden sm:block"
      >
        <p className="text-[10px] text-[var(--color-ink-faint)]">Uptime</p>
        <p className="text-lg font-bold text-[var(--color-brand-blue)] font-[family-name:var(--font-display)]">99.9%</p>
      </motion.div>
    </motion.div>
  );
}
