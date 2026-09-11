import type { ReactNode } from "react"
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Receipt,
  Settings,
  Store,
  User,
  Users,
} from "lucide-react"
import { SecondaryNav, SecondaryNavItem, SidebarButton, SidebarNavigation } from "@figma/astraui"
import { useStore } from "../lib/store"
import { BackButton } from "./common"
import { LogoMark } from "./Logo"

type Section = { view: string; label: string; icon: LucideIcon }

const VENDOR_SECTIONS: Section[] = [
  { view: "v-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "v-products", label: "Products", icon: Package },
  { view: "v-inventory", label: "Inventory", icon: Boxes },
  { view: "v-orders", label: "Orders", icon: Receipt },
  { view: "v-profile", label: "Profile", icon: User },
  { view: "v-settings", label: "Settings", icon: Settings },
]

const ADMIN_SECTIONS: Section[] = [
  { view: "a-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "a-vendors", label: "Vendors", icon: Store },
  { view: "a-customers", label: "Customers", icon: Users },
  { view: "a-products", label: "Products", icon: Package },
  { view: "a-orders", label: "Orders", icon: Receipt },
  { view: "a-reports", label: "Reports", icon: BarChart3 },
  { view: "a-profile", label: "Profile", icon: User },
  { view: "a-settings", label: "Settings", icon: Settings },
]

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { role, nav, go, logout, admin } = useStore()
  const sections = role === "vendor" ? VENDOR_SECTIONS : ADMIN_SECTIONS
  const title = role === "vendor" ? "Seller Center" : "Admin Console"
  const homeView = role === "vendor" ? "v-dashboard" : "a-dashboard"
  const profileView = role === "vendor" ? "v-profile" : "a-profile"
  const settingsView = role === "vendor" ? "v-settings" : "a-settings"

  return (
    <div className="mh-aurora flex h-screen overflow-hidden">
      {/* Minimal side rail: only the MarketHub logo remains to return to the home dashboard. */}
      <SidebarNavigation>
        <SidebarButton icon={<LogoMark size={30} spark={false} />} active={nav.view === homeView} onClick={() => logout()} />
      </SidebarNavigation>

      {/* Section-level navigation. */}
      <SecondaryNav title={title}>
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <SecondaryNavItem
              key={s.view}
              icon={<Icon className="size-full" strokeWidth={1.5} />}
              label={s.label}
              active={nav.view === s.view}
              onClick={() => go(s.view)}
            />
          )
        })}
      </SecondaryNav>

      <main className="mh-scroll flex-1 overflow-y-auto bg-brand-tertiary p-2xl">
        <div className="mx-auto max-w-300">
          <div className="mb-xl flex items-center justify-end gap-md">
            <button
              type="button"
              onClick={() => go(profileView)}
              className={`rounded-corner-full border px-lg py-md text-label-sm font-medium transition-colors ${
                nav.view === profileView
                  ? "border-brand-primary bg-brand-primary text-on-brand"
                  : "border-border-secondary bg-surface-bg text-text-primary hover:bg-bg-hover"
              }`}
            >
              {role === "vendor" ? "Store profile" : "Profile"}
            </button>
            <button
              type="button"
              onClick={() => go(settingsView)}
              className={`rounded-corner-full border px-lg py-md text-label-sm font-medium transition-colors ${
                nav.view === settingsView
                  ? "border-brand-primary bg-brand-primary text-on-brand"
                  : "border-border-secondary bg-surface-bg text-text-primary hover:bg-bg-hover"
              }`}
            >
              Settings
            </button>
          </div>
          {nav.view === "v-order" && (
            <div className="mb-lg">
              <BackButton fallback="v-orders" label="Back to orders" />
            </div>
          )}
          {children}
        </div>
        <p className="mt-2xl text-center text-video-title text-text-tertiary">
          Signed in as {role === "vendor" ? "Nexa Electronics" : admin.name} · MarketHub {title}
        </p>
      </main>
    </div>
  )
}

// Reusable dashboard stat tile — kit tokens, spatial elevation.
export function StatTile({
  icon: Icon,
  label,
  value,
  trend,
  tone = "brand",
}: {
  icon: LucideIcon
  label: string
  value: string
  trend?: string
  tone?: "brand" | "success" | "warning" | "danger"
}) {
  const toneClass =
    tone === "success"
      ? "bg-success text-on-brand"
      : tone === "warning"
        ? "bg-warning text-on-brand"
        : tone === "danger"
          ? "bg-danger text-on-brand"
          : "bg-brand-tertiary text-brand-primary"
  return (
    <div className="mh-lift rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
      <div className="flex items-center justify-between">
        <span className={`flex size-10 items-center justify-center rounded-corner-md ${toneClass}`}>
          <Icon size={18} />
        </span>
        {trend && <span className="text-video-title text-success">{trend}</span>}
      </div>
      <div className="text-title font-semibold text-text-primary mt-lg">{value}</div>
      <div className="text-label-sm text-text-secondary mt-xs">{label}</div>
    </div>
  )
}
