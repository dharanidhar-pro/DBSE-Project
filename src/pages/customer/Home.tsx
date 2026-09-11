import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  Laptop,
  Shirt,
  ShoppingBag,
  Store,
  Truck,
  Watch,
  Zap,
} from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { CATEGORIES } from "../../lib/data"
import { productImage } from "../../lib/images"
import { formatINR } from "../../lib/format"
import { ProductCard, SectionHeader } from "../../components/common"

const CATEGORY_ICONS: Record<string, typeof Laptop> = {
  Electronics: Laptop,
  Audio: Headphones,
  Footwear: Shirt,
  Accessories: ShoppingBag,
  Wearables: Watch,
  "Home & Kitchen": Store,
  Fitness: Zap,
}

export default function Home() {
  const { products, go, vendors, addToCart } = useStore()
  const popular = products.filter((p) => p.tags.includes("popular")).slice(0, 4)
  const arrivals = products.filter((p) => p.tags.includes("new")).slice(0, 4)
  const deals = products.filter((p) => p.tags.includes("deal")).slice(0, 3)
  const approvedVendors = vendors.filter((v) => v.status === "approved")

  return (
    <div className="mx-auto max-w-[1440px] px-xl py-2xl lg:px-2xl">
      {/* Hero — deliberately compact, spatial glass panel */}
      <section className="mh-glass mh-spatial mh-rise relative overflow-hidden rounded-corner-lg">
        <div className="grid items-center gap-2xl p-2xl md:grid-cols-2 md:p-2xl">
          <div className="flex flex-col gap-lg">
            <Badge label="Multi-vendor marketplace" variant="brand" />
            <h1 className="text-title text-text-primary md:text-[32px] md:leading-[1.15]">
              Everything you need. From trusted local sellers.
            </h1>
            <p className="text-label text-text-secondary max-w-md">
              Discover products from multiple vendors in one marketplace — electronics, audio, home, fitness and more,
              delivered across India.
            </p>
            <div className="flex flex-wrap gap-md pt-xs">
              <Button variant="primary" iconEnd={<ArrowRight size={16} />} onClick={() => go("shop")}>
                Shop Products
              </Button>
              <Button variant="neutral" iconStart={<Store size={16} />} onClick={() => go("register")}>
                Become a Seller
              </Button>
            </div>
            <div className="flex flex-wrap gap-2xl pt-lg">
              {[
                { k: `${products.length}+`, v: "Products" },
                { k: `${approvedVendors.length}`, v: "Verified sellers" },
                { k: "24/7", v: "Support" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-heading font-semibold text-text-primary">{s.k}</div>
                  <div className="text-video-title text-text-tertiary">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-lg">
              {products.slice(0, 4).map((p, i) => (
                <button
                  key={p.product_id}
                  onClick={() => go("product", { id: p.product_id })}
                  className={`mh-lift overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg ${
                    i % 2 ? "translate-y-lg" : ""
                  }`}
                >
                  <img
                    src={productImage(p.product_id, p.category)}
                    alt={p.name}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="mt-2xl">
        <SectionHeader title="Shop by category" subtitle="Jump straight to the aisle you need" />
        <div className="grid grid-cols-2 gap-lg sm:grid-cols-3 lg:grid-cols-8">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? ShoppingBag
            return (
              <button
                key={cat}
                onClick={() => go("category", { name: cat })}
                className="mh-lift mh-skeuo flex flex-col items-center gap-md rounded-corner-lg border border-border-secondary p-lg text-center"
              >
                <span className="flex size-11 items-center justify-center rounded-corner-full bg-brand-tertiary text-brand-primary">
                  <Icon size={20} />
                </span>
                <span className="text-label-sm font-medium text-text-primary">{cat}</span>
              </button>
            )
          })}
          <button
            onClick={() => go("shop")}
            className="mh-lift mh-skeuo flex flex-col items-center gap-md rounded-corner-lg border border-border-secondary p-lg text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-corner-full bg-brand-primary text-on-brand">
              <ShoppingBag size={20} />
            </span>
            <span className="text-label-sm font-medium text-text-primary">All Products</span>
          </button>
        </div>
      </section>

      {/* Popular products */}
      <section className="mt-2xl">
        <SectionHeader
          title="Popular right now"
          subtitle="Best-selling products across MarketHub"
          action={
            <Button variant="subtle" iconEnd={<ArrowRight size={16} />} onClick={() => go("shop")}>
              View all
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
      </section>

      {/* Deals band */}
      <section className="mt-2xl">
        <div className="mh-glass mh-spatial overflow-hidden rounded-corner-lg p-2xl">
          <div className="mb-xl flex items-center gap-md">
            <span className="flex size-9 items-center justify-center rounded-corner-full bg-danger text-on-brand">
              <Zap size={18} />
            </span>
            <div>
              <h2 className="text-heading text-text-primary">Deals of the week</h2>
              <p className="text-video-title text-text-secondary">Limited-time prices from our sellers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-xl md:grid-cols-3">
            {deals.map((p) => {
              const off = Math.round(((p.mrp - p.price) / p.mrp) * 100)
              return (
                <div
                  key={p.product_id}
                  className="mh-lift flex gap-lg rounded-corner-lg border border-border-secondary bg-surface-bg p-lg"
                >
                  <button
                    onClick={() => go("product", { id: p.product_id })}
                    className="size-24 shrink-0 overflow-hidden rounded-corner-md bg-bg-faint"
                  >
                    <img src={productImage(p.product_id, p.category)} alt={p.name} className="size-full object-cover" />
                  </button>
                  <div className="flex flex-1 flex-col">
                    <Badge label={`${off}% off`} variant="danger" />
                    <h3 className="text-label-sm font-medium text-text-primary mt-md line-clamp-2">{p.name}</h3>
                    <div className="mt-auto flex items-center justify-between pt-md">
                      <span className="text-label font-semibold text-text-primary">{formatINR(p.price)}</span>
                      <Button variant="neutral" size="small" onClick={() => addToCart(p.product_id)}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mt-2xl">
        <SectionHeader
          title="New arrivals"
          subtitle="Fresh from our sellers this month"
          action={
            <Button variant="subtle" iconEnd={<ArrowRight size={16} />} onClick={() => go("shop")}>
              View all
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
      </section>

      {/* Why shop */}
      <section className="mt-2xl">
        <SectionHeader title="Why shop with MarketHub" />
        <div className="grid grid-cols-1 gap-xl md:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "Verified sellers", body: "Every vendor is reviewed and approved before they can list products." },
            { icon: Truck, title: "Fast, tracked delivery", body: "Real-time order tracking from confirmation to your doorstep." },
            { icon: Zap, title: "Genuine deals", body: "Transparent MRP and seller pricing — no inflated discounts." },
          ].map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="mh-glass mh-spatial rounded-corner-lg p-xl">
                <span className="flex size-11 items-center justify-center rounded-corner-full bg-brand-tertiary text-brand-primary">
                  <Icon size={20} />
                </span>
                <h3 className="text-label font-semibold text-text-primary mt-lg">{f.title}</h3>
                <p className="text-label-sm text-text-secondary mt-xs">{f.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Vendor marketplace */}
      <section className="mt-2xl">
        <SectionHeader
          title="Meet our sellers"
          subtitle="Independent businesses building on MarketHub"
          action={
            <Button variant="primary" iconStart={<Store size={16} />} onClick={() => go("register")}>
              Become a Seller
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 lg:grid-cols-4">
          {approvedVendors.map((v) => (
            <button
              key={v.vendor_id}
              onClick={() => go("shop", { vendor: v.vendor_id })}
              className="mh-lift mh-glass mh-spatial flex flex-col gap-md rounded-corner-lg p-xl text-left"
            >
              <div className="flex items-center gap-md">
                <span className="flex size-11 items-center justify-center rounded-corner-md bg-brand-primary text-on-brand mh-skeuo text-label font-semibold">
                  {v.business_name.slice(0, 2)}
                </span>
                <div>
                  <div className="text-label-sm font-semibold text-text-primary">{v.business_name}</div>
                  <div className="text-video-title text-text-tertiary">{v.address.split(",").slice(-2).join(",").trim()}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge label={`★ ${v.rating.toFixed(1)}`} variant="success" />
                <span className="text-video-title text-brand-primary">
                  {products.filter((p) => p.vendor_id === v.vendor_id).length} products
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
