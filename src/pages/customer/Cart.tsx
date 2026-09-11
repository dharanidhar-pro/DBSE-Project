import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button, IconButton } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { productImage } from "../../lib/images"
import { formatINR } from "../../lib/format"
import { StatePanel } from "../../components/common"

export default function Cart() {
  const { cart, products, vendors, setQty, removeFromCart, go, stockOf } = useStore()

  const lines = cart
    .map((l) => {
      const p = products.find((x) => x.product_id === l.product_id)
      return p ? { ...l, product: p } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49
  const total = subtotal + shipping

  return (
    <div className="mx-auto max-w-[1440px] px-xl py-2xl lg:px-2xl">
      <h1 className="text-title text-text-primary mb-xl">Your cart</h1>

      {lines.length === 0 ? (
        <StatePanel
          icon={<ShoppingCart size={26} />}
          title="Your cart is empty"
          message="Browse the marketplace and add products to your cart to see them here."
          action={
            <Button variant="primary" onClick={() => go("shop")}>
              Start shopping
            </Button>
          }
        />
      ) : (
        <div className="grid gap-2xl lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-lg">
            {lines.map((l) => {
              const vendor = vendors.find((v) => v.vendor_id === l.product.vendor_id)
              const max = stockOf(l.product.product_id)
              return (
                <div
                  key={l.product_id}
                  className="mh-glass mh-spatial flex flex-col gap-lg rounded-corner-lg p-lg sm:flex-row sm:items-center"
                >
                  <button
                    onClick={() => go("product", { id: l.product_id })}
                    className="size-24 shrink-0 overflow-hidden rounded-corner-md bg-bg-faint"
                  >
                    <img src={productImage(l.product_id, l.product.category)} alt={l.product.name} className="size-full object-cover" />
                  </button>
                  <div className="flex flex-1 flex-col gap-xs">
                    <button onClick={() => go("product", { id: l.product_id })} className="text-left">
                      <h3 className="text-label font-medium text-text-primary hover:text-brand-primary">{l.product.name}</h3>
                    </button>
                    <p className="text-video-title text-text-tertiary">by {vendor?.business_name}</p>
                    <p className="text-label font-semibold text-text-primary">{formatINR(l.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-lg">
                    <div className="flex items-center gap-md rounded-corner-full border border-border-primary bg-surface-bg p-xs">
                      <IconButton variant="subtle" size="small" icon={<Minus size={16} />} onClick={() => setQty(l.product_id, l.quantity - 1)} />
                      <span className="w-6 text-center text-label-sm font-semibold text-text-primary">{l.quantity}</span>
                      <IconButton
                        variant="subtle"
                        size="small"
                        icon={<Plus size={16} />}
                        disabled={l.quantity >= max}
                        onClick={() => setQty(l.product_id, l.quantity + 1)}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-label font-semibold text-text-primary">{formatINR(l.product.price * l.quantity)}</div>
                    </div>
                    <IconButton
                      variant="subtle"
                      size="small"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeFromCart(l.product_id)}
                    />
                  </div>
                </div>
              )
            })}
            <div>
              <Button variant="neutral" onClick={() => go("shop")}>
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="mh-glass mh-spatial rounded-corner-lg p-xl">
              <h2 className="text-label font-semibold text-text-primary mb-lg">Order summary</h2>
              <div className="flex flex-col gap-md">
                <Row label={`Subtotal (${lines.length} items)`} value={formatINR(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
                <div className="my-md border-t border-border-secondary" />
                <div className="flex items-center justify-between">
                  <span className="text-label font-semibold text-text-primary">Total</span>
                  <span className="text-heading font-semibold text-text-primary">{formatINR(total)}</span>
                </div>
              </div>
              <Button variant="primary" className="mt-xl w-full" onClick={() => go("checkout")}>
                Proceed to Checkout
              </Button>
              <p className="text-video-title text-text-tertiary mt-md text-center">Secure checkout · All prices in INR</p>
            </div>
          </aside>
        </div>
      )}
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
