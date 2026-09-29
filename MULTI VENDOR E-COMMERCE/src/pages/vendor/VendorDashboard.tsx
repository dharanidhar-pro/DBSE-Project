import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Product, Inventory, VendorOrderDetail } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.id || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [orders, setOrders] = useState<VendorOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const [prods, invs, ords] = await Promise.all([
          marketplaceService.getProducts({ vendorId }),
          marketplaceService.getVendorInventory(vendorId),
          marketplaceService.getVendorOrders(vendorId),
        ]);
        setProducts(prods);
        setInventory(invs);
        setOrders(ords);
      } catch (err) {
        console.error('Error loading vendor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [vendorId]);

  const totalSales = orders
    .filter(o => o.payment_status === 'Paid' || o.delivery_status === 'Delivered')
    .reduce((sum, o) => sum + o.subtotal, 0);

  const lowStockCount = inventory.filter(i => i.quantity < 10).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Merchant Overview</h1>
        <p className="text-xs text-[#647070]">
          Real-time performance metrics for <strong className="text-[#172121]">{user?.business_name || 'Your Store'}</strong>
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Gross Sales</span>
            <div className="p-2 rounded-lg bg-teal-50 text-[#0F766E]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172121] tabular-nums">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#0F766E] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Settled via Direct Bank Transfer
          </span>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Assigned Orders</span>
            <div className="p-2 rounded-lg bg-teal-50 text-[#0F766E]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172121] tabular-nums">
            {orders.length}
          </div>
          <span className="text-[11px] text-[#647070]">
            {orders.filter(o => o.delivery_status !== 'Delivered').length} in active fulfillment
          </span>
        </div>

        {/* Card 3: Active Products */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Active SKUs</span>
            <div className="p-2 rounded-lg bg-teal-50 text-[#0F766E]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172121] tabular-nums">
            {products.length}
          </div>
          <span className="text-[11px] text-[#647070]">Listed in marketplace catalog</span>
        </div>

        {/* Card 4: Inventory Alerts */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Low Stock Alerts</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172121] tabular-nums">
            {lowStockCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            {lowStockCount > 0 ? 'Requires immediate restock' : 'Inventory healthy'}
          </span>
        </div>
      </div>

      {/* Recent Vendor Orders */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
          <div>
            <h2 className="font-bold text-sm text-[#172121]">Recent Customer Orders</h2>
            <p className="text-xs text-[#647070]">Customer purchases awaiting packaging and dispatch</p>
          </div>
          <Link
            to="/vendor/orders"
            className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <span>All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#647070]">
            No customer orders received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8E6] text-[#647070] font-semibold">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Subtotal</th>
                  <th className="pb-2">Payment</th>
                  <th className="pb-2">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E6]/60">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.vendor_order_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-2.5 font-mono text-[#0F766E] font-medium">{o.order_id}</td>
                    <td className="py-2.5 font-medium text-[#172121] max-w-[200px] truncate">
                      {o.product_name}
                    </td>
                    <td className="py-2.5">{o.quantity}</td>
                    <td className="py-2.5 font-semibold text-[#172121] tabular-nums">
                      ₹{o.subtotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 text-[#647070]">{o.payment_method}</td>
                    <td className="py-2.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          o.delivery_status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800'
                            : o.delivery_status === 'Shipped'
                            ? 'bg-teal-50 text-[#0F766E]'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {o.delivery_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
