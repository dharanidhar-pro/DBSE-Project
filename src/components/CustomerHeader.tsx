import { useState } from "react"
import { LogIn, Menu, Search, ShoppingCart, User, UserPlus, X } from "lucide-react"
import { Avatar, Button, IconButton } from "@figma/astraui"
import { useStore } from "../lib/store"
import { LogoMark } from "./Logo"

const NAV: { label: string; view: string; blurb: string }[] = [
  { label: "Home", view: "home", blurb: "Trusted local sellers" },
  { label: "Shop", view: "shop", blurb: "Browse every product" },
  { label: "Categories", view: "category", blurb: "Find your aisle" },
  { label: "Orders", view: "orders", blurb: "Track your parcels" },
]

/* Customer storefront header. The brief mandates a top customer navbar
   (Home / Shop / Categories / Orders / Search / Cart / Account) rather than
   the kit's 60px SidebarNavigation, which is reserved here for the vendor and
   admin dashboards. The nav items use the requested "flowing menu" reveal. */
export default function CustomerHeader() {
  const { nav, go, cartCount, customer, loggedIn, avatars } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 mh-glass-strong border-b border-border-secondary">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-xl px-xl lg:px-2xl">
        <button onClick={() => go("home")} className="flex items-center gap-md" aria-label="MarketHub home">
          <LogoMark size={38} />
          <span className="text-heading font-semibold text-text-primary">
            Market<span className="text-brand-primary">Hub</span>
          </span>
        </button>

        {/* Flowing menu */}
        <nav className="ml-lg hidden items-center gap-xs lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              data-active={nav.view === item.view}
              className="mh-flow-item flex h-10 items-center rounded-corner-full px-lg"
            >
              <span className="mh-flow-fill" aria-hidden="true" />
              <span className="mh-flow-label text-label-sm font-medium text-text-primary">{item.label}</span>
              <span className="mh-flow-marquee px-lg text-label-sm font-medium" aria-hidden="true">
                <span>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="mr-2xl">
                      {item.blurb}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-md">
          <button
            onClick={() => go("search")}
            className="hidden h-10 items-center gap-md rounded-corner-full border border-border-primary bg-input-bg px-lg text-label-sm text-text-tertiary transition-colors hover:border-border-selected md:flex"
          >
            <Search size={16} />
            <span>Search products…</span>
          </button>

          <span className="relative inline-flex">
            <IconButton icon={<ShoppingCart size={18} />} variant="neutral" aria-label="Cart" onClick={() => go("cart")} />
            {cartCount > 0 && (
              <span className="pointer-events-none absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-corner-full bg-brand-primary text-on-brand text-[11px] font-semibold">
                {cartCount}
              </span>
            )}
          </span>

          {loggedIn ? (
            <button onClick={() => go("profile")} className="hidden md:block" aria-label="Account">
              {avatars.customer ? (
                <img
                  src={avatars.customer}
                  alt="Account"
                  className="size-9 rounded-corner-full border border-border-secondary object-cover"
                />
              ) : (
                <Avatar type="initial" initials={customer.name.slice(0, 2)} size="medium" shape="circle" />
              )}
            </button>
          ) : (
            <div className="hidden items-center gap-md md:flex">
              <Button variant="subtle" iconStart={<LogIn size={16} />} onClick={() => go("login")}>
                Login
              </Button>
              <Button variant="primary" iconStart={<UserPlus size={16} />} onClick={() => go("register")}>
                Register
              </Button>
            </div>
          )}

          <div className="lg:hidden">
            <IconButton
              icon={mobileOpen ? <X size={18} /> : <Menu size={18} />}
              variant="subtle"
              onClick={() => setMobileOpen((o) => !o)}
            />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mh-glass-strong border-t border-border-secondary px-xl py-lg lg:hidden">
          <div className="flex flex-col gap-xs">
            {NAV.map((item) => (
              <Button
                key={item.view}
                variant={nav.view === item.view ? "primary" : "subtle"}
                onClick={() => {
                  go(item.view)
                  setMobileOpen(false)
                }}
              >
                {item.label}
              </Button>
            ))}
            {loggedIn ? (
              <Button
                variant="subtle"
                iconStart={<User size={16} />}
                onClick={() => {
                  go("profile")
                  setMobileOpen(false)
                }}
              >
                Account
              </Button>
            ) : (
              <>
                <Button
                  variant="subtle"
                  iconStart={<LogIn size={16} />}
                  onClick={() => {
                    go("login")
                    setMobileOpen(false)
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  iconStart={<UserPlus size={16} />}
                  onClick={() => {
                    go("register")
                    setMobileOpen(false)
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
