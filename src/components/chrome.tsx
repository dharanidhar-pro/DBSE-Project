import { ShoppingCart, Store, LayoutDashboard, ShieldCheck } from "lucide-react"
import { Toast } from "@figma/astraui"
import { useStore, type Role } from "../lib/store"
import { CATEGORIES } from "../lib/data"

// Global toast stack — renders kit Toast components fixed to the corner.
export function Toaster() {
  const { toasts, dismissToast } = useStore()
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-2xl right-2xl z-[9998] flex flex-col gap-md">
      {toasts.map((t) => (
        <div key={t.id} className="mh-rise w-80">
          <Toast
            message={t.message}
            variant={t.variant}
            progress={t.variant === "success" ? 100 : 0}
            showCancel={false}
            onDismiss={() => dismissToast(t.id)}
          />
        </div>
      ))}
    </div>
  )
}

// Floating role switcher so the marketplace's three apps (customer storefront,
// vendor dashboard, admin console) are all reachable in the demo.
export function RoleSwitcher() {
  const { role, setRole } = useStore()
  const roles: { id: Role; label: string; icon: typeof Store }[] = [
    { id: "customer", label: "Shop", icon: ShoppingCart },
    { id: "vendor", label: "Vendor", icon: Store },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ]
  return (
    <div className="fixed bottom-2xl left-2xl z-[9997] mh-glass-strong mh-spatial flex items-center gap-xs rounded-corner-full p-xs">
      {roles.map((r) => {
        const Icon = r.icon
        const active = role === r.id
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-xs rounded-corner-full px-lg py-md text-label-sm font-medium transition-colors ${
              active ? "bg-brand-primary text-on-brand" : "text-text-secondary hover:bg-bg-hover"
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Footer() {
  const { go } = useStore()
  return (
    <footer className="mt-2xl border-t border-border-secondary bg-surface-bg">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2xl px-xl py-2xl md:grid-cols-4 lg:px-2xl">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-md">
            <span className="flex size-9 items-center justify-center rounded-corner-md bg-brand-primary text-on-brand mh-skeuo">
              <ShoppingCart size={18} />
            </span>
            <span className="text-heading font-semibold text-text-primary">MarketHub</span>
          </div>
          <p className="text-label-sm text-text-secondary mt-lg max-w-xs">
            Everything you need, from trusted local sellers across India — in one marketplace.
          </p>
        </div>
        <FooterCol
          title="Shop"
          links={CATEGORIES.slice(0, 5).map((c) => ({ label: c, onClick: () => go("category", { name: c }) }))}
        />
        <FooterCol
          title="Account"
          links={[
            { label: "My Orders", onClick: () => go("orders") },
            { label: "Profile", onClick: () => go("profile") },
            { label: "Cart", onClick: () => go("cart") },
            { label: "Sign in", onClick: () => go("login") },
          ]}
        />
        <FooterCol
          title="Sell"
          links={[
            { label: "Become a Seller", onClick: () => go("register") },
            { label: "Vendor Dashboard", onClick: () => go("v-dashboard") },
          ]}
        />
      </div>
      <div className="border-t border-border-secondary">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-md px-xl py-lg text-video-title text-text-tertiary md:flex-row lg:px-2xl">
          <span>© 2025 MarketHub Technologies Pvt. Ltd. All prices in INR (₹).</span>
          <span className="flex items-center gap-md">
            <LayoutDashboard size={13} /> A B.Tech DBMS project · Flask · MySQL
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; onClick: () => void }[] }) {
  return (
    <div>
      <h4 className="text-label-sm font-semibold text-text-primary">{title}</h4>
      <ul className="mt-lg flex flex-col gap-md">
        {links.map((l) => (
          <li key={l.label}>
            <button onClick={l.onClick} className="text-label-sm text-text-secondary hover:text-brand-primary transition-colors">
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
