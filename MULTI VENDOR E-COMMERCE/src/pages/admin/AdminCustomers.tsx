import React, { useState, useEffect } from 'react';
import { Customer, Order } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { Users, Search, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cList, oList] = await Promise.all([
          marketplaceService.getAllCustomers(),
          marketplaceService.getAllOrders(),
        ]);
        setCustomers(cList);
        setOrders(oList);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Customer Directory</h1>
        <p className="text-xs text-[#647070]">
          Registered buyer profiles and address delivery registries
        </p>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search by customer name, email, or city..."
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
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Primary Delivery Address</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {filtered.map(c => {
                const customerOrders = orders.filter(o => o.customer_id === c.customer_id);

                return (
                  <tr key={c.customer_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-3 px-4 font-mono font-bold text-[#172121]">
                      CUST-{c.customer_id.toString().padStart(3, '0')}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#172121]">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-[#0F766E]">{c.email}</td>
                    <td className="py-3 px-4 text-[#647070]">{c.phone}</td>
                    <td className="py-3 px-4 text-[#647070] max-w-[220px] truncate" title={c.address}>
                      {c.address}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#172121]">
                      {customerOrders.length} order(s)
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#647070]">
                      {c.registration_date}
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
