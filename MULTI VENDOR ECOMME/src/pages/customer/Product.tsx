import { useState } from "react"
import { ChevronLeft, Minus, Plus, ShieldCheck, Store, Truck, RotateCcw } from "lucide-react"
import { Badge, Button, IconButton, Tabs } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { productImage } from "../../lib/images"
import { formatINR } from "../../lib/format"
import { ProductCard, RatingStars, StockPill } from "../../components/common"

export default function Product() {
  const { nav, products, vendors, stockOf, addToCart, go } = useStore()
  const id = Number(nav.params?.id)
  const product = products.find((p) => p.product_id === id)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-xl py-2xl text-center">
        <h1 className="text-title text-text-primary">Product not found</h1>
        <p className="text-label-sm text-text-secondary mt-xs">This product may have been removed by the seller.</p>
        <Button variant="primary" className="mt-xl" onClick={() => go("shop")}>
          Back to Shop
        </Button>
      </div>
    )
  }

  const vendor = vendors.find((v) => v.vendor_id === product.vendor_id)
  const stock = stockOf(product.product_id)
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const related = products
    .filter((p) => p.category === product.category && p.product_id !== product.product_id)
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-[1440px] px-xl py-2xl lg:px-2xl">
      <button
        onClick={() => go("shop")}
        className="mb-xl inline-flex items-center gap-xs text-label-sm text-text-secondary hover:text-brand-primary"
      >
        <ChevronLeft size={16} /> Back to Shop
      </button>

      <div className="grid gap-2xl lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div className="mh-glass mh-spatial overflow-hidden rounded-corner-lg p-lg">
          <div className="overflow-hidden rounded-corner-md bg-bg-faint">
            <img
              src={productImage(product.product_id, product.category)}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        {/* Buy box */}
        <div className="flex flex-col gap-lg">
          <div className="flex items-center gap-md">
            <Badge label={product.category} variant="secondary" />
            {product.tags.includes("new") && <Badge label="New arrival" variant="brand" />}
          </div>
          <h1 className="text-title text-text-primary">{product.name}</h1>
          <div className="flex items-center gap-lg">
            <RatingStars rating={product.rating} reviews={product.reviews} />
            <button
              onClick={() => go("shop", { vendor: product.vendor_id })}
              className="inline-flex items-center gap-xs text-label-sm text-brand-primary"
            >
              <Store size={14} /> {vendor?.business_name}
            </button>
          </div>

          <div className="mh-skeuo flex items-end gap-md rounded-corner-lg p-lg">
            <span className="text-title font-semibold text-text-primary">{formatINR(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-label text-text-tertiary line-through">{formatINR(product.mrp)}</span>
                <Badge label={`Save ${off}%`} variant="danger" />
              </>
            )}
          </div>

          <div className="flex items-center gap-lg">
            <StockPill stock={stock} />
            <span className="text-label-sm text-text-secondary">Inclusive of all taxes</span>
          </div>

          <p className="text-label-sm text-text-secondary">{product.description}</p>

          {/* Quantity + actions */}
          <div className="flex flex-wrap items-center gap-lg pt-xs">
            <div className="flex items-center gap-md rounded-corner-full border border-border-primary bg-surface-bg p-xs">
              <IconButton variant="subtle" size="small" icon={<Minus size={16} />} onClick={() => setQty((q) => Math.max(1, q - 1))} />
              <span className="w-8 text-center text-label font-semibold text-text-primary">{qty}</span>
              <IconButton
                variant="subtle"
                size="small"
                icon={<Plus size={16} />}
                disabled={qty >= stock}
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
              />
            </div>
            <Button variant="primary" disabled={stock <= 0} onClick={() => addToCart(product.product_id, qty)}>
              Add to Cart
            </Button>
            <Button
              variant="neutral"
              disabled={stock <= 0}
              onClick={() => {
                addToCart(product.product_id, qty)
                go("cart")
              }}
            >
              Buy Now
            </Button>
          </div>

          {/* Delivery + trust */}
          <div className="grid grid-cols-1 gap-md pt-xs sm:grid-cols-3">
            {[
              { icon: Truck, t: "Free delivery", s: "On orders above ₹499" },
              { icon: RotateCcw, t: "7-day returns", s: "Easy replacement" },
              { icon: ShieldCheck, t: "Verified seller", s: `★ ${vendor?.rating.toFixed(1)} rated` },
            ].map((x) => {
              const Icon = x.icon
              return (
                <div key={x.t} className="flex items-center gap-md rounded-corner-md border border-border-secondary bg-surface-bg p-md">
                  <Icon size={18} className="text-brand-primary" />
                  <div>
                    <div className="text-video-title font-medium text-text-primary">{x.t}</div>
                    <div className="text-video-title text-text-tertiary">{x.s}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info tabs */}
      <div className="mh-glass mh-spatial mt-2xl rounded-corner-lg p-xl">
        <Tabs
          tabs={[
            {
              id: "info",
              label: "Product information",
              content: (
                <div className="grid grid-cols-1 gap-lg pt-lg sm:grid-cols-2">
                  {[
                    ["Category", product.category],
                    ["Seller", vendor?.business_name ?? "—"],
                    ["SKU", `MH-P${product.product_id.toString().padStart(4, "0")}`],
                    ["Rating", `${product.rating.toFixed(1)} / 5 (${product.reviews} reviews)`],
                    ["MRP", formatINR(product.mrp)],
                    ["Warranty", "1 year manufacturer warranty"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border-secondary py-md">
                      <span className="text-label-sm text-text-secondary">{k}</span>
                      <span className="text-label-sm font-medium text-text-primary">{v}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "delivery",
              label: "Delivery",
              content: (
                <div className="flex flex-col gap-md pt-lg text-label-sm text-text-secondary">
                  <p>Delivered by {vendor?.business_name} · dispatched from {vendor?.address.split(",").slice(-2).join(",").trim()}.</p>
                  <p>Standard delivery in 3–6 business days. Free on orders above ₹499, otherwise ₹49 applies.</p>
                  <p>Cash on Delivery available. Track every order in real time from My Orders.</p>
                </div>
              ),
            },
          ]}
          defaultTab="info"
        />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-2xl">
          <h2 className="text-title text-text-primary mb-xl">Related products</h2>
          <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
