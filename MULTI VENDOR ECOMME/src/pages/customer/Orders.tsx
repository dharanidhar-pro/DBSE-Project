import { Package, ShoppingBag } from "lucide-react"
import { Badge, Button } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { productImage } from "../../lib/images"
import { formatINR, formatDate } from "../../lib/format"
import { StatePanel, orderStatusVariant } from "../../components/common"

export default function Orders() {
  const { orders, customer, products, go } = useStore()
  const myOrders = orders.filter((o) => o.customer_id === customer.customer_id)

  return (
    <div className="mx-auto max-w-[1100px] px-xl py-2xl lg:px-2xl">
      <h1 className="text-title text-text-primary mb-xl">My orders</h1>

      {myOrders.length === 0 ? (
        <StatePanel
          icon={<ShoppingBag size={26} />}
          title="No orders yet"
          message="When you place an order it will appear here, with live tracking."
          action={
            <Button variant="primary" onClick={() => go("shop")}>
              Start shopping
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-lg">
          {myOrders.map((o) => (
            <div key={o.order_id} className="mh-glass mh-spatial rounded-corner-lg p-xl">
              <div className="flex flex-wrap items-center justify-between gap-md border-b border-border-secondary pb-lg">
                <div className="flex flex-wrap items-center gap-lg">
                  <div>
                    <div className="text-video-title text-text-tertiary">Order ID</div>
                    <div className="text-label-sm font-semibold text-text-primary">{o.order_id}</div>
                  </div>
                  <div>
                    <div className="text-video-title text-text-tertiary">Placed on</div>
                    <div className="text-label-sm font-medium text-text-primary">{formatDate(o.placed_on)}</div>
                  </div>
                  <div>
                    <div className="text-video-title text-text-tertiary">Total</div>
                    <div className="text-label-sm font-semibold text-text-primary">{formatINR(o.total)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-xs">
                  <Badge label={o.status} variant={orderStatusVariant(o.status)} />
                  <Badge label={o.payment_status} variant={o.payment_status === "Paid" ? "success" : "warning"} />
                </div>
              </div>

              <div className="flex items-center gap-md py-lg">
                {o.items.slice(0, 4).map((it) => {
                  const p = products.find((x) => x.product_id === it.product_id)
                  return (
                    <div key={it.product_id} className="size-14 overflow-hidden rounded-corner-md bg-bg-faint">
                      <img src={productImage(it.product_id, p?.category ?? "")} alt={it.name} className="size-full object-cover" />
                    </div>
                  )
                })}
                <span className="text-label-sm text-text-secondary">
                  {o.items.length} {o.items.length === 1 ? "item" : "items"} · Delivery: {o.delivery_status}
                </span>
              </div>

              <div className="flex flex-wrap gap-md">
                <Button variant="neutral" size="small" onClick={() => go("order", { id: o.order_id })}>
                  Order Details
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  iconStart={<Package size={16} />}
                  onClick={() => go("tracking", { id: o.order_id })}
                >
                  Track Order
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
