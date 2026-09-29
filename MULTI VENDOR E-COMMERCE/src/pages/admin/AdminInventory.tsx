import React, { useState, useEffect } from 'react';
import { Inventory, Product } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { getProductById } from '../../services/storage';
import { Layers, Search } from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInv = async () => {
      setLoading(true);
      try {
        const list = await marketplaceService.getAllInventory();
        setInventory(list);
      } catch (err) {
        console.error('Error loading inventory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInv();
  }, []);

  const getStockBadge = (qty: number) => {
    if (qty <= 0) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-[#DC2626] border border-rose-200">
          Out of Stock
        </span>
      );
    }
    if (qty < 10) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          Low Stock ({qty})
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">
        In Stock ({qty})
      </span>
    );
  };

  const filtered = inventory.filter(i => {
    const prod = getProductById(i.product_id);
    const prodName = prod?.product_name || '';
    return (
      prodName.toLowerCase().includes(search.toLowerCase()) ||
      i.business_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Global Inventory Ledger</h1>
        <p className="text-xs text-[#647070]">
          Audit stock units, pricing, and replenishment intervals across all merchant fulfillment centers
        </p>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search by product name or merchant..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
        />
        <Search className="w-3.5 h-3.5 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-3 px-4">Inventory ID</th>
                <th className="py-3 px-4">Product Item</th>
                <th className="py-3 px-4">Vendor Entity</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4">Last Audited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {filtered.map(item => {
                const prod = getProductById(item.product_id);

                return (
                  <tr key={item.inventory_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-3 px-4 font-mono font-medium text-[#172121]">
                      INV-{item.inventory_id.toString().padStart(3, '0')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#172121]">
                      <div className="flex items-center gap-2 max-w-[220px]">
                        <ProductImage
                          productId={item.product_id}
                          productName={prod?.product_name || `Product #${item.product_id}`}
                          size="xs"
                          className="w-8 h-8 shrink-0 rounded"
                        />
                        <span className="truncate">{prod?.product_name || `Product #${item.product_id}`}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#0F766E] font-medium">{item.business_name}</td>
                    <td className="py-3 px-4 font-bold text-[#172121] tabular-nums">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-semibold tabular-nums text-[#172121]">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4">{getStockBadge(item.quantity)}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#647070]">
                      {item.last_updated}
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
