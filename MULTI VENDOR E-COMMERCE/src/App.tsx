import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { StoreLayout } from './components/layout/StoreLayout';
import { CustomerRoute, VendorRoute, AdminRoute } from './components/auth/RouteGuards';

// Public & Customer Pages
import { HomePage } from './pages/customer/Home';
import { ShopPage } from './pages/customer/Shop';
import { SearchPage } from './pages/customer/Search';
import { ProductDetailPage } from './pages/customer/ProductDetail';
import { CartPage } from './pages/customer/Cart';
import { CheckoutPage } from './pages/customer/Checkout';
import { OrdersPage } from './pages/customer/Orders';
import { OrderDetailPage } from './pages/customer/OrderDetail';
import { WishlistPage } from './pages/customer/Wishlist';
import { AccountPage } from './pages/customer/Account';

// Auth Pages
import { CustomerLogin } from './pages/auth/CustomerLogin';
import { CustomerRegister } from './pages/auth/CustomerRegister';
import { VendorLogin } from './pages/auth/VendorLogin';
import { VendorRegister } from './pages/auth/VendorRegister';
import { VendorApprovalStatus } from './pages/auth/VendorApprovalStatus';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AccessDenied } from './pages/auth/AccessDenied';

// Vendor Pages
import { VendorLayout } from './pages/vendor/VendorLayout';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { VendorProducts } from './pages/vendor/VendorProducts';
import { VendorInventory } from './pages/vendor/VendorInventory';
import { VendorOrders } from './pages/vendor/VendorOrders';
import { VendorProfile } from './pages/vendor/VendorProfile';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVendors } from './pages/admin/AdminVendors';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminReports } from './pages/admin/AdminReports';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <CartWishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* Public & Customer Shopping Routes (with StoreLayout) */}
                <Route element={<StoreLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Public Customer Auth */}
                  <Route path="/login" element={<CustomerLogin />} />
                  <Route path="/register" element={<CustomerRegister />} />

                  {/* Public Vendor Auth */}
                  <Route path="/vendor/login" element={<VendorLogin />} />
                  <Route path="/vendor/register" element={<VendorRegister />} />
                  <Route path="/vendor/approval-status" element={<VendorApprovalStatus />} />

                  {/* Private Admin Auth Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected Customer Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <CustomerRoute>
                        <CheckoutPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <CustomerRoute>
                        <OrdersPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <CustomerRoute>
                        <OrderDetailPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <CustomerRoute>
                        <WishlistPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <CustomerRoute>
                        <AccountPage />
                      </CustomerRoute>
                    }
                  />

                  {/* Access Denied */}
                  <Route path="/access-denied" element={<AccessDenied />} />
                </Route>

                {/* Protected Vendor Workspace Routes */}
                <Route
                  path="/vendor"
                  element={
                    <VendorRoute>
                      <VendorLayout />
                    </VendorRoute>
                  }
                >
                  <Route index element={<Navigate to="/vendor/dashboard" replace />} />
                  <Route path="dashboard" element={<VendorDashboard />} />
                  <Route path="products" element={<VendorProducts />} />
                  <Route path="inventory" element={<VendorInventory />} />
                  <Route path="orders" element={<VendorOrders />} />
                  <Route path="profile" element={<VendorProfile />} />
                </Route>

                {/* Protected Admin Console Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="vendors" element={<AdminVendors />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="reports" element={<AdminReports />} />
                </Route>

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartWishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
