import { LogoMark } from "./Logo"

/* First-paint branded loader. Rendered on refresh while the app boots, then
   fades out. Uses kit tokens + the mh-boot-* animations from index.css. */
export default function BootSplash({ fading }: { fading: boolean }) {
  return (
    <div
      className="mh-boot mh-aurora fixed inset-0 z-[999] flex flex-col items-center justify-center"
      data-fading={fading}
      role="status"
      aria-live="polite"
      aria-label="Loading MarketHub"
    >
      <div className="relative flex items-center justify-center">
        <span className="mh-boot-halo absolute size-40 rounded-corner-full" aria-hidden="true" />
        <div className="mh-boot-logo relative">
          <LogoMark size={76} />
        </div>
      </div>

      <div className="mt-2xl text-heading font-semibold text-text-primary">
        Market<span className="text-brand-primary">Hub</span>
      </div>
      <p className="text-video-title text-text-tertiary mt-xs">Multi-vendor marketplace</p>

      <div className="mt-xl h-1 w-44 overflow-hidden rounded-corner-full bg-bg-faint">
        <div className="mh-boot-bar h-full rounded-corner-full bg-brand-primary" />
      </div>
    </div>
  )
}
