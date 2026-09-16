import { useState } from "react"
import { Banknote, CreditCard, Landmark, Smartphone } from "lucide-react"
import { Button, InputField, RadioGroup, TextareaField } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { productImage } from "../../lib/images"
import { formatINR } from "../../lib/format"

const PAYMENTS = [
  { value: "UPI", label: "UPI", description: "Pay with any UPI app (GPay, PhonePe, Paytm)", icon: Smartphone },
  { value: "Card", label: "Credit / Debit Card", description: "Visa, Mastercard, RuPay", icon: CreditCard },
  { value: "Net Banking", label: "Net Banking", description: "All major Indian banks", icon: Landmark },
  { value: "Cash on Delivery", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Banknote },
]

export default function Checkout() {
  const { cart, products, customer, placeOrder, go, toast } = useStore()
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [address, setAddress] = useState("Flat 12B, Lakeview Residency, Baner")
  const [city, setCity] = useState(customer.city)
  const [pincode, setPincode] = useState("411045")
  const [payment, setPayment] = useState("UPI")
  const [placing, setPlacing] = useState(false)

  const lines = cart
    .map((l) => ({ ...l, product: products.find((p) => p.product_id === l.product_id)! }))
    .filter((l) => l.product)
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const shipping = subtotal > 499 ? 0 : 49
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-xl py-2xl text-center">
        <h1 className="text-title text-text-primary">Nothing to check out</h1>
        <p className="text-label-sm text-text-secondary mt-xs">Add products to your cart first.</p>
        <Button variant="primary" className="mt-xl" onClick={() => go("shop")}>
          Browse products
        </Button>
      </div>
    )
  }

  function handlePlace() {
    if (!name.trim() || !phone.trim() || !address.trim() || pincode.trim().length !== 6) {
      toast("Please complete your details (6-digit PIN required)", "error")
      return
    }
    setPlacing(true)
    // Simulated payment + Flask order creation.
    setTimeout(() => {
      const order = placeOrder(payment, `${address}, ${city} ${pincode}`)
      setPlacing(false)
      go("confirmation", { id: order.order_id })
    }, 900)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-xl py-2xl lg:px-2xl">
      <h1 className="text-title text-text-primary mb-xl">Checkout</h1>

      <div className="grid gap-2xl lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-xl">
          {/* Customer info */}
          <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Customer information</h2>
            <div className="flex flex-col gap-lg">
              <div className="flex flex-col gap-lg sm:flex-row">
                <div className="flex-1">
                  <InputField label="Full name" value={name} onChange={setName} />
                </div>
                <div className="flex-1">
                  <InputField label="Phone number" value={phone} onChange={setPhone} />
                </div>
              </div>
              <InputField label="Email address" value={email} onChange={setEmail} />
            </div>
          </section>

          {/* Address */}
          <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Delivery address</h2>
            <div className="flex flex-col gap-lg">
              <TextareaField label="Address" value={address} onChange={setAddress} rows={2} />
              <div className="flex flex-col gap-lg sm:flex-row">
                <div className="flex-1">
                  <InputField label="City" value={city} onChange={setCity} />
                </div>
                <div className="flex-1">
                  <InputField label="PIN code" value={pincode} onChange={setPincode} />
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Payment method</h2>
            <RadioGroup
              options={PAYMENTS.map((p) => ({ value: p.value, label: p.label, description: p.description }))}
              value={payment}
              onChange={setPayment}
            />
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <h2 className="text-label font-semibold text-text-primary mb-lg">Order summary</h2>
            <div className="mb-lg flex flex-col gap-md">
              {lines.map((l) => (
                <div key={l.product_id} className="flex items-center gap-md">
                  <div className="size-12 shrink-0 overflow-hidden rounded-corner-md bg-bg-faint">
                    <img src={productImage(l.product_id, l.product.category)} alt={l.product.name} className="size-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-video-title font-medium text-text-primary line-clamp-1">{l.product.name}</div>
                    <div className="text-video-title text-text-tertiary">Qty {l.quantity}</div>
                  </div>
                  <span className="text-label-sm font-medium text-text-primary">{formatINR(l.product.price * l.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-md border-t border-border-secondary pt-lg">
              <div className="flex justify-between text-label-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium text-text-primary">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span className="text-text-secondary">Shipping</span>
                <span className="font-medium text-text-primary">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
              </div>
              <div className="mt-xs flex items-center justify-between border-t border-border-secondary pt-lg">
                <span className="text-label font-semibold text-text-primary">Total</span>
                <span className="text-heading font-semibold text-text-primary">{formatINR(total)}</span>
              </div>
            </div>
            <Button variant="primary" className="mt-xl w-full" disabled={placing} onClick={handlePlace}>
              {placing ? "Placing order…" : "Place Order"}
            </Button>
            <p className="text-video-title text-text-tertiary mt-md text-center">
              This is a college project — payment is simulated.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
