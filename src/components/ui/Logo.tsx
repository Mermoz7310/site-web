export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid place-items-center h-8 w-8 rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] overflow-hidden">
        {/* Woven-thread mark: a discrete nod to Senegalese weaving */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none">
          <path d="M4 8 L20 8" stroke="url(#g)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4 12 L20 12" stroke="url(#g)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          <path d="M4 16 L20 16" stroke="url(#g)" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
          <path d="M8 4 L8 20" stroke="url(#g)" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
          <path d="M16 4 L16 20" stroke="url(#g)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
          <defs>
            <linearGradient id="g" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.5" stopColor="#22D3EE" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--color-ink)]">
        221<span className="text-[var(--color-brand-cyan)]">Bel</span>Code
      </span>
    </span>
  );
}
