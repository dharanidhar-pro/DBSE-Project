import { useState } from "react"
import { LogOut, Mail, MapPin, Package, Phone, Save, ShoppingBag } from "lucide-react"
import { Badge, Button, InputField, SwitchField, Tabs } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { formatINR } from "../../lib/format"
import { AvatarUpload } from "../../components/AvatarUpload"

export default function Profile() {
  const { customer, updateCustomer, orders, logout, go, toast } = useStore()
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [city, setCity] = useState(customer.city)

  const myOrders = orders.filter((o) => o.customer_id === customer.customer_id)
  const spent = myOrders.reduce((s, o) => s + o.total, 0)

  function save() {
    if (!name.trim() || !email.trim()) {
      toast("Name and email cannot be empty", "error")
      return
    }
    updateCustomer({ name, email, phone, city })
    toast("Profile updated", "success")
  }

  return (
    <div className="mx-auto max-w-[1080px] px-xl py-2xl lg:px-2xl">
      <div className="grid gap-xl lg:grid-cols-[320px_1fr]">
        {/* Identity card */}
        <aside className="mh-glass mh-spatial flex h-fit flex-col items-center rounded-corner-lg p-xl text-center">
          <AvatarUpload role="customer" initials={customer.name} size={104} />
          <h1 className="text-heading font-semibold text-text-primary mt-lg">{customer.name}</h1>
          <p className="text-label-sm text-text-secondary mt-xs flex items-center gap-xs">
            <MapPin size={14} /> {customer.city}
          </p>
          <div className="mt-md">
            <Badge label="MarketHub member" variant="brand" />
          </div>

          <div className="mt-xl grid w-full grid-cols-2 gap-md">
            <StatBox icon={<ShoppingBag size={16} />} label="Orders" value={String(myOrders.length)} />
            <StatBox icon={<Package size={16} />} label="Spent" value={formatINR(spent)} />
          </div>

          <Button variant="neutral" className="mt-xl w-full" iconStart={<LogOut size={16} />} onClick={logout}>
            Logout
          </Button>
        </aside>

        {/* Editable details */}
        <section className="mh-glass mh-spatial rounded-corner-lg p-xl">
          <Tabs
            tabs={[
              {
                id: "details",
                label: "Personal details",
                content: (
                  <div className="flex flex-col gap-lg pt-lg">
                    <div className="flex flex-col gap-lg sm:flex-row">
                      <div className="flex-1">
                        <InputField label="Full name" value={name} onChange={setName} />
                      </div>
                      <div className="flex-1">
                        <InputField label="City" value={city} onChange={setCity} />
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
                ),
              },
              {
                id: "prefs",
                label: "Preferences",
                content: (
                  <div className="flex flex-col gap-lg pt-lg">
                    <SwitchField label="Order updates" description="Get notified about shipping and delivery" defaultSelected onChange={() => {}} />
                    <SwitchField label="Deals & offers" description="Occasional emails about marketplace deals" defaultSelected={false} onChange={() => {}} />
                    <SwitchField label="New seller alerts" description="When sellers you follow add products" defaultSelected={false} onChange={() => {}} />
                  </div>
                ),
              },
              {
                id: "orders",
                label: "Recent orders",
                content: (
                  <div className="flex flex-col gap-md pt-lg">
                    {myOrders.length === 0 ? (
                      <p className="text-label-sm text-text-secondary">No orders yet.</p>
                    ) : (
                      myOrders.map((o) => (
                        <button
                          key={o.order_id}
                          onClick={() => go("order", { id: o.order_id })}
                          className="flex items-center justify-between rounded-corner-md border border-border-secondary p-md text-left hover:bg-bg-hover"
                        >
                          <div>
                            <div className="text-label-sm font-medium text-text-primary">{o.order_id}</div>
                            <div className="text-video-title text-text-tertiary">{o.items.length} items · {o.status}</div>
                          </div>
                          <span className="text-label-sm font-semibold text-text-primary">{formatINR(o.total)}</span>
                        </button>
                      ))
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="details"
          />

          <div className="mt-xl grid gap-md border-t border-border-secondary pt-xl sm:grid-cols-2">
            <Contact icon={<Mail size={15} />} label="Email" value={customer.email} />
            <Contact icon={<Phone size={15} />} label="Phone" value={customer.phone} />
          </div>
        </section>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-corner-md bg-bg-faint p-md text-left">
      <span className="flex size-8 items-center justify-center rounded-corner-full bg-brand-tertiary text-brand-primary">
        {icon}
      </span>
      <div className="text-label font-semibold text-text-primary mt-md">{value}</div>
      <div className="text-video-title text-text-tertiary">{label}</div>
    </div>
  )
}

function Contact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
