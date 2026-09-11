/* MarketHub brand mark — a stylized storefront/shopping bag with a hub spark,
   drawn as inline SVG so it inherits kit tokens (text-on-brand) and scales
   crisply. The gradient badge shell (.mh-logo-mark) is defined in index.css
   from kit color tokens so the team can restyle it via CSS. */
export function LogoMark({ size = 36, spark = true }: { size?: number; spark?: boolean }) {
  const inner = Math.round(size * 0.58)
  return (
    <span
      className="mh-logo-mark inline-flex shrink-0 items-center justify-center rounded-corner-md text-on-brand"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={inner} height={inner} viewBox="0 0 24 24" fill="none">
        {/* awning / storefront roof */}
        <path
          d="M4 7.5 5.6 4.4A1.6 1.6 0 0 1 7 3.6h10a1.6 1.6 0 0 1 1.4.8L20 7.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* bag / shop body */}
        <path
          d="M5.4 7.5h13.2l-.9 11.1a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5.4 7.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        {/* handle arc */}
        <path d="M9 10.2a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        {/* hub spark */}
        {spark && <circle className="mh-logo-spark" cx="12" cy="15.4" r="1.5" fill="currentColor" />}
      </svg>
    </span>
  )
}

export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`flex items-center gap-md ${className}`}>
      <LogoMark size={size} />
      <span className="text-heading font-semibold text-text-primary">
        Market<span className="text-brand-primary">Hub</span>
      </span>
    </span>
  )
}
