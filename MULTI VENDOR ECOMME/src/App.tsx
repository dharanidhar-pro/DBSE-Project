import { useEffect, useState, type ReactNode } from "react"
import { ThemeProvider, useTheme } from "@figma/astraui"
import { StoreProvider, useStore } from "./lib/store"
import SplashCursor from "./components/SplashCursor"
import BootSplash from "./components/BootSplash"
import CustomerHeader from "./components/CustomerHeader"
import DashboardShell from "./components/DashboardShell"
import { Toaster, Footer } from "./components/chrome"
import { BackButton } from "./components/common"

import Home from "./pages/customer/Home"
import Shop from "./pages/customer/Shop"
import Product from "./pages/customer/Product"
import Cart from "./pages/customer/Cart"
import Checkout from "./pages/customer/Checkout"
import Confirmation from "./pages/customer/Confirmation"
import Orders from "./pages/customer/Orders"
import OrderDetail from "./pages/customer/OrderDetail"
import Tracking from "./pages/customer/Tracking"
import Profile from "./pages/customer/Profile"
import { AdminLogin, Login, Register, VendorLogin, VendorRegister } from "./pages/customer/Auth"
import Landing from "./pages/Landing"

import {
  VendorDashboard,
  VendorProducts,
  VendorInventory,
  VendorOrders,
  VendorOrderDetail,
  VendorProfile,
  VendorSettings,
} from "./pages/vendor/Vendor"

import {
  AdminDashboard,
  AdminVendors,
  AdminCustomers,
  AdminProducts,
  AdminOrders,
  AdminReports,
  AdminProfile,
  AdminSettings,
} from "./pages/admin/Admin"

function CustomerRoute({ view }: { view: string }) {
  switch (view) {
    case "shop":
    case "search":
    case "category":
      return <Shop />
    case "product":
      return <Product />
    case "cart":
      return <Cart />
    case "checkout":
      return <Checkout />
    case "confirmation":
      return <Confirmation />
    case "orders":
      return <Orders />
    case "order":
      return <OrderDetail />
    case "tracking":
      return <Tracking />
    case "profile":
      return <Profile />
    case "login":
      return <Login />
    case "register":
      return <Register />
    case "vendor-login":
      return <VendorLogin />
    case "vendor-register":
      return <VendorRegister />
    case "admin-login":
      return <AdminLogin />
    default:
      return <Home />
  }
}

function DashboardRoute({ view }: { view: string }) {
  switch (view) {
    // Vendor
    case "v-products":
      return <VendorProducts />
    case "v-inventory":
      return <VendorInventory />
    case "v-orders":
      return <VendorOrders />
    case "v-order":
      return <VendorOrderDetail />
    case "v-profile":
      return <VendorProfile />
    case "v-settings":
      return <VendorSettings />
    case "v-dashboard":
      return <VendorDashboard />
    // Admin
    case "a-vendors":
      return <AdminVendors />
    case "a-customers":
      return <AdminCustomers />
    case "a-products":
      return <AdminProducts />
    case "a-orders":
      return <AdminOrders />
    case "a-reports":
      return <AdminReports />
    case "a-profile":
      return <AdminProfile />
    case "a-settings":
      return <AdminSettings />
    default:
      return <AdminDashboard />
  }
}

function Shell() {
  const { role, nav, loggedIn, vendorAccess, logout } = useStore()

  // Auth gate: until the user signs in, only the landing + auth screens show.
  if (!loggedIn) {
    return (
      <div className="mh-aurora min-h-screen">
        {nav.view === "login" ? <Login /> : nav.view === "register" ? <Register /> : nav.view === "vendor-login" ? <VendorLogin /> : nav.view === "vendor-register" ? <VendorRegister /> : nav.view === "admin-login" ? <AdminLogin /> : <Landing />}
      </div>
    )
  }

  if (role === "vendor" || role === "admin") {
    if (role === "vendor" && vendorAccess !== "approved") {
      return <VendorAccessGate status={vendorAccess} logout={logout} />
    }
    const safeView = role === "vendor" && nav.view.startsWith("a-") ? "v-dashboard" : role === "admin" && nav.view.startsWith("v-") ? "a-dashboard" : nav.view
    return (
      <DashboardShell>
        <DashboardRoute view={safeView} />
      </DashboardShell>
    )
  }

  // Auth screens render standalone (no storefront chrome).
  const isAuth = nav.view === "login" || nav.view === "register"
  return (
    <div className="mh-aurora flex min-h-screen flex-col">
      {!isAuth && <CustomerHeader />}
      <main className="flex-1">
        {!isAuth && nav.view !== "home" && (
          <div className="mx-auto max-w-360 px-xl pt-lg lg:px-2xl">
            <BackButton fallback="home" />
          </div>
        )}
        <CustomerRoute view={nav.view} />
      </main>
      {!isAuth && <Footer />}
    </div>
  )
}

function VendorAccessGate({ status, logout }: { status: "pending" | "rejected"; logout: () => void }) {
  const pending = status === "pending"
  return (
    <div className="mh-aurora flex min-h-screen items-center justify-center px-xl py-2xl">
      <div className="mh-glass mh-spatial w-full max-w-md rounded-corner-lg p-2xl text-center">
        <h1 className="text-title text-text-primary">{pending ? "Vendor approval pending" : "Vendor access denied"}</h1>
        <p className="mt-md text-label-sm leading-relaxed text-text-secondary">
          {pending ? "Your vendor account is awaiting admin approval. You will be able to access the Seller Center once your application is approved." : "Your vendor application was rejected. Please contact MarketHub support for more information."}
        </p>
        <button type="button" onClick={logout} className="mt-xl rounded-corner-full border border-border-secondary bg-surface-bg px-lg py-md text-label-sm font-medium text-text-primary hover:bg-bg-hover">
          Log out
        </button>
      </div>
    </div>
  )
}

function ThemeInitializer() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("dark")
  }, [setTheme])

  return null
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeInitializer />
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  )
}

export default function App() {
  // Branded boot loader on refresh: hold briefly, fade, then unmount.
  const [booting, setBooting] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 900)
    const done = setTimeout(() => setBooting(false), 1300)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
    }
  }, [])

  return (
    <Providers>
      {booting && <BootSplash fading={fading} />}
      <SplashCursor />
      <Shell />
      <Toaster />
    </Providers>
  )
}
