import React, { useState, useEffect } from 'react';
import { Product, Vendor } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { useToast } from '../../context/ToastContext';
import { Package, Search } from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { showSuccess } = useToast();

  const loadData = async () => {
    try {
      const [prods, vList] = await Promise.all([
        marketplaceService.getAllProductsAdmin(),
        marketplaceService.getAllVendors(),
      ]);
      setProducts(prods);
      setVendors(vList);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (prod: Product) => {
    const nextStatus = prod.product_status === 'Active' ? 'Inactive' : 'Active';
    const updated = { ...prod, product_status: nextStatus as Product['product_status'] };
    await marketplaceService.saveProduct(updated);
    showSuccess(`Product set to ${nextStatus}.`);
    loadData();
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Marketplace Master Catalog</h1>
        <p className="text-xs text-[#647070]">
          Audit SKUs listed by all onboarded sellers and toggle visibility
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search all marketplace products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
          />
          <Search className="w-3.5 h-3.5 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="py-2 px-3 bg-white border border-[#E2E8E6] rounded-lg text-xs font-medium text-[#172121] focus:outline-none focus:border-[#0F766E]"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home & Living</option>
          <option value="Sports">Sports</option>
          <option value="Books">Books</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Listing Price</th>
                <th className="py-3 px-4">Catalog Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {filtered.map(p => {
                const vendor = vendors.find(v => v.vendor_id === p.vendor_id);

                return (
                  <tr key={p.product_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-3 px-4 font-mono font-bold text-[#172121]">
                      PROD-{p.product_id.toString().padStart(3, '0')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#172121]">
                      <div className="flex items-center gap-2.5 max-w-[240px]">
                        <ProductImage
                          productId={p.product_id}
                          category={p.category}
                          productName={p.product_name}
                          size="xs"
                          className="w-9 h-9 shrink-0 rounded"
                        />
                        <span className="truncate">{p.product_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#647070]">{p.category}</td>
                    <td className="py-3 px-4 text-[#0F766E] font-medium">
                      {vendor?.business_name || `Vendor #${p.vendor_id}`}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#172121] tabular-nums">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          p.product_status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {p.product_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[11px] font-semibold hover:underline ${
                          p.product_status === 'Active' ? 'text-[#DC2626]' : 'text-[#0F766E]'
                        }`}
                      >
                        {p.product_status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
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
