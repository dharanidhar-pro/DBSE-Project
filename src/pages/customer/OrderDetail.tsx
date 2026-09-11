import { ChevronLeft, MapPin, Package } from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { productImage } from "../../lib/images"
import { formatINR, formatDate } from "../../lib/format"
import { orderStatusVariant } from "../../components/common"

export default function OrderDetail() {
  const { nav, orders, products, go } = useStore()
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

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = order.total - subtotal

  return (
    <div className="mx-auto max-w-[1000px] px-xl py-2xl lg:px-2xl">
      <button
        onClick={() => go("orders")}
        className="mb-xl inline-flex items-center gap-xs text-label-sm text-text-secondary hover:text-brand-primary"
      >
        <ChevronLeft size={16} /> Back to My Orders
      </button>

      <div className="mb-xl flex flex-wrap items-center justify-between gap-md">
        <div>
          <h1 className="text-title text-text-primary">Order {order.order_id}</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Placed on {formatDate(order.placed_on)}</p>
        </div>
        <div className="flex items-center gap-xs">
          <Badge label={order.status} variant={orderStatusVariant(order.status)} />
          <Badge label={order.delivery_status} variant={orderStatusVariant(order.delivery_status)} />
        </div>
      </div>

      <div className="grid gap-xl lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-xl">
          <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Items</h2>
            <div className="flex flex-col gap-lg">
              {order.items.map((it) => {
                const p = products.find((x) => x.product_id === it.product_id)
                return (
                  <div key={it.product_id} className="flex items-center gap-lg">
                    <button
                      onClick={() => go("product", { id: it.product_id })}
                      className="size-16 shrink-0 overflow-hidden rounded-corner-md bg-bg-faint"
                    >
                      <img src={productImage(it.product_id, p?.category ?? "")} alt={it.name} className="size-full object-cover" />
                    </button>
                    <div className="flex-1">
                      <div className="text-label-sm font-medium text-text-primary">{it.name}</div>
                      <div className="text-video-title text-text-tertiary">
                        {formatINR(it.price)} × {it.quantity}
                      </div>
                    </div>
                    <span className="text-label-sm font-semibold text-text-primary">{formatINR(it.price * it.quantity)}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Delivery address</h2>
            <div className="flex items-start gap-md">
              <MapPin size={18} className="mt-xs text-brand-primary" />
              <p className="text-label-sm text-text-secondary">{order.address}</p>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-xl">
          <div className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Payment</h2>
            <div className="flex flex-col gap-md">
              <Row label="Method" value={order.payment_method} />
              <Row label="Status" value={order.payment_status} />
              <div className="my-xs border-t border-border-secondary" />
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="Shipping" value={shipping <= 0 ? "Free" : formatINR(shipping)} />
              <div className="mt-xs flex items-center justify-between border-t border-border-secondary pt-md">
                <span className="text-label font-semibold text-text-primary">Total</span>
                <span className="text-heading font-semibold text-text-primary">{formatINR(order.total)}</span>
              </div>
            </div>
          </div>
          <Button variant="primary" iconStart={<Package size={16} />} onClick={() => go("tracking", { id: order.order_id })}>
            Track Order
          </Button>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-label-sm text-text-secondary">{label}</span>
      <span className="text-label-sm font-medium text-text-primary">{value}</span>
    </div>
  )
}
