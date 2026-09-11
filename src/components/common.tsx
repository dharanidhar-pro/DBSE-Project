import type { ReactNode } from "react"
import { ArrowLeft, Star } from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import type { DeliveryStatus, OrderStatus, Product } from "../lib/data"
import { productImage } from "../lib/images"
import { formatINR } from "../lib/format"
import { useStore } from "../lib/store"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "brand" | "secondary"

// Reusable back button — pops the navigation history, or goes to `fallback`.
export function BackButton({ label = "Back", fallback = "home" }: { label?: string; fallback?: string }) {
  const { back } = useStore()
  return (
    <Button variant="subtle" size="small" iconStart={<ArrowLeft size={16} />} onClick={() => back(fallback)}>
      {label}
    </Button>
  )
}

export function orderStatusVariant(s: OrderStatus | DeliveryStatus): BadgeVariant {
  switch (s) {
    case "Delivered":
      return "success"
    case "Shipped":
    case "Out for Delivery":
    case "Confirmed":
      return "brand"
    case "Pending":
    case "Processing":
      return "warning"
    case "Cancelled":
      return "danger"
    default:
      return "default"
  }
}

// Rating row — small stars + numeric value. Custom (no kit rating component).
export function RatingStars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-xs">
      <Star size={13} className="fill-current text-warning" />
      <span className="text-video-title text-text-primary">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-video-title text-text-tertiary">({reviews})</span>}
    </div>
  )
}

export function StockPill({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge label="Out of stock" variant="danger" />
  if (stock <= 10) return <Badge label={`Only ${stock} left`} variant="warning" />
  return <Badge label="In stock" variant="success" />
}

export function SectionHeader({
  title,
  action,
  subtitle,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-xl mb-xl">
      <div>
        <h2 className="text-title text-text-primary">{title}</h2>
        {subtitle && <p className="text-label-sm text-text-secondary mt-xs">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ProductCard — commerce card built from kit primitives (Button, Badge) and
   kit tokens. The kit's ItemCard is a video card that forces a DurationBadge
   and "updated · spec" metadata, so it doesn't fit a marketplace product. */
export function ProductCard({ product }: { product: Product }) {
  const { go, addToCart, stockOf, vendors } = useStore()
  const stock = stockOf(product.product_id)
  const vendor = vendors.find((v) => v.vendor_id === product.vendor_id)
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <div className="mh-lift group flex flex-col overflow-hidden rounded-corner-lg bg-surface-bg border border-border-secondary mh-spatial">
      <button
        onClick={() => go("product", { id: product.product_id })}
        className="relative block aspect-[4/3] overflow-hidden bg-bg-faint"
        aria-label={`View ${product.name}`}
      >
        <img
          src={productImage(product.product_id, product.category)}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-md top-md flex gap-xs">
          {discount > 0 && <Badge label={`${discount}% off`} variant="danger" />}
          {product.tags.includes("new") && <Badge label="New" variant="brand" />}
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-md p-xl">
        <div className="flex items-center justify-between">
          <span className="text-video-title text-text-tertiary">{product.category}</span>
          <RatingStars rating={product.rating} reviews={product.reviews} />
        </div>
        <button onClick={() => go("product", { id: product.product_id })} className="text-left">
          <h3 className="text-label text-text-primary line-clamp-2 hover:text-brand-primary transition-colors">
            {product.name}
          </h3>
        </button>
        <p className="text-video-title text-text-secondary">by {vendor?.business_name ?? "MarketHub Seller"}</p>

        <div className="mt-auto flex items-end justify-between gap-md pt-md">
          <div>
            <div className="text-label text-text-primary font-semibold">{formatINR(product.price)}</div>
            {product.mrp > product.price && (
              <div className="text-video-title text-text-tertiary line-through">{formatINR(product.mrp)}</div>
            )}
          </div>
          <StockPill stock={stock} />
        </div>

        <div className="flex gap-md pt-xs">
          <Button
            variant="primary"
            size="small"
            className="flex-1"
            disabled={stock <= 0}
            onClick={() => addToCart(product.product_id)}
          >
            Add to Cart
          </Button>
          <Button variant="neutral" size="small" onClick={() => go("product", { id: product.product_id })}>
            View
          </Button>
        </div>
      </div>
    </div>
  )
}

// Reusable page states — loading / empty / error, styled as spatial glass panels.
export function StatePanel({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="mh-glass mh-spatial rounded-corner-lg flex flex-col items-center justify-center gap-lg px-2xl py-2xl text-center mh-rise">
      <div className="flex size-14 items-center justify-center rounded-corner-full bg-brand-tertiary text-brand-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-heading text-text-primary">{title}</h3>
        <p className="text-label-sm text-text-secondary mt-xs max-w-md">{message}</p>
      </div>
      {action}
    </div>
  )
}

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-corner-lg bg-surface-bg border border-border-secondary overflow-hidden">
          <div className="mh-skeleton aspect-[4/3]" />
          <div className="flex flex-col gap-md p-xl">
            <div className="mh-skeleton h-3 w-1/3 rounded-corner-sm" />
            <div className="mh-skeleton h-4 w-4/5 rounded-corner-sm" />
            <div className="mh-skeleton h-4 w-1/2 rounded-corner-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
