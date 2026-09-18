import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  CUSTOMERS,
  DEMO_CUSTOMER,
  INVENTORY,
  PRODUCTS,
  SEED_ORDERS,
  VENDORS,
  type Customer,
  type DeliveryStatus,
  type Inventory,
  type Order,
  type OrderStatus,
  type Product,
  type Vendor,
} from "./data"

export type Role = "customer" | "vendor" | "admin"
export type CartLine = { product_id: number; quantity: number }
export type Toast = { id: number; message: string; variant: "default" | "success" | "error" | "warning" }
export type Nav = { view: string; params?: Record<string, string | number> }
export type AdminProfile = { name: string; email: string; phone: string; title: string; joined_on: string }
export type VendorAccess = "approved" | "pending" | "rejected"
export type AuthResult = VendorAccess | "success" | "invalid"

type Store = {
  role: Role
  setRole: (r: Role) => void
  loggedIn: boolean
  vendorAccess: VendorAccess
  customer: Customer
  updateCustomer: (patch: Partial<Customer>) => void
  admin: AdminProfile
  updateAdmin: (patch: Partial<AdminProfile>) => void
  updateVendor: (vendorId: number, patch: Partial<Vendor>) => void
  registerVendor: (vendor: Pick<Vendor, "business_name" | "email" | "phone" | "address">) => void
  avatars: Partial<Record<Role, string>>
  setAvatar: (role: Role, dataUrl: string) => void
  login: (role?: Role) => void
  authenticate: (role: Role, email: string, password: string) => AuthResult
  logout: () => void

  nav: Nav
  go: (view: string, params?: Record<string, string | number>) => void
  back: (fallback?: string) => void
  canGoBack: boolean

  products: Product[]
  vendors: Vendor[]
  inventory: Inventory[]
  customers: Customer[]
  orders: Order[]

  cart: CartLine[]
  cartCount: number
  addToCart: (productId: number, qty?: number) => void
  setQty: (productId: number, qty: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void

  placeOrder: (payment: string, address: string) => Order
  setVendorStatus: (vendorId: number, status: Vendor["status"]) => void
  saveProduct: (p: Product) => void
  setStock: (productId: number, stock: number) => void
  updateOrderStatus: (orderId: string, status: OrderStatus, delivery: DeliveryStatus) => void

  toasts: Toast[]
  toast: (message: string, variant?: Toast["variant"]) => void
  dismissToast: (id: number) => void

  stockOf: (productId: number) => number
}

// Keep the context object stable across HMR module re-evaluations. Without this,
// editing this file recreates the Context so a mounted provider and a consumer
// end up on different instances → "useStore must be used within StoreProvider".
const g = globalThis as unknown as { __MH_STORE_CTX__?: ReturnType<typeof createContext<Store | null>> }
const Ctx = (g.__MH_STORE_CTX__ ??= createContext<Store | null>(null))

let toastSeq = 1

function viewFromPath(pathname: string): string {
  if (pathname === "/login") return "login"
  if (pathname === "/register") return "register"
  if (pathname === "/vendor/login") return "vendor-login"
  if (pathname === "/vendor/register") return "vendor-register"
  if (pathname === "/admin/login") return "admin-login"
  return "landing"
}

function pathForView(view: string): string {
  if (view === "login") return "/login"
  if (view === "register") return "/register"
  if (view === "vendor-login") return "/vendor/login"
  if (view === "vendor-register") return "/vendor/register"
  if (view === "admin-login") return "/admin/login"
  return "/"
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("customer")
  const [loggedIn, setLoggedIn] = useState(false)
  const [nav, setNav] = useState<Nav>(() => ({ view: viewFromPath(typeof window === "undefined" ? "/" : window.location.pathname) }))
  const [history, setHistory] = useState<Nav[]>([])
  const [vendorAccess, setVendorAccess] = useState<VendorAccess>("approved")
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS)
  const [inventory, setInventory] = useState<Inventory[]>(INVENTORY)
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [cart, setCart] = useState<CartLine[]>([{ product_id: 6, quantity: 1 }, { product_id: 10, quantity: 2 }])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [customer, setCustomer] = useState<Customer>(DEMO_CUSTOMER)
  const [admin, setAdmin] = useState<AdminProfile>({
    name: "Aarav Mehta",
    email: "admin@markethub.in",
    phone: "+91 98200 11223",
    title: "Marketplace Administrator",
    joined_on: "2024-11-02",
  })
  const [avatars, setAvatars] = useState<Partial<Record<Role, string>>>({})

  function updateCustomer(patch: Partial<Customer>) {
    setCustomer((c) => ({ ...c, ...patch }))
  }
  function updateAdmin(patch: Partial<AdminProfile>) {
    setAdmin((a) => ({ ...a, ...patch }))
  }
  function updateVendor(vendorId: number, patch: Partial<Vendor>) {
    setVendors((v) => v.map((x) => (x.vendor_id === vendorId ? { ...x, ...patch } : x)))
  }
  function registerVendor(vendor: Pick<Vendor, "business_name" | "email" | "phone" | "address">) {
    setVendors((current) => [
      ...current,
      {
        ...vendor,
        vendor_id: Math.max(...current.map((item) => item.vendor_id), 0) + 1,
        status: "pending",
        registered_on: new Date().toISOString().slice(0, 10),
        approved_on: null,
        rating: 0,
      },
    ])
  }
  function setAvatar(r: Role, dataUrl: string) {
    setAvatars((a) => ({ ...a, [r]: dataUrl }))
  }

  function toast(message: string, variant: Toast["variant"] = "default") {
    const id = toastSeq++
    setToasts((t) => [...t, { id, message, variant }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }
  function dismissToast(id: number) {
    setToasts((t) => t.filter((x) => x.id !== id))
  }

  function scrollTop() {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function updateUrl(view: string) {
    if (typeof window !== "undefined") window.history.pushState({}, "", pathForView(view))
  }

  function go(view: string, params?: Record<string, string | number>) {
    setHistory((h) => [...h, nav])
    setNav({ view, params })
    updateUrl(view)
    scrollTop()
  }

  function back(fallback?: string) {
    setHistory((h) => {
      if (h.length === 0) {
        if (fallback) {
          setNav({ view: fallback })
          updateUrl(fallback)
        }
        return h
      }
      const previous = h[h.length - 1]
      setNav(previous)
      updateUrl(previous.view)
      return h.slice(0, -1)
    })
    scrollTop()
  }

  function stockOf(productId: number) {
    return inventory.find((i) => i.product_id === productId)?.stock ?? 0
  }

  function addToCart(productId: number, qty = 1) {
    if (stockOf(productId) <= 0) {
      toast("This item is currently out of stock", "warning")
      return
    }
    setCart((c) => {
      const line = c.find((l) => l.product_id === productId)
      if (line) return c.map((l) => (l.product_id === productId ? { ...l, quantity: l.quantity + qty } : l))
      return [...c, { product_id: productId, quantity: qty }]
    })
    toast("Added to cart", "success")
  }
  function setQty(productId: number, qty: number) {
    if (qty <= 0) return removeFromCart(productId)
    setCart((c) => c.map((l) => (l.product_id === productId ? { ...l, quantity: qty } : l)))
  }
  function removeFromCart(productId: number) {
    setCart((c) => c.filter((l) => l.product_id !== productId))
    toast("Removed from cart", "default")
  }
  function clearCart() {
    setCart([])
  }

  function placeOrder(payment: string, address: string): Order {
    const items = cart.map((l) => {
      const p = products.find((x) => x.product_id === l.product_id)!
      return { product_id: p.product_id, name: p.name, vendor_id: p.vendor_id, price: p.price, quantity: l.quantity }
    })
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const num = 24900 + orders.length + Math.floor(Math.random() * 80)
    const order: Order = {
      order_id: `MH-${num}`,
      customer_id: customer.customer_id,
      customer_name: customer.name,
      placed_on: new Date().toISOString().slice(0, 10),
      items,
      total,
      payment_method: payment,
      payment_status: payment === "Cash on Delivery" ? "Pending" : "Paid",
      status: "Confirmed",
      delivery_status: "Processing",
      tracking_number: `MHX${num}0${Math.floor(Math.random() * 900 + 100)}IN`,
      expected_delivery: new Date(Date.now() + 6 * 864e5).toISOString().slice(0, 10),
      address,
    }
    setOrders((o) => [order, ...o])
    // decrement stock
    setInventory((inv) =>
      inv.map((i) => {
        const line = cart.find((l) => l.product_id === i.product_id)
        return line ? { ...i, stock: Math.max(0, i.stock - line.quantity) } : i
      }),
    )
    clearCart()
    return order
  }

  function setVendorStatus(vendorId: number, status: Vendor["status"]) {
    setVendors((v) =>
      v.map((x) =>
        x.vendor_id === vendorId
          ? { ...x, status, approved_on: status === "approved" ? new Date().toISOString().slice(0, 10) : x.approved_on }
          : x,
      ),
    )
  }
  function saveProduct(p: Product) {
    setProducts((prev) => {
      const exists = prev.some((x) => x.product_id === p.product_id)
      return exists ? prev.map((x) => (x.product_id === p.product_id ? p : x)) : [...prev, p]
    })
    setInventory((inv) =>
      inv.some((i) => i.product_id === p.product_id)
        ? inv
        : [...inv, { product_id: p.product_id, stock: 0, low_stock_threshold: 10 }],
    )
  }
  function setStock(productId: number, stock: number) {
    setInventory((inv) => inv.map((i) => (i.product_id === productId ? { ...i, stock } : i)))
  }
  function updateOrderStatus(orderId: string, status: OrderStatus, delivery: DeliveryStatus) {
    setOrders((o) => o.map((x) => (x.order_id === orderId ? { ...x, status, delivery_status: delivery } : x)))
  }

  const cartCount = cart.reduce((s, l) => s + l.quantity, 0)

  const value = useMemo<Store>(
    () => ({
      role,
      setRole: (r) => {
        setRole(r)
        setHistory([])
        const next = r === "customer" ? "home" : r === "vendor" ? "v-dashboard" : "a-dashboard"
        setNav({ view: next })
        updateUrl(next)
      },
      loggedIn,
      vendorAccess,
      customer,
      updateCustomer,
      admin,
      updateAdmin,
      updateVendor,
      registerVendor,
      avatars,
      setAvatar,
      login: (r?: Role) => {
        const target = r ?? role
        if (r) setRole(r)
        setLoggedIn(true)
        setHistory([])
        const next = target === "customer" ? "home" : target === "vendor" ? (vendorAccess === "approved" ? "v-dashboard" : `v-${vendorAccess}`) : "a-dashboard"
        setNav({ view: next })
        updateUrl(next)
      },
      authenticate: (target, email, password) => {
        if (!email.trim() || !password.trim()) return "pending"
        if (target === "vendor") {
          const vendor = vendors.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
          if (!vendor) return "invalid"
          const access = vendor.status
          setVendorAccess(access)
          setRole("vendor")
          setLoggedIn(true)
          setHistory([])
          const next = access === "approved" ? "v-dashboard" : `v-${access}`
          setNav({ view: next })
          updateUrl(next)
          return access
        }
        setRole(target)
        setLoggedIn(true)
        setHistory([])
        const next = target === "customer" ? "home" : "a-dashboard"
        setNav({ view: next })
        updateUrl(next)
        return "success"
      },
      logout: () => {
        setLoggedIn(false)
        setRole("customer")
        setHistory([])
        toast("You have been logged out", "default")
        setNav({ view: "landing" })
        updateUrl("landing")
      },
      nav,
      go,
      back,
      canGoBack: history.length > 0,
      products,
      vendors,
      inventory,
      customers: CUSTOMERS,
      orders,
      cart,
      cartCount,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      placeOrder,
      setVendorStatus,
      saveProduct,
      setStock,
      updateOrderStatus,
      toasts,
      toast,
      dismissToast,
      stockOf,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role, loggedIn, nav, history, products, vendors, inventory, orders, cart, toasts, customer, admin, avatars, vendorAccess],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

// Small selectors shared across pages.
export function useProduct(productId: number) {
  const { products } = useStore()
  return products.find((p) => p.product_id === productId)
}
