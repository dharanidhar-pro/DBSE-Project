import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vendor, Customer, Product, Order } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showSuccess } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [v, c, p, o] = await Promise.all([
        marketplaceService.getAllVendors(),
        marketplaceService.getAllCustomers(),
        marketplaceService.getAllProductsAdmin(),
        marketplaceService.getAllOrders(),
      ]);
      setVendors(v);
      setCustomers(c);
      setProducts(p);
      setOrders(o);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (vendorId: number) => {
    await marketplaceService.setVendorStatus(vendorId, 'Approved');
    showSuccess('Vendor approved. Store is now activated for selling.', 'Vendor Approved');
    loadData();
  };

  const handleReject = async (vendorId: number) => {
    await marketplaceService.setVendorStatus(vendorId, 'Rejected');
    showSuccess('Vendor application rejected.', 'Vendor Rejected');
    loadData();
  };

  const totalGMV = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingVendors = vendors.filter(v => v.approval_status === 'Pending');

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Marketplace Operations Console</h1>
        <p className="text-xs text-[#647070]">
          Centralized governance for multi-vendor transactions, catalog audit, and merchant verifications
        </p>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* GMV */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Gross GMV</span>
            <IndianRupee className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-xl font-extrabold text-[#172121] tabular-nums">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#0F766E] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Across {orders.length} orders
          </span>
        </div>

        {/* Vendors */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Total Vendors</span>
            <Store className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-xl font-extrabold text-[#172121] tabular-nums">
            {vendors.length}
          </div>
          <span className="text-[10px] text-[#647070]">
            {vendors.filter(v => v.approval_status === 'Approved').length} approved & selling
          </span>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Active Customers</span>
            <Users className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-xl font-extrabold text-[#172121] tabular-nums">
            {customers.length}
          </div>
          <span className="text-[10px] text-[#647070]">Registered buyer accounts</span>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Catalog Items</span>
            <Package className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-xl font-extrabold text-[#172121] tabular-nums">
            {products.length}
          </div>
          <span className="text-[10px] text-[#647070]">5 active categories</span>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#647070]">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700 tabular-nums">
            {pendingVendors.length}
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Awaiting decision</span>
        </div>
      </div>

      {/* Pending Vendor Approval Action Queue */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
          <div>
            <h2 className="font-bold text-sm text-[#172121]">Vendor Approval Queue</h2>
            <p className="text-xs text-[#647070]">
              Merchants awaiting administrative review before marketplace access is granted
            </p>
          </div>
          <Link
            to="/admin/vendors"
            className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <span>Manage All Vendors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingVendors.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#647070]">
            No pending vendor applications at this time. All onboarded merchants are verified.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingVendors.map(v => (
              <div
                key={v.vendor_id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172121] text-sm">{v.business_name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Pending Approval
                    </span>
                  </div>
                  <div className="text-[11px] text-[#647070] mt-1 space-x-2">
                    <span>{v.email}</span>
                    <span>·</span>
                    <span>{v.phone}</span>
                    <span>·</span>
                    <span>Applied on: {v.registration_date}</span>
                  </div>
                  <p className="text-[11px] text-[#647070] mt-0.5">{v.business_address}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(v.vendor_id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleReject(v.vendor_id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#DC2626] border border-rose-200 text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Platform Orders Table */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
          <div>
            <h2 className="font-bold text-sm text-[#172121]">Recent Marketplace Orders</h2>
            <p className="text-xs text-[#647070]">Customer purchases across all merchant fulfillment centers</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <span>Master Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {orders.slice(0, 5).map(o => (
                <tr key={o.order_id} className="hover:bg-[#F8FAF9]">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0F766E]">{o.order_id}</td>
                  <td className="py-2.5 px-3 font-medium text-[#172121]">
                    {o.customer_name || `Customer #${o.customer_id}`}
                  </td>
                  <td className="py-2.5 px-3 text-[#647070]">{o.order_date}</td>
                  <td className="py-2.5 px-3 font-bold text-[#172121] tabular-nums">
                    ₹{o.total_amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">
                      {o.order_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
