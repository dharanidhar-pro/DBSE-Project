import { useMemo, useState } from "react"
import {
  BadgeCheck,
  Ban,
  Boxes,
  Clock,
  IndianRupee,
  Mail,
  Package,
  Phone,
  Receipt,
  Save,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react"
import { Badge, Button, Modal, SwitchField, InputField } from "@figma/astraui"
import { StatTile } from "../../components/DashboardShell"
import { orderStatusVariant } from "../../components/common"
import { AvatarUpload } from "../../components/AvatarUpload"
import { useStore } from "../../lib/store"
import { CATEGORIES, type Vendor } from "../../lib/data"
import { formatINR, formatINRCompact, formatDate } from "../../lib/format"

function PageHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-xl">
      <h1 className="text-title text-text-primary">{title}</h1>
      <p className="text-label-sm text-text-secondary mt-xs">{subtitle}</p>
    </div>
  )
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg mh-spatial">
      <div className="mh-scroll overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-border-secondary bg-bg-faint">
              {headers.map((h) => (
                <th key={h} className="px-lg py-md text-video-title font-medium text-text-tertiary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const { vendors, customers, products, orders, inventory } = useStore()
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const pending = vendors.filter((v) => v.status === "pending").length
  const approved = vendors.filter((v) => v.status === "approved").length
  const lowStock = inventory.filter((i) => i.stock <= i.low_stock_threshold).length

  return (
    <>
      <PageHead title="Dashboard" subtitle="MarketHub marketplace at a glance" />
      <div className="grid grid-cols-2 gap-lg lg:grid-cols-4">
        <StatTile icon={Store} label="Total Vendors" value={String(vendors.length)} />
        <StatTile icon={Clock} label="Pending Vendors" value={String(pending)} tone={pending ? "warning" : "brand"} />
        <StatTile icon={BadgeCheck} label="Approved Vendors" value={String(approved)} tone="success" />
        <StatTile icon={Users} label="Customers" value={String(customers.length)} />
        <StatTile icon={Package} label="Products" value={String(products.length)} />
        <StatTile icon={Receipt} label="Orders" value={String(orders.length)} />
        <StatTile icon={IndianRupee} label="Revenue" value={formatINRCompact(revenue)} trend="+18%" tone="success" />
        <StatTile icon={Boxes} label="Low Stock" value={String(lowStock)} tone={lowStock ? "danger" : "brand"} />
      </div>

      <div className="mt-2xl grid gap-xl lg:grid-cols-2">
        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Pending approvals</h2>
          {vendors.filter((v) => v.status === "pending").length === 0 ? (
            <p className="text-label-sm text-text-secondary">No vendors awaiting review.</p>
          ) : (
            <div className="flex flex-col gap-md">
              {vendors
                .filter((v) => v.status === "pending")
                .map((v) => (
                  <div key={v.vendor_id} className="flex items-center justify-between rounded-corner-md bg-bg-faint p-md">
                    <div>
                      <div className="text-label-sm font-medium text-text-primary">{v.business_name}</div>
                      <div className="text-video-title text-text-tertiary">{v.email}</div>
                    </div>
                    <Badge label="Pending" variant="warning" />
                  </div>
                ))}
            </div>
          )}
        </section>
        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Recent orders</h2>
          <div className="flex flex-col gap-md">
            {orders.slice(0, 5).map((o) => (
              <div key={o.order_id} className="flex items-center justify-between rounded-corner-md bg-bg-faint p-md">
                <div>
                  <div className="text-label-sm font-medium text-text-primary">{o.order_id}</div>
                  <div className="text-video-title text-text-tertiary">{o.customer_name}</div>
                </div>
                <div className="flex items-center gap-md">
                  <Badge label={o.status} variant={orderStatusVariant(o.status)} />
                  <span className="text-label-sm font-semibold text-text-primary">{formatINR(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export function AdminVendors() {
  const { vendors, setVendorStatus, toast } = useStore()
  const [viewing, setViewing] = useState<Vendor | null>(null)
  const [confirm, setConfirm] = useState<{ vendor: Vendor; action: "approve" | "reject" } | null>(null)

  function apply() {
    if (!confirm) return
    setVendorStatus(confirm.vendor.vendor_id, confirm.action === "approve" ? "approved" : "rejected")
    toast(`${confirm.vendor.business_name} ${confirm.action === "approve" ? "approved" : "rejected"}`, confirm.action === "approve" ? "success" : "warning")
    setConfirm(null)
  }

  return (
    <>
      <PageHead title="Vendors" subtitle="Review and manage seller applications" />
      <Table headers={["Business", "Contact", "Status", "Registered", "Actions"]}>
        {vendors.map((v) => (
          <tr key={v.vendor_id} className="border-b border-border-secondary last:border-0 hover:bg-bg-hover">
            <td className="px-lg py-md">
              <div className="text-label-sm font-medium text-text-primary">{v.business_name}</div>
              <div className="text-video-title text-text-tertiary">{v.address.split(",").slice(-2).join(",").trim()}</div>
            </td>
            <td className="px-lg py-md">
              <div className="text-label-sm text-text-primary">{v.email}</div>
              <div className="text-video-title text-text-tertiary">{v.phone}</div>
            </td>
            <td className="px-lg py-md">
              <Badge
                label={v.status[0].toUpperCase() + v.status.slice(1)}
                variant={v.status === "approved" ? "success" : v.status === "pending" ? "warning" : "danger"}
              />
            </td>
            <td className="px-lg py-md text-label-sm text-text-secondary">{formatDate(v.registered_on)}</td>
            <td className="px-lg py-md">
              <div className="flex justify-end gap-xs">
                <Button variant="subtle" size="small" onClick={() => setViewing(v)}>
                  View
                </Button>
                {v.status !== "approved" && (
                  <Button variant="primary" size="small" iconStart={<BadgeCheck size={16} />} onClick={() => setConfirm({ vendor: v, action: "approve" })}>
                    Approve
                  </Button>
                )}
                {v.status !== "rejected" && (
                  <Button variant="neutral" size="small" iconStart={<Ban size={16} />} onClick={() => setConfirm({ vendor: v, action: "reject" })}>
                    Reject
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Details */}
      <Modal isOpen={viewing !== null} onClose={() => setViewing(null)} title="Vendor details" size="medium">
        {viewing && (
          <div className="flex flex-col gap-md">
            {[
              ["Business name", viewing.business_name],
              ["Email", viewing.email],
              ["Phone", viewing.phone],
              ["Address", viewing.address],
              ["Status", viewing.status],
              ["Registered", formatDate(viewing.registered_on)],
              ["Approved", viewing.approved_on ? formatDate(viewing.approved_on) : "—"],
            ].map(([k, val]) => (
              <div key={k} className="flex justify-between border-b border-border-secondary py-md">
                <span className="text-label-sm text-text-secondary">{k}</span>
                <span className="text-label-sm font-medium text-text-primary text-right">{val}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Confirmation */}
      <Modal
        isOpen={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm?.action === "approve" ? "Approve vendor?" : "Reject vendor?"}
        size="small"
        footer={
          <>
            <Button variant="neutral" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={apply}>
              {confirm?.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </>
        }
      >
        <p className="text-label-sm text-text-secondary">
          {confirm?.action === "approve"
            ? `${confirm?.vendor.business_name} will be able to list products and receive orders.`
            : `${confirm?.vendor.business_name} will not be able to sell on MarketHub. This can be changed later.`}
        </p>
      </Modal>
    </>
  )
}

export function AdminCustomers() {
  const { customers, orders } = useStore()
  return (
    <>
      <PageHead title="Customers" subtitle="Registered shoppers on MarketHub" />
      <Table headers={["Customer", "Contact", "City", "Orders", "Joined"]}>
        {customers.map((c) => {
          const count = orders.filter((o) => o.customer_id === c.customer_id).length || c.orders
          return (
            <tr key={c.customer_id} className="border-b border-border-secondary last:border-0 hover:bg-bg-hover">
              <td className="px-lg py-md text-label-sm font-medium text-text-primary">{c.name}</td>
              <td className="px-lg py-md">
                <div className="text-label-sm text-text-primary">{c.email}</div>
                <div className="text-video-title text-text-tertiary">{c.phone}</div>
              </td>
              <td className="px-lg py-md text-label-sm text-text-secondary">{c.city}</td>
              <td className="px-lg py-md">
                <Badge label={String(count)} variant="secondary" />
              </td>
              <td className="px-lg py-md text-label-sm text-text-secondary">{formatDate(c.joined_on)}</td>
            </tr>
          )
        })}
      </Table>
    </>
  )
}

export function AdminProducts() {
  const { products, vendors, stockOf } = useStore()
  return (
    <>
      <PageHead title="Products" subtitle="All products across every seller" />
      <Table headers={["Product", "Category", "Seller", "Price", "Stock"]}>
        {products.map((p) => (
          <tr key={p.product_id} className="border-b border-border-secondary last:border-0 hover:bg-bg-hover">
            <td className="px-lg py-md text-label-sm font-medium text-text-primary line-clamp-1">{p.name}</td>
            <td className="px-lg py-md text-label-sm text-text-secondary">{p.category}</td>
            <td className="px-lg py-md text-label-sm text-text-secondary">
              {vendors.find((v) => v.vendor_id === p.vendor_id)?.business_name}
            </td>
            <td className="px-lg py-md text-label-sm font-medium text-text-primary">{formatINR(p.price)}</td>
            <td className="px-lg py-md">
              {stockOf(p.product_id) <= 0 ? <Badge label="Out" variant="danger" /> : <span className="text-label-sm text-text-primary">{stockOf(p.product_id)}</span>}
            </td>
          </tr>
        ))}
      </Table>
    </>
  )
}

export function AdminOrders() {
  const { orders } = useStore()
  return (
    <>
      <PageHead title="Orders" subtitle="Every order placed on MarketHub" />
      <Table headers={["Order", "Customer", "Date", "Payment", "Status", "Total"]}>
        {orders.map((o) => (
          <tr key={o.order_id} className="border-b border-border-secondary last:border-0 hover:bg-bg-hover">
            <td className="px-lg py-md text-label-sm font-medium text-text-primary">{o.order_id}</td>
            <td className="px-lg py-md text-label-sm text-text-secondary">{o.customer_name}</td>
            <td className="px-lg py-md text-label-sm text-text-secondary">{formatDate(o.placed_on)}</td>
            <td className="px-lg py-md">
              <Badge label={o.payment_status} variant={o.payment_status === "Paid" ? "success" : "warning"} />
            </td>
            <td className="px-lg py-md">
              <Badge label={o.status} variant={orderStatusVariant(o.status)} />
            </td>
            <td className="px-lg py-md text-label-sm font-semibold text-text-primary">{formatINR(o.total)}</td>
          </tr>
        ))}
      </Table>
    </>
  )
}

export function AdminReports() {
  const { orders, products, vendors, customers } = useStore()

  // Revenue by category (derived from order items).
  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of CATEGORIES) map.set(c, 0)
    for (const o of orders) {
      for (const it of o.items) {
        const p = products.find((x) => x.product_id === it.product_id)
        if (p) map.set(p.category, (map.get(p.category) ?? 0) + it.price * it.quantity)
      }
    }
    return [...map.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  }, [orders, products])

  const maxCat = Math.max(1, ...byCategory.map(([, v]) => v))
  const paid = orders.filter((o) => o.payment_status === "Paid").length
  const deliveryBreak = ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((d) => ({
    label: d,
    count: orders.filter((o) => o.delivery_status === d).length,
  }))

  return (
    <>
      <PageHead title="Reports" subtitle="Sales and operations insights" />
      <div className="grid grid-cols-2 gap-lg lg:grid-cols-4">
        <StatTile icon={IndianRupee} label="Total revenue" value={formatINRCompact(orders.reduce((s, o) => s + o.total, 0))} tone="success" />
        <StatTile icon={Receipt} label="Orders" value={String(orders.length)} />
        <StatTile icon={BadgeCheck} label="Paid orders" value={`${paid}/${orders.length}`} />
        <StatTile icon={Users} label="Customers" value={String(customers.length)} />
      </div>

      <div className="mt-2xl grid gap-xl lg:grid-cols-2">
        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Revenue by category</h2>
          <div className="flex flex-col gap-lg">
            {byCategory.map(([cat, val]) => (
              <div key={cat}>
                <div className="mb-xs flex justify-between text-label-sm">
                  <span className="text-text-secondary">{cat}</span>
                  <span className="font-medium text-text-primary">{formatINR(val)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-corner-full bg-bg-faint">
                  <div className="h-full rounded-corner-full bg-brand-primary" style={{ width: `${(val / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Delivery status</h2>
          <div className="flex flex-col gap-md">
            {deliveryBreak.map((d) => (
              <div key={d.label} className="flex items-center justify-between rounded-corner-md bg-bg-faint p-md">
                <span className="text-label-sm text-text-primary">{d.label}</span>
                <Badge label={String(d.count)} variant={d.count ? "brand" : "secondary"} />
              </div>
            ))}
          </div>
          <div className="mt-lg border-t border-border-secondary pt-lg">
            <h3 className="text-label-sm font-semibold text-text-primary mb-md">Top vendors by rating</h3>
            {vendors
              .filter((v) => v.status === "approved")
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((v) => (
                <div key={v.vendor_id} className="flex items-center justify-between py-xs">
                  <span className="text-label-sm text-text-secondary">{v.business_name}</span>
                  <Badge label={`★ ${v.rating.toFixed(1)}`} variant="success" />
                </div>
              ))}
          </div>
        </section>
      </div>
    </>
  )
}

export function AdminProfile() {
  const { admin, updateAdmin, vendors, customers, orders, toast } = useStore()
  const [name, setName] = useState(admin.name)
  const [email, setEmail] = useState(admin.email)
  const [phone, setPhone] = useState(admin.phone)
  const [title, setTitle] = useState(admin.title)

  function save() {
    if (!name.trim() || !email.trim()) {
      toast("Name and email cannot be empty", "error")
      return
    }
    updateAdmin({ name, email, phone, title })
    toast("Profile updated", "success")
  }

  return (
    <>
      <PageHead title="Profile" subtitle="Your administrator account" />
      <div className="grid gap-xl lg:grid-cols-[320px_1fr]">
        <aside className="mh-glass mh-spatial flex h-fit flex-col items-center rounded-corner-lg p-xl text-center">
          <AvatarUpload role="admin" initials={admin.name} size={104} />
          <h1 className="text-heading font-semibold text-text-primary mt-lg">{admin.name}</h1>
          <p className="text-label-sm text-text-secondary mt-xs">{admin.title}</p>
          <div className="mt-md">
            <Badge label="Full access" variant="brand" />
          </div>
          <div className="mt-xl grid w-full grid-cols-3 gap-md">
            <ProfileStat label="Vendors" value={String(vendors.length)} />
            <ProfileStat label="Buyers" value={String(customers.length)} />
            <ProfileStat label="Orders" value={String(orders.length)} />
          </div>
          <p className="text-video-title text-text-tertiary mt-lg flex items-center gap-xs">
            <ShieldCheck size={13} /> Admin since {formatDate(admin.joined_on)}
          </p>
        </aside>

        <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
          <h2 className="text-label font-semibold text-text-primary mb-lg">Account details</h2>
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col gap-lg sm:flex-row">
              <div className="flex-1">
                <InputField label="Full name" value={name} onChange={setName} />
              </div>
              <div className="flex-1">
                <InputField label="Role title" value={title} onChange={setTitle} />
              </div>
            </div>
            <div className="flex flex-col gap-lg sm:flex-row">
              <div className="flex-1">
                <InputField label="Email" value={email} onChange={setEmail} />
              </div>
              <div className="flex-1">
                <InputField label="Phone" value={phone} onChange={setPhone} />
              </div>
            </div>
            <div>
              <Button variant="primary" iconStart={<Save size={16} />} onClick={save}>
                Save changes
              </Button>
            </div>
          </div>

          <div className="mt-xl grid gap-md border-t border-border-secondary pt-xl sm:grid-cols-2">
            <ProfileContact icon={<Mail size={15} />} label="Email" value={admin.email} />
            <ProfileContact icon={<Phone size={15} />} label="Phone" value={admin.phone} />
          </div>
        </section>
      </div>
    </>
  )
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-corner-md bg-bg-faint p-md text-left">
      <div className="text-label font-semibold text-text-primary">{value}</div>
      <div className="text-video-title text-text-tertiary">{label}</div>
    </div>
  )
}

function ProfileContact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-md">
      <span className="flex size-9 items-center justify-center rounded-corner-full bg-bg-faint text-brand-primary">{icon}</span>
      <div>
        <div className="text-video-title text-text-tertiary">{label}</div>
        <div className="text-label-sm font-medium text-text-primary">{value}</div>
      </div>
    </div>
  )
}

export function AdminSettings() {
  const { toast, logout } = useStore()
  const [name, setName] = useState("MarketHub Technologies Pvt. Ltd.")
  const [email, setEmail] = useState("support@markethub.in")
  return (
    <>
      <PageHead title="Settings" subtitle="Marketplace configuration" />
      <div className="max-w-2xl rounded-corner-lg border border-border-secondary bg-surface-bg p-xl mh-spatial">
        <h2 className="text-label font-semibold text-text-primary mb-lg">General</h2>
        <div className="flex flex-col gap-lg">
          <InputField label="Marketplace name" value={name} onChange={setName} />
          <InputField label="Support email" value={email} onChange={setEmail} />
        </div>
        <div className="my-xl border-t border-border-secondary" />
        <h2 className="text-label font-semibold text-text-primary mb-lg">Policies</h2>
        <div className="flex flex-col gap-lg">
          <SwitchField label="Auto-approve trusted vendors" description="Skip manual review for pre-verified sellers" defaultSelected={false} onChange={() => {}} />
          <SwitchField label="Allow Cash on Delivery" description="Enable COD across the marketplace" defaultSelected onChange={() => {}} />
          <SwitchField label="Low stock notifications" description="Alert vendors when stock is low" defaultSelected onChange={() => {}} />
        </div>
        <div className="mt-xl flex flex-wrap gap-md">
          <Button variant="primary" onClick={() => toast("Settings saved", "success")}>
            Save settings
          </Button>
          <Button variant="neutral" iconStart={<ShieldCheck size={16} />} onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}
