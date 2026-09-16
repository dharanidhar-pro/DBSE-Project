import { useEffect, useState, type ReactNode } from "react"
import { ThemeProvider, useTheme } from "@figma/astraui"
import { StoreProvider, useStore } from "./lib/store"
import SplashCursor from "./components/SplashCursor"
import BootSplash from "./components/BootSplash"
import CustomerHeader from "./components/CustomerHeader"
import DashboardShell from "./components/DashboardShell"
import { Toaster, RoleSwitcher, Footer } from "./components/chrome"
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
import { Login, Register } from "./pages/customer/Auth"
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
  const { role, nav, loggedIn } = useStore()

  // Auth gate: until the user signs in, only the landing + auth screens show.
  if (!loggedIn) {
    return (
      <div className="mh-aurora min-h-screen">
        {nav.view === "login" ? <Login /> : nav.view === "register" ? <Register /> : <Landing />}
      </div>
    )
  }

  if (role === "vendor" || role === "admin") {
    return (
      <DashboardShell>
        <DashboardRoute view={nav.view} />
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
      <RoleSwitcher />
    </Providers>
  )
}
