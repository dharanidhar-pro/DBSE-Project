import React, { useState, useEffect } from 'react';
import { Order, VendorOrderDetail } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { getVendorOrderDetailsForOrder } from '../../services/storage';
import { ShoppingBag, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState<Record<string, VendorOrderDetail[]>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const list = await marketplaceService.getAllOrders();
        setOrders(list);

        const map: Record<string, VendorOrderDetail[]> = {};
        for (const o of list) {
          map[o.order_id] = getVendorOrderDetailsForOrder(o.order_id);
        }
        setOrderDetailsMap(map);
      } catch (err) {
        console.error('Error loading master orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filtered = orders.filter(
    o =>
      o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      o.delivery_address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Master Orders Ledger</h1>
        <p className="text-xs text-[#647070]">
          Comprehensive record of multi-vendor customer checkouts and individual dispatch consignments
        </p>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search by order ID, customer name, or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
        />
        <Search className="w-3.5 h-3.5 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      <div className="space-y-3">
        {filtered.map(order => {
          const items = orderDetailsMap[order.order_id] || [];
          const isExpanded = expandedOrder === order.order_id;

          return (
            <div
              key={order.order_id}
              className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs text-xs"
            >
              {/* Order Header Row */}
              <div
                onClick={() => toggleExpand(order.order_id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#FAFCFB] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono font-bold text-sm text-[#0F766E]">
                    {order.order_id}
                  </div>
                  <div>
                    <span className="font-semibold text-[#172121]">{order.customer_name || `Cust #${order.customer_id}`}</span>
                    <span className="text-[#647070] text-[11px] block">{order.order_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-[#172121] tabular-nums text-sm">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#647070] block">{items.length} Vendor Item(s)</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      order.order_status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-teal-50 text-[#0F766E] border border-teal-200'
                    }`}
                  >
                    {order.order_status}
                  </span>

                  <button className="text-[#647070]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Vendor Order Details (Relational vendor_order_details table representation) */}
              {isExpanded && (
                <div className="p-4 bg-[#FAFCFB] border-t border-[#E2E8E6] space-y-3">
                  <div className="text-[11px] text-[#647070] font-medium">
                    <span className="text-[#172121] font-semibold">Delivery Destination:</span> {order.delivery_address}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#647070]">
                      Relational Consignments (`vendor_order_details`):
                    </div>
                    {items.map(item => (
                      <div
                        key={item.vendor_order_id}
                        className="bg-white p-3 rounded-lg border border-[#E2E8E6] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <ProductImage
                            productId={item.product_id}
                            productName={item.product_name}
                            size="xs"
                            className="w-10 h-10 shrink-0 rounded"
                          />
                          <div>
                            <span className="font-semibold text-[#172121]">{item.product_name}</span>
                            <div className="text-[11px] text-[#647070]">
                              Merchant: <strong className="text-[#0F766E]">{item.business_name}</strong> · Tracking: <code className="font-mono text-[#172121]">{item.tracking_number}</code>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] shrink-0">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-bold text-[#172121] tabular-nums">
                            ₹{item.subtotal.toLocaleString('en-IN')}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                            {item.payment_method} ({item.payment_status})
                          </span>
                          <span className="font-semibold text-[#0F766E]">
                            {item.delivery_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
