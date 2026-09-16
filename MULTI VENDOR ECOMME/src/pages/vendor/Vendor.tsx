import { useRef, useState, type ChangeEvent } from "react"
import {
  Boxes,
  ImagePlus,
  IndianRupee,
  Package,
  Pencil,
  Plus,
  Receipt,
  Save,
  TriangleAlert,
} from "lucide-react"
import { Badge, Button, InputField, Modal, SelectField, SwitchField, TextareaField } from "@figma/astraui"
import { StatTile } from "../../components/DashboardShell"
import { StatePanel, orderStatusVariant } from "../../components/common"
import { useStore } from "../../lib/store"
import { CATEGORIES, DEMO_VENDOR_ID, type DeliveryStatus, type OrderStatus, type Product } from "../../lib/data"
import { productImage, setProductImage } from "../../lib/images"
import { formatINR, formatINRCompact, formatDate } from "../../lib/format"
import { AvatarUpload } from "../../components/AvatarUpload"

function useVendorData() {
  const { products, orders, stockOf, inventory } = useStore()
  const myProducts = products.filter((p) => p.vendor_id === DEMO_VENDOR_ID)
  const myOrders = orders.filter((o) => o.items.some((i) => i.vendor_id === DEMO_VENDOR_ID))
  const revenue = myOrders.reduce(
    (s, o) => s + o.items.filter((i) => i.vendor_id === DEMO_VENDOR_ID).reduce((a, i) => a + i.price * i.quantity, 0),
    0,
  )
  const lowStock = myProducts.filter((p) => {
    const inv = inventory.find((i) => i.product_id === p.product_id)
    return inv && stockOf(p.product_id) <= inv.low_stock_threshold
  })
  return { myProducts, myOrders, revenue, lowStock, inventory, stockOf }
}

function PageHead({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-xl flex flex-wrap items-end justify-between gap-md">
      <div>
        <h1 className="text-title text-text-primary">{title}</h1>
        <p className="text-label-sm text-text-secondary mt-xs">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}

export function VendorDashboard() {
  const { myProducts, myOrders, revenue, lowStock, inventory, stockOf } = useVendorData()
  const { go } = useStore()
  const invItems = inventory.filter((i) => myProducts.some((p) => p.product_id === i.product_id))
  const totalStock = invItems.reduce((s, i) => s + i.stock, 0)

  return (
    <>
      <PageHead title="Dashboard" subtitle="Overview of your store's performance" />
      <div className="grid grid-cols-2 gap-lg lg:grid-cols-5">
        <StatTile icon={Package} label="Total Products" value={String(myProducts.length)} />
        <StatTile icon={Boxes} label="Inventory Items" value={String(totalStock)} />
        <StatTile icon={TriangleAlert} label="Low Stock" value={String(lowStock.length)} tone={lowStock.length ? "warning" : "brand"} />
        <StatTile icon={Receipt} label="Orders" value={String(myOrders.length)} />
        <StatTile icon={IndianRupee} label="Revenue" value={formatINRCompact(revenue)} trend="+12%" tone="success" />
      </div>

      <div className="mt-2xl grid gap-xl lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <div className="mb-lg flex items-center justify-between">
            <h2 className="text-label font-semibold text-text-primary">Recent orders</h2>
            <Button variant="subtle" size="small" onClick={() => go("v-orders")}>
              View all
            </Button>
          </div>
          <div className="flex flex-col gap-md">
            {myOrders.slice(0, 5).map((o) => (
              <button
                key={o.order_id}
                onClick={() => go("v-order", { id: o.order_id })}
                className="flex items-center justify-between rounded-corner-md border border-border-secondary p-md text-left hover:bg-bg-hover"
              >
                <div>
                  <div className="text-label-sm font-medium text-text-primary">{o.order_id}</div>
                  <div className="text-video-title text-text-tertiary">
                    {o.customer_name} · {formatDate(o.placed_on)}
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <Badge label={o.status} variant={orderStatusVariant(o.status)} />
                  <span className="text-label-sm font-semibold text-text-primary">{formatINR(o.total)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Low stock alerts</h2>
          {lowStock.length === 0 ? (
            <p className="text-label-sm text-text-secondary">All products are well stocked.</p>
          ) : (
            <div className="flex flex-col gap-md">
              {lowStock.map((p) => (
                <div key={p.product_id} className="flex items-center justify-between rounded-corner-md bg-bg-faint p-md">
                  <span className="text-label-sm text-text-primary line-clamp-1">{p.name}</span>
                  <Badge label={`${stockOf(p.product_id)} left`} variant="warning" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

const emptyProduct = (id: number): Product => ({
  product_id: id,
  name: "",
  category: CATEGORIES[0],
  vendor_id: DEMO_VENDOR_ID,
  price: 0,
  mrp: 0,
  description: "",
  rating: 0,
  reviews: 0,
  tags: [],
})

export function VendorProducts() {
  const { myProducts, stockOf } = useVendorData()
  const { products, saveProduct, toast } = useStore()
  const [editing, setEditing] = useState<Product | null>(null)
  const [draft, setDraft] = useState<Product | null>(null)
  const [photoBump, setPhotoBump] = useState(0)
  const photoRef = useRef<HTMLInputElement>(null)

  function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !draft) return
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file", "error")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProductImage(draft.product_id, String(reader.result))
      setPhotoBump((n) => n + 1)
      toast("Product photo added", "success")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function openNew() {
    const nextId = Math.max(...products.map((p) => p.product_id)) + 1
    const p = emptyProduct(nextId)
    setEditing(p)
    setDraft(p)
  }
  function openEdit(p: Product) {
    setEditing(p)
    setDraft({ ...p })
  }
  function commit() {
    if (!draft) return
    if (!draft.name.trim() || draft.price <= 0) {
      toast("Enter a product name and a valid price", "error")
      return
    }
    saveProduct(draft)
    toast(products.some((p) => p.product_id === draft.product_id) ? "Product updated" : "Product added", "success")
    setEditing(null)
    setDraft(null)
  }

  return (
    <>
      <PageHead
        title="Products"
        subtitle="Manage the products in your MarketHub store"
        action={
          <Button variant="primary" iconStart={<Plus size={16} />} onClick={openNew}>
            Add Product
          </Button>
        }
      />

      {myProducts.length === 0 ? (
        <StatePanel icon={<Package size={26} />} title="No products yet" message="Add your first product to start selling." action={<Button variant="primary" onClick={openNew}>Add Product</Button>} />
      ) : (
        <div className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg mh-spatial">
          <div className="mh-scroll overflow-x-auto">
            <table className="w-full min-w-180 text-left">
              <thead>
                <tr className="border-b border-border-secondary bg-bg-faint">
                  {["Product", "Category", "Price", "Stock", ""].map((h) => (
                    <th key={h} className="px-lg py-md text-video-title font-medium text-text-tertiary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myProducts.map((p) => (
                  <tr key={p.product_id} className="border-b border-border-secondary last:border-0 hover:bg-bg-hover">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="size-10 overflow-hidden rounded-corner-md bg-bg-faint">
                          <img src={productImage(p.product_id, p.category)} alt={p.name} className="size-full object-cover" />
                        </div>
                        <span className="text-label-sm font-medium text-text-primary line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-label-sm text-text-secondary">{p.category}</td>
                    <td className="px-lg py-md text-label-sm font-medium text-text-primary">{formatINR(p.price)}</td>
                    <td className="px-lg py-md">
                      {stockOf(p.product_id) <= 0 ? (
                        <Badge label="Out" variant="danger" />
                      ) : (
                        <span className="text-label-sm text-text-primary">{stockOf(p.product_id)}</span>
                      )}
                    </td>
                    <td className="px-lg py-md text-right">
                      <Button variant="subtle" size="small" iconStart={<Pencil size={16} />} onClick={() => openEdit(p)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={draft && products.some((p) => p.product_id === draft.product_id) ? "Edit product" : "Add product"}
        size="medium"
        footer={
          <>
            <Button variant="neutral" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="primary" iconStart={<Save size={16} />} onClick={commit}>
              Save product
            </Button>
          </>
        }
      >
        {draft && (
          <div className="flex flex-col gap-lg">
            {/* Optional product photo. Stored as a session override keyed by
                product_id (the MySQL product table has no image column). */}
            <div className="flex items-center gap-lg">
              <div className="size-20 shrink-0 overflow-hidden rounded-corner-md border border-border-secondary bg-bg-faint">
                <img
                  key={photoBump}
                  src={productImage(draft.product_id, draft.category)}
                  alt="Product preview"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <Button variant="neutral" size="small" iconStart={<ImagePlus size={16} />} onClick={() => photoRef.current?.click()}>
                  Add product photo
                </Button>
                <p className="text-video-title text-text-tertiary mt-xs">Optional · JPG or PNG</p>
              </div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
            </div>
            <InputField label="Product name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <SelectField
              label="Category"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })}
            />
            <div className="flex gap-lg">
              <div className="flex-1">
                <InputField
                  label="Selling price (₹)"
                  value={String(draft.price || "")}
                  onChange={(v) => setDraft({ ...draft, price: Number(v) || 0 })}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="MRP (₹)"
                  value={String(draft.mrp || "")}
                  onChange={(v) => setDraft({ ...draft, mrp: Number(v) || 0 })}
                />
              </div>
            </div>
            <TextareaField
              label="Description"
              value={draft.description}
              onChange={(v) => setDraft({ ...draft, description: v })}
              rows={3}
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export function VendorInventory() {
  const { myProducts, inventory, stockOf } = useVendorData()
  const { setStock, toast } = useStore()
  const [drafts, setDrafts] = useState<Record<number, string>>({})

  return (
    <>
      <PageHead title="Inventory" subtitle="Update stock levels for your products" />
      <div className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg mh-spatial">
        <div className="mh-scroll overflow-x-auto">
          <table className="w-full min-w-160 text-left">
            <thead>
              <tr className="border-b border-border-secondary bg-bg-faint">
                {["Product", "Current stock", "Status", "Update"].map((h) => (
                  <th key={h} className="px-lg py-md text-video-title font-medium text-text-tertiary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myProducts.map((p) => {
                const inv = inventory.find((i) => i.product_id === p.product_id)!
                const stock = stockOf(p.product_id)
                const low = stock <= inv.low_stock_threshold
                return (
                  <tr key={p.product_id} className="border-b border-border-secondary last:border-0">
                    <td className="px-lg py-md text-label-sm font-medium text-text-primary">{p.name}</td>
                    <td className="px-lg py-md text-label-sm text-text-primary">{stock}</td>
                    <td className="px-lg py-md">
                      {stock <= 0 ? (
                        <Badge label="Out of stock" variant="danger" />
                      ) : low ? (
                        <Badge label="Low stock" variant="warning" />
                      ) : (
                        <Badge label="In stock" variant="success" />
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-24">
                          <InputField
                            value={drafts[p.product_id] ?? String(stock)}
                            onChange={(v) => setDrafts((d) => ({ ...d, [p.product_id]: v }))}
                          />
                        </div>
                        <Button
                          variant="neutral"
                          size="small"
                          onClick={() => {
                            const v = Number(drafts[p.product_id] ?? stock)
                            setStock(p.product_id, Math.max(0, v))
                            toast("Inventory updated", "success")
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export function VendorOrders() {
  const { myOrders } = useVendorData()
  const { go } = useStore()
  return (
    <>
      <PageHead title="Orders" subtitle="Orders containing your products" />
      {myOrders.length === 0 ? (
        <StatePanel icon={<Receipt size={26} />} title="No orders yet" message="Orders for your products will appear here." />
      ) : (
        <div className="flex flex-col gap-md">
          {myOrders.map((o) => (
            <button
              key={o.order_id}
              onClick={() => go("v-order", { id: o.order_id })}
              className="mh-lift flex flex-wrap items-center justify-between gap-md rounded-corner-lg border border-border-secondary bg-surface-bg p-lg text-left mh-spatial"
            >
              <div>
                <div className="text-label-sm font-semibold text-text-primary">{o.order_id}</div>
                <div className="text-video-title text-text-tertiary">
                  {o.customer_name} · {formatDate(o.placed_on)}
                </div>
              </div>
              <div className="flex items-center gap-md">
                <Badge label={o.delivery_status} variant={orderStatusVariant(o.delivery_status)} />
                <Badge label={o.status} variant={orderStatusVariant(o.status)} />
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

const STATUS_FLOW: { status: OrderStatus; delivery: DeliveryStatus; label: string }[] = [
  { status: "Confirmed", delivery: "Processing", label: "Mark Processing" },
  { status: "Shipped", delivery: "Shipped", label: "Mark Shipped" },
  { status: "Shipped", delivery: "Out for Delivery", label: "Out for Delivery" },
  { status: "Delivered", delivery: "Delivered", label: "Mark Delivered" },
]

export function VendorOrderDetail() {
  const { nav, orders, updateOrderStatus, toast, go } = useStore()
  const order = orders.find((o) => o.order_id === nav.params?.id)
  if (!order) return <StatePanel icon={<Receipt size={26} />} title="Order not found" message="This order does not exist." action={<Button variant="primary" onClick={() => go("v-orders")}>Back to Orders</Button>} />

  const items = order.items.filter((i) => i.vendor_id === DEMO_VENDOR_ID)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <>
      <PageHead title={`Order ${order.order_id}`} subtitle={`${order.customer_name} · ${formatDate(order.placed_on)}`} />
      <div className="grid gap-xl lg:grid-cols-[1fr_320px]">
        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Your items in this order</h2>
          <div className="flex flex-col gap-lg">
            {items.map((it) => (
              <div key={it.product_id} className="flex items-center gap-lg">
                <div className="size-14 overflow-hidden rounded-corner-md bg-bg-faint">
                  <img src={productImage(it.product_id, "")} alt={it.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 text-label-sm font-medium text-text-primary">{it.name}</div>
                <span className="text-label-sm text-text-secondary">
                  {formatINR(it.price)} × {it.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-lg flex justify-between border-t border-border-secondary pt-lg">
            <span className="text-label font-semibold text-text-primary">Your revenue</span>
            <span className="text-heading font-semibold text-text-primary">{formatINR(subtotal)}</span>
          </div>
        </section>

        <aside className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Fulfilment</h2>
          <div className="mb-lg flex items-center gap-xs">
            <Badge label={order.status} variant={orderStatusVariant(order.status)} />
            <Badge label={order.delivery_status} variant={orderStatusVariant(order.delivery_status)} />
          </div>
          <div className="flex flex-col gap-md">
            {STATUS_FLOW.map((s) => (
              <Button
                key={s.label}
                variant={order.delivery_status === s.delivery ? "primary" : "neutral"}
                size="small"
                onClick={() => {
                  updateOrderStatus(order.order_id, s.status, s.delivery)
                  toast(`Order ${s.delivery.toLowerCase()}`, "success")
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}

export function VendorProfile() {
  const { vendors, updateVendor, myProducts, revenue } = useVendorProfileData()
  const { toast } = useStore()
  const v = vendors.find((x) => x.vendor_id === DEMO_VENDOR_ID)!
  const [name, setName] = useState(v.business_name)
  const [email, setEmail] = useState(v.email)
  const [phone, setPhone] = useState(v.phone)
  const [address, setAddress] = useState(v.address)

  function save() {
    if (!name.trim() || !email.trim()) {
      toast("Business name and email cannot be empty", "error")
      return
    }
    updateVendor(DEMO_VENDOR_ID, { business_name: name, email, phone, address })
    toast("Store profile saved", "success")
  }

  return (
    <>
      <PageHead title="Store profile" subtitle="Your public seller information" />
      <div className="grid gap-xl lg:grid-cols-[320px_1fr]">
        {/* Identity card */}
        <aside className="mh-glass mh-spatial flex h-fit flex-col items-center rounded-corner-lg p-xl text-center">
          <AvatarUpload role="vendor" initials={v.business_name} size={104} />
          <h1 className="text-heading font-semibold text-text-primary mt-lg">{v.business_name}</h1>
          <div className="mt-md">
            <Badge label={`★ ${v.rating.toFixed(1)} · Approved seller`} variant="success" />
          </div>
          <div className="mt-xl grid w-full grid-cols-2 gap-md">
            <VProfileStat label="Products" value={String(myProducts.length)} />
            <VProfileStat label="Revenue" value={formatINRCompact(revenue)} />
          </div>
          <p className="text-video-title text-text-tertiary mt-lg">Seller since {formatDate(v.registered_on)}</p>
        </aside>

        {/* Editable details */}
        <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Business details</h2>
          <div className="flex flex-col gap-lg">
            <InputField label="Business name" value={name} onChange={setName} />
            <div className="flex flex-col gap-lg sm:flex-row">
              <div className="flex-1">
                <InputField label="Email" value={email} onChange={setEmail} />
              </div>
              <div className="flex-1">
                <InputField label="Phone" value={phone} onChange={setPhone} />
              </div>
            </div>
            <TextareaField label="Business address" value={address} onChange={setAddress} rows={2} />
            <div>
              <Button variant="primary" iconStart={<Save size={16} />} onClick={save}>
                Save profile
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export function VendorSettings() {
  const { vendors, updateVendor, toast, logout } = useStore()
  const v = vendors.find((x) => x.vendor_id === DEMO_VENDOR_ID)!
  const [name, setName] = useState(v.business_name)
  const [email, setEmail] = useState(v.email)
  const [phone, setPhone] = useState(v.phone)
  const [address, setAddress] = useState(v.address)
  const [autoReply, setAutoReply] = useState("Free delivery on orders above ₹999")
  const [allowCod, setAllowCod] = useState(true)
  const [showStock, setShowStock] = useState(true)

  function save() {
    if (!name.trim() || !email.trim()) {
      toast("Business name and email cannot be empty", "error")
      return
    }
    updateVendor(DEMO_VENDOR_ID, { business_name: name, email, phone, address })
    toast("Store settings saved", "success")
  }

  return (
    <>
      <PageHead title="Settings" subtitle="Manage your store preferences and storefront details" />
      <div className="grid gap-xl lg:grid-cols-[280px_1fr]">
        <aside className="mh-glass mh-spatial flex h-fit flex-col items-center rounded-corner-lg p-xl text-center">
          <AvatarUpload role="vendor" initials={v.business_name} size={96} />
          <h1 className="text-heading font-semibold text-text-primary mt-lg">{v.business_name}</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Seller account</p>
          <div className="mt-xl w-full rounded-corner-md bg-bg-faint p-md text-left">
            <div className="text-video-title text-text-tertiary">Storefront</div>
            <div className="text-label font-semibold text-text-primary mt-xs">{showStock ? "Visible" : "Hidden"}</div>
          </div>
        </aside>

        <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col gap-lg sm:flex-row">
              <div className="flex-1">
                <InputField label="Business name" value={name} onChange={setName} />
              </div>
              <div className="flex-1">
                <InputField label="Support email" value={email} onChange={setEmail} />
              </div>
            </div>
            <div className="flex flex-col gap-lg sm:flex-row">
              <div className="flex-1">
                <InputField label="Phone" value={phone} onChange={setPhone} />
              </div>
              <div className="flex-1">
                <InputField label="Delivery note" value={autoReply} onChange={setAutoReply} />
              </div>
            </div>
            <TextareaField label="Business address" value={address} onChange={setAddress} rows={2} />

            <div className="border-t border-border-secondary pt-lg">
              <h2 className="text-label font-semibold text-text-primary mb-lg">Store options</h2>
              <div className="flex flex-col gap-lg">
                <SwitchField
                  label="Show stock levels on storefront"
                  description="Display current inventory counts to shoppers"
                  defaultSelected={showStock}
                  onChange={setShowStock}
                />
                <SwitchField
                  label="Enable cash on delivery"
                  description="Allow COD orders from customers"
                  defaultSelected={allowCod}
                  onChange={setAllowCod}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-md">
              <Button variant="primary" iconStart={<Save size={16} />} onClick={save}>
                Save settings
              </Button>
              <Button variant="neutral" iconStart={<Package size={16} />} onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function useVendorProfileData() {
  const { vendors, updateVendor } = useStore()
  const { myProducts, revenue } = useVendorData()
  return { vendors, updateVendor, myProducts, revenue }
}

function VProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-corner-md bg-bg-faint p-md text-left">
      <div className="text-label font-semibold text-text-primary">{value}</div>
      <div className="text-video-title text-text-tertiary">{label}</div>
    </div>
  )
}
