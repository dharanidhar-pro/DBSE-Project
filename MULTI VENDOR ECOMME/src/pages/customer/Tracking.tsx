import { CheckCircle2, ChevronLeft, Circle, Clock, MapPin, Package, Truck } from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { formatDate, formatINR } from "../../lib/format"
import type { DeliveryStatus } from "../../lib/data"
import { orderStatusVariant } from "../../components/common"
import { productImage } from "../../lib/images"

const STEPS: { key: DeliveryStatus; label: string; icon: typeof Package }[] = [
  { key: "Processing", label: "Order processing", icon: Clock },
  { key: "Shipped", label: "Shipped", icon: Package },
  { key: "Out for Delivery", label: "Out for delivery", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
]

export default function Tracking() {
  const { nav, orders, go } = useStore()
  const order = orders.find((o) => o.order_id === nav.params?.id)

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-xl py-2xl text-center">
        <h1 className="text-title text-text-primary">Order not found</h1>
        <Button variant="primary" className="mt-xl" onClick={() => go("orders")}>
          Back to My Orders
        </Button>
      </div>
    )
  }

  const currentIndex =
    order.delivery_status === "Cancelled" ? -1 : STEPS.findIndex((s) => s.key === order.delivery_status)

  const progressLabel = order.delivery_status === "Delivered" ? "Delivered" : order.delivery_status === "Cancelled" ? "Order cancelled" : "On its way"

  return (
    <div className="mx-auto max-w-5xl px-xl py-2xl lg:px-2xl">
      <button
        onClick={() => go("order", { id: order.order_id })}
        className="mb-xl inline-flex items-center gap-xs text-label-sm font-medium text-text-secondary transition-colors hover:text-brand-primary"
      >
        <ChevronLeft size={16} /> Order details
      </button>

      <div className="mb-xl flex flex-wrap items-end justify-between gap-lg">
        <div>
          <p className="text-label-sm font-medium text-brand-primary">Delivery tracking</p>
          <h1 className="text-title text-text-primary mt-xs">Track your order</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Order {order.order_id} · Placed {formatDate(order.placed_on)}</p>
        </div>
        <Badge label={order.delivery_status} variant={orderStatusVariant(order.delivery_status)} />
      </div>

      <section className="mh-glass mh-spatial rounded-corner-lg p-xl lg:p-2xl">
        <div className="flex flex-wrap items-start justify-between gap-lg">
          <div className="flex items-center gap-md">
            <span className="flex size-11 items-center justify-center rounded-corner-full bg-brand-tertiary text-brand-primary">
              {order.delivery_status === "Delivered" ? <CheckCircle2 size={22} /> : <Truck size={22} />}
            </span>
            <div>
              <h2 className="text-heading font-semibold text-text-primary">{progressLabel}</h2>
              <p className="text-label-sm text-text-secondary mt-xs">
                {order.delivery_status === "Delivered" ? `Delivered on ${formatDate(order.expected_delivery)}` : `Expected by ${formatDate(order.expected_delivery)}`}
              </p>
            </div>
          </div>
          <div className="rounded-corner-md bg-bg-faint px-lg py-md">
            <div className="text-video-title text-text-tertiary">Tracking number</div>
            <div className="text-label-sm font-semibold text-text-primary mt-xs">{order.tracking_number}</div>
          </div>
        </div>

        <div className="mt-2xl border-t border-border-secondary pt-2xl">
          {order.delivery_status === "Cancelled" ? (
            <div className="rounded-corner-md border border-danger/30 bg-danger/10 p-lg text-label-sm text-danger">This order was cancelled.</div>
          ) : (
            <div className="grid gap-lg md:grid-cols-4">
              {STEPS.map((step, i) => {
                const done = i < currentIndex
                const active = i === currentIndex
                const Icon = done || active ? step.icon : Circle
                return (
                  <div key={step.key} className="relative flex gap-md md:block">
                    {i < STEPS.length - 1 && <span className={`absolute left-4 top-8 hidden h-0.5 w-[calc(100%-1rem)] md:block ${done ? "bg-brand-primary" : "bg-border-secondary"}`} />}
                    <span className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-corner-full ${done || active ? "bg-brand-primary text-on-brand" : "bg-bg-hover text-text-tertiary"}`}>
                      <Icon size={15} />
                    </span>
                    <div className="pt-1 md:pt-md">
                      <div className={`text-label-sm font-medium ${done || active ? "text-text-primary" : "text-text-tertiary"}`}>{step.label}</div>
                      <div className={`text-video-title mt-xs ${active ? "text-brand-primary" : "text-text-tertiary"}`}>
                        {active ? "Current status" : done ? "Completed" : "Pending"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="mt-xl grid gap-xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <div className="mb-lg flex items-center gap-md">
            <Package size={18} className="text-brand-primary" />
            <h2 className="text-label font-semibold text-text-primary">Items in this order</h2>
          </div>
          <div className="flex flex-col divide-y divide-border-secondary">
            {order.items.map((item) => (
              <div key={item.product_id} className="flex items-center gap-md py-md first:pt-0 last:pb-0">
                <img src={productImage(item.product_id, "Accessories")} alt={item.name} className="size-14 rounded-corner-md bg-bg-faint object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-label-sm font-medium text-text-primary">{item.name}</div>
                  <div className="text-video-title text-text-tertiary mt-xs">Qty {item.quantity}</div>
                </div>
                <span className="text-label-sm font-semibold text-text-primary">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-xl">
          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
            <div className="mb-lg flex items-center gap-md">
              <MapPin size={18} className="text-brand-primary" />
              <h2 className="text-label font-semibold text-text-primary">Delivery address</h2>
            </div>
            <p className="text-label-sm leading-relaxed text-text-secondary">{order.address}</p>
          </section>
          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
            <h2 className="text-label font-semibold text-text-primary">Payment summary</h2>
            <div className="mt-lg flex items-center justify-between border-b border-border-secondary pb-md">
              <span className="text-label-sm text-text-secondary">Payment method</span>
              <span className="text-label-sm font-medium text-text-primary">{order.payment_method}</span>
            </div>
            <div className="mt-md flex items-center justify-between">
              <span className="text-label-sm text-text-secondary">Total paid</span>
              <span className="text-label font-semibold text-text-primary">{formatINR(order.total)}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
