import React, { useState, useEffect } from 'react';
import { Product, Order, Vendor, Inventory } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { BarChart3, TrendingUp, IndianRupee, ShoppingBag, Store, AlertTriangle } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [o, p, v, i] = await Promise.all([
        marketplaceService.getAllOrders(),
        marketplaceService.getAllProductsAdmin(),
        marketplaceService.getAllVendors(),
        marketplaceService.getAllInventory(),
      ]);
      setOrders(o);
      setProducts(p);
      setVendors(v);
      setInventory(i);
    };
    fetchData();
  }, []);

  // Category breakdown
  const categoryStats: Record<string, { count: number; totalVal: number }> = {};
  for (const p of products) {
    if (!categoryStats[p.category]) categoryStats[p.category] = { count: 0, totalVal: 0 };
    categoryStats[p.category].count++;
    categoryStats[p.category].totalVal += p.price;
  }

  // Stock health
  const lowStock = inventory.filter(i => i.quantity < 10);
  const totalStockUnits = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const totalGMV = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Marketplace Analytical Reports</h1>
        <p className="text-xs text-[#647070]">
          Aggregated DBMS metrics across categories, merchant performance, and stock health
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <span className="text-xs text-[#647070]">Platform Gross Merchandise Value</span>
          <div className="text-2xl font-bold text-[#172121] tabular-nums">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#0F766E] font-medium">100% Verified Transactions</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <span className="text-xs text-[#647070]">Total Units in Indian Warehouses</span>
          <div className="text-2xl font-bold text-[#172121] tabular-nums">
            {totalStockUnits.toLocaleString('en-IN')} Units
          </div>
          <span className="text-[11px] text-[#0F766E] font-medium">Across {products.length} SKUs</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-1 shadow-xs">
          <span className="text-xs text-[#647070]">SKUs Requiring Restock</span>
          <div className="text-2xl font-bold text-amber-700 tabular-nums">
            {lowStock.length} SKUs
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Stock below 10 units</span>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-sm text-[#172121]">Category Distribution & Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(categoryStats).map(([cat, stat]) => (
            <div key={cat} className="p-3.5 rounded-xl border border-[#E2E8E6] bg-[#FAFCFB] space-y-1 text-xs">
              <span className="font-bold text-[#0F766E] block">{cat}</span>
              <p className="text-[#647070]">{stat.count} Active SKUs</p>
              <p className="font-semibold text-[#172121] tabular-nums text-sm">
                Avg: ₹{Math.round(stat.totalVal / stat.count).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Fulfillment Audit */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-sm text-[#172121]">Merchant Fulfillment Compliance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Merchant Name</th>
                <th className="py-2.5 px-3">City & Region</th>
                <th className="py-2.5 px-3">Approval Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Catalog Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {vendors.map(v => {
                const vendorProds = products.filter(p => p.vendor_id === v.vendor_id);

                return (
                  <tr key={v.vendor_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-2.5 px-3 font-semibold text-[#172121]">{v.business_name}</td>
                    <td className="py-2.5 px-3 text-[#647070] max-w-[200px] truncate">{v.business_address}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#647070]">{v.approved_date || 'N/A'}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          v.approval_status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {v.approval_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#172121]">
                      {vendorProds.length} Products
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
