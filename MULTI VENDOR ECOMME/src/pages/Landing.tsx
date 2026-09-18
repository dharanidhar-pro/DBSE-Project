import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  LogIn,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserPlus,
  Zap,
} from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import { useStore } from "../lib/store"
import { Logo } from "../components/Logo"
import { productImage } from "../lib/images"

/* Public preview / landing page — the first thing visitors see. Explains what
   MarketHub is and what each role can do, with Login / Register at top-right.
   Storefront chrome is intentionally not used here (no cart/account yet). */
export default function Landing() {
  const { go, products, vendors } = useStore()
  const approved = vendors.filter((v) => v.status === "approved")
  const showcase = products.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Top bar with Login / Register */}
      <header className="sticky top-0 z-50 mh-landing-header">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-xl lg:px-2xl">
          <Logo size={38} />
          <div className="flex items-center gap-md">
            <Button variant="subtle" iconStart={<LogIn size={16} />} onClick={() => go("login")}>
              Login
            </Button>
            <Button variant="subtle" iconStart={<Store size={16} />} onClick={() => go("vendor-login")}>
              Vendor login
            </Button>
            <Button variant="primary" iconStart={<UserPlus size={16} />} onClick={() => go("register")}>
              Register
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-360 px-xl py-2xl lg:px-2xl">
        {/* Hero / what it is */}
        <section className="mh-landing-shell mh-spatial mh-rise relative overflow-hidden rounded-corner-lg">
          <div className="grid items-center gap-2xl p-2xl md:grid-cols-2">
            <div className="flex flex-col gap-lg">
              <Badge label="Multi-vendor marketplace · India" variant="brand" />
              <h1 className="text-title text-text-primary md:text-[34px] md:leading-[1.12]">
                One marketplace. Many trusted sellers. Everything delivered to your door.
              </h1>
              <p className="text-label text-text-secondary max-w-lg">
                MarketHub connects customers with independent sellers across India. Browse products from many vendors in
                one place, order securely, and track delivery — while sellers manage their store and admins keep the
                marketplace running.
              </p>
              <div className="flex flex-wrap gap-md pt-xs">
                <Button variant="primary" iconEnd={<ArrowRight size={16} />} onClick={() => go("register")}>
                  Get started — it's free
                </Button>
                <Button variant="neutral" iconStart={<LogIn size={16} />} onClick={() => go("login")}>
                  Sign in
                </Button>
              </div>
              <div className="flex flex-wrap gap-2xl pt-lg">
                {[
                  { k: `${products.length}+`, v: "Products" },
                  { k: `${approved.length}`, v: "Verified sellers" },
                  { k: "7", v: "Categories" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="text-heading font-semibold text-text-primary">{s.k}</div>
                    <div className="text-video-title text-text-tertiary">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="grid grid-cols-3 gap-md">
                {showcase.map((p, i) => (
                  <div
                    key={p.product_id}
                    className={`mh-lift overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg ${
                      i % 2 ? "translate-y-lg" : ""
                    }`}
                  >
                    <img
                      src={productImage(p.product_id, p.category)}
                      alt={p.name}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="mt-2xl">
          <div className="mb-xl text-center">
            <h2 className="text-heading text-text-primary">Everything a marketplace needs</h2>
            <p className="text-label-sm text-text-secondary mt-xs">From discovery to doorstep, and the tools to run it all.</p>
          </div>
          <div className="grid grid-cols-1 gap-xl md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShoppingBag, title: "Shop many vendors", body: "Discover products across electronics, audio, home, fitness and more — all in one cart." },
              { icon: BadgeCheck, title: "Verified sellers", body: "Every vendor is reviewed and approved by an admin before they can list." },
              { icon: Truck, title: "Tracked delivery", body: "Follow each order from confirmation to delivery with live status." },
              { icon: Zap, title: "Genuine deals", body: "Transparent MRP and seller pricing — real discounts, no inflation." },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="mh-landing-card mh-spatial mh-lift rounded-corner-lg p-xl">
                  <span className="mh-landing-icon flex size-11 items-center justify-center rounded-corner-full">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-label font-semibold text-text-primary mt-lg">{f.title}</h3>
                  <p className="text-label-sm text-text-secondary mt-xs">{f.body}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Built for every role */}
        <section className="mt-2xl">
          <div className="mb-xl text-center">
            <h2 className="text-heading text-text-primary">Built for everyone in the marketplace</h2>
            <p className="text-label-sm text-text-secondary mt-xs">Sign in as a customer, a seller, or the marketplace admin.</p>
          </div>
          <div className="grid grid-cols-1 gap-xl md:grid-cols-3">
            {[
              {
                icon: ShoppingBag,
                title: "Customers",
                body: "Browse and search products, add to cart, check out securely, and track every order to your doorstep.",
                points: ["Unified multi-vendor cart", "Order tracking & history", "Ratings and genuine deals"],
              },
              {
                icon: Store,
                title: "Vendors",
                body: "Run your storefront — add products, keep inventory in stock, and fulfil customer orders on time.",
                points: ["Product & inventory management", "Order fulfilment flow", "Sales dashboard"],
              },
              {
                icon: ShieldCheck,
                title: "Admin",
                body: "Oversee the entire marketplace — approve sellers, monitor products, orders and customers, and view reports.",
                points: ["Approve / reject vendors", "Manage products & orders", "Marketplace-wide reports"],
              },
            ].map((r) => {
              const Icon = r.icon
              return (
                <div key={r.title} className="mh-landing-card mh-spatial flex flex-col rounded-corner-lg p-xl">
                  <span className="flex size-11 items-center justify-center rounded-corner-md bg-brand-primary text-on-brand mh-skeuo">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-label font-semibold text-text-primary mt-lg">{r.title}</h3>
                  <p className="text-label-sm text-text-secondary mt-xs">{r.body}</p>
                  <ul className="mt-lg flex flex-col gap-md">
                    {r.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-md text-label-sm text-text-secondary">
                        <BadgeCheck size={16} className="text-brand-primary shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-2xl">
          <div className="mb-xl text-center">
            <h2 className="text-heading text-text-primary">How MarketHub works</h2>
          </div>
          <div className="grid grid-cols-1 gap-xl md:grid-cols-4">
            {[
              { icon: UserPlus, step: "01", title: "Create an account", body: "Register as a customer or apply to sell." },
              { icon: Package, step: "02", title: "Discover products", body: "Browse trusted sellers across categories." },
              { icon: ShoppingBag, step: "03", title: "Order securely", body: "Checkout with UPI, cards, net banking or COD." },
              { icon: Boxes, step: "04", title: "Track to your door", body: "Follow live status until it's delivered." },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.step} className="mh-landing-step rounded-corner-lg p-xl mh-spatial">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-corner-full bg-brand-tertiary text-brand-primary">
                      <Icon size={20} />
                    </span>
                    <span className="text-heading font-semibold text-border-primary">{s.step}</span>
                  </div>
                  <h3 className="text-label font-semibold text-text-primary mt-lg">{s.title}</h3>
                  <p className="text-label-sm text-text-secondary mt-xs">{s.body}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-2xl">
          <div className="mh-glass mh-spatial flex flex-col items-center gap-lg rounded-corner-lg p-2xl text-center">
            <Logo size={44} />
            <h2 className="text-heading text-text-primary max-w-xl">Ready to explore the marketplace?</h2>
            <p className="text-label-sm text-text-secondary max-w-md">
              Join thousands of shoppers and sellers on MarketHub. Sign in to continue, or create a free account.
            </p>
            <div className="flex flex-wrap justify-center gap-md pt-xs">
              <Button variant="primary" iconStart={<UserPlus size={16} />} onClick={() => go("register")}>
                Create account
              </Button>
              <Button variant="neutral" iconStart={<LogIn size={16} />} onClick={() => go("login")}>
                Login
              </Button>
              <Button variant="subtle" iconStart={<Store size={16} />} onClick={() => go("vendor-login")}>
                Vendor login
              </Button>
            </div>
          </div>
        </section>

        <p className="mt-2xl text-center text-video-title text-text-tertiary">
          MarketHub · Multi-vendor e-commerce marketplace · © 2026
        </p>
      </main>
    </div>
  )
}
