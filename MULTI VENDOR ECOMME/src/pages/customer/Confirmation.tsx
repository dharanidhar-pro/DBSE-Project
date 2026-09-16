import { CheckCircle2, Package, Truck } from "lucide-react"
import { Button } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { productImage } from "../../lib/images"
import { formatINR, formatDate } from "../../lib/format"

export default function Confirmation() {
  const { nav, orders, products, go } = useStore()
  const order = orders.find((o) => o.order_id === nav.params?.id)

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-xl py-2xl text-center">
        <h1 className="text-title text-text-primary">Order not found</h1>
        <Button variant="primary" className="mt-xl" onClick={() => go("orders")}>
          Go to My Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-xl py-2xl lg:px-2xl">
      <div className="mh-glass mh-spatial mh-rise rounded-corner-lg p-2xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-corner-full bg-success text-on-brand">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-title text-text-primary mt-lg">Order confirmed!</h1>
        <p className="text-label-sm text-text-secondary mt-xs">
          Thank you for your order. A confirmation has been sent to your email.
        </p>

        <div className="mt-xl grid grid-cols-2 gap-lg text-left sm:grid-cols-4">
          <Info label="Order ID" value={order.order_id} />
          <Info label="Placed on" value={formatDate(order.placed_on)} />
          <Info label="Payment" value={order.payment_method} />
          <Info label="Total" value={formatINR(order.total)} />
        </div>
      </div>

      <div className="mh-glass mh-spatial mt-xl rounded-corner-lg p-xl">
        <h2 className="text-label font-semibold text-text-primary mb-lg">Items in this order</h2>
        <div className="flex flex-col gap-md">
          {order.items.map((it) => {
            const p = products.find((x) => x.product_id === it.product_id)
            return (
              <div key={it.product_id} className="flex items-center gap-md">
                <div className="size-12 shrink-0 overflow-hidden rounded-corner-md bg-bg-faint">
                  <img src={productImage(it.product_id, p?.category ?? "")} alt={it.name} className="size-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-label-sm font-medium text-text-primary line-clamp-1">{it.name}</div>
                  <div className="text-video-title text-text-tertiary">Qty {it.quantity}</div>
                </div>
                <span className="text-label-sm font-medium text-text-primary">{formatINR(it.price * it.quantity)}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-lg flex items-center gap-md rounded-corner-md bg-bg-faint p-md">
          <Truck size={18} className="text-brand-primary" />
          <span className="text-label-sm text-text-secondary">
            Expected delivery by <span className="font-medium text-text-primary">{formatDate(order.expected_delivery)}</span>
          </span>
        </div>
      </div>

      <div className="mt-xl flex flex-wrap justify-center gap-md">
        <Button variant="primary" iconStart={<Package size={16} />} onClick={() => go("tracking", { id: order.order_id })}>
          Track Order
        </Button>
        <Button variant="neutral" onClick={() => go("orders")}>
          View My Orders
        </Button>
        <Button variant="subtle" onClick={() => go("shop")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-corner-md bg-bg-faint p-md">
      <div className="text-video-title text-text-tertiary">{label}</div>
      <div className="text-label-sm font-semibold text-text-primary mt-xs">{value}</div>
    </div>
  )
}
