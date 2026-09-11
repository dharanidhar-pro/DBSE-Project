import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  CUSTOMERS,
  DEMO_CUSTOMER,
  DEMO_VENDOR_ID,
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

type Store = {
  role: Role
  setRole: (r: Role) => void
  loggedIn: boolean
  customer: Customer
  updateCustomer: (patch: Partial<Customer>) => void
  admin: AdminProfile
  updateAdmin: (patch: Partial<AdminProfile>) => void
  updateVendor: (vendorId: number, patch: Partial<Vendor>) => void
  avatars: Partial<Record<Role, string>>
  setAvatar: (role: Role, dataUrl: string) => void
  login: (role?: Role) => void
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("customer")
  const [loggedIn, setLoggedIn] = useState(false)
  const [nav, setNav] = useState<Nav>({ view: "landing" })
  const [history, setHistory] = useState<Nav[]>([])
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

  function go(view: string, params?: Record<string, string | number>) {
    setHistory((h) => [...h, nav])
    setNav({ view, params })
    scrollTop()
  }

  function back(fallback?: string) {
    setHistory((h) => {
      if (h.length === 0) {
        if (fallback) setNav({ view: fallback })
        return h
      }
      setNav(h[h.length - 1])
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
        setNav({ view: r === "customer" ? "home" : r === "vendor" ? "v-dashboard" : "a-dashboard" })
      },
      loggedIn,
      customer,
      updateCustomer,
      admin,
      updateAdmin,
      updateVendor,
      avatars,
      setAvatar,
      login: (r?: Role) => {
        const target = r ?? role
        if (r) setRole(r)
        setLoggedIn(true)
        setHistory([])
        setNav({ view: target === "customer" ? "home" : target === "vendor" ? "v-dashboard" : "a-dashboard" })
      },
      logout: () => {
        setLoggedIn(false)
        setRole("customer")
        setHistory([])
        toast("You have been logged out", "default")
        setNav({ view: "landing" })
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
    [role, loggedIn, nav, history, products, vendors, inventory, orders, cart, toasts, customer, admin, avatars],
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
