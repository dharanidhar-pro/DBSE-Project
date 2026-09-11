import { CheckCircle2, ChevronLeft, Circle, Clock, MapPin, Package, Truck } from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { formatDate } from "../../lib/format"
import type { DeliveryStatus } from "../../lib/data"
import { orderStatusVariant } from "../../components/common"

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

  return (
    <div className="mx-auto max-w-2xl px-xl py-2xl lg:px-2xl">
      <button
        onClick={() => go("order", { id: order.order_id })}
        className="mb-xl inline-flex items-center gap-xs text-label-sm text-text-secondary hover:text-brand-primary"
      >
        <ChevronLeft size={16} /> Order details
      </button>

      <div className="mh-glass mh-spatial rounded-corner-lg p-xl">
        <div className="flex flex-wrap items-center justify-between gap-md">
          <div>
            <h1 className="text-title text-text-primary">Track order</h1>
            <p className="text-label-sm text-text-secondary mt-xs">{order.order_id}</p>
          </div>
          <Badge label={order.delivery_status} variant={orderStatusVariant(order.delivery_status)} />
        </div>

        <div className="mt-xl grid grid-cols-2 gap-lg">
          <div className="rounded-corner-md bg-bg-faint p-md">
            <div className="text-video-title text-text-tertiary">Tracking number</div>
            <div className="text-label-sm font-semibold text-text-primary mt-xs">{order.tracking_number}</div>
          </div>
          <div className="rounded-corner-md bg-bg-faint p-md">
            <div className="text-video-title text-text-tertiary">Expected delivery</div>
            <div className="text-label-sm font-semibold text-text-primary mt-xs">{formatDate(order.expected_delivery)}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-2xl">
          {order.delivery_status === "Cancelled" ? (
            <div className="rounded-corner-md bg-bg-faint p-lg text-center text-label-sm text-danger">
              This order was cancelled.
            </div>
          ) : (
            <div className="flex flex-col">
              {STEPS.map((step, i) => {
                const done = i < currentIndex
                const active = i === currentIndex
                const Icon = done || active ? step.icon : Circle
                return (
                  <div key={step.key} className="flex gap-lg">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex size-9 items-center justify-center rounded-corner-full ${
                          done || active ? "bg-brand-primary text-on-brand" : "bg-bg-hover text-text-tertiary"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      {i < STEPS.length - 1 && (
                        <span className={`my-xs w-0.5 flex-1 ${done ? "bg-brand-primary" : "bg-border-secondary"}`} style={{ minHeight: 28 }} />
                      )}
                    </div>
                    <div className="pb-lg pt-xs">
                      <div className={`text-label-sm font-medium ${done || active ? "text-text-primary" : "text-text-tertiary"}`}>
                        {step.label}
                      </div>
                      {active && <div className="text-video-title text-brand-primary mt-xs">In progress</div>}
                      {done && <div className="text-video-title text-text-tertiary mt-xs">Completed</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-lg flex items-start gap-md rounded-corner-md border border-border-secondary p-md">
          <MapPin size={18} className="mt-xs text-brand-primary" />
          <div>
            <div className="text-video-title text-text-tertiary">Delivering to</div>
            <p className="text-label-sm text-text-secondary mt-xs">{order.address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
