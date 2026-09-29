import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order, VendorOrderDetail } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { marketplaceService } from '../../services/api/marketplaceService';
import { getVendorOrderDetailsForOrder } from '../../services/storage';
import { Package, Truck, ArrowRight } from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState<Record<string, VendorOrderDetail[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const list = await marketplaceService.getCustomerOrders(user.id);
        setOrders(list);

        const map: Record<string, VendorOrderDetail[]> = {};
        for (const o of list) {
          map[o.order_id] = getVendorOrderDetailsForOrder(o.order_id);
        }
        setOrderDetailsMap(map);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'Delivered':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">Delivered</span>;
      case 'Shipped':
      case 'Out for Delivery':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">{status}</span>;
      case 'Confirmed':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">Confirmed</span>;
      case 'Cancelled':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-[#DC2626] border border-rose-200">Cancelled</span>;
      default:
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">Processing</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">My Orders</h1>
        <p className="text-xs text-[#647070]">
          Track fulfillment status, delivery dispatches, and invoices
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-36 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8E6] p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#647070]">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#172121]">No orders placed yet</h2>
          <p className="text-xs text-[#647070] max-w-sm mx-auto">
            When you purchase items from verified Indian sellers on MarketHub, your orders and tracking details will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const items = orderDetailsMap[order.order_id] || [];

            return (
              <div
                key={order.order_id}
                className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-4 shadow-xs hover:border-[#CBD5D1] transition-all"
              >
                {/* Header row: Order ID, Date, Amount, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8E6] gap-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[11px] text-[#647070] block">Order Reference</span>
                      <span className="font-mono font-bold text-xs text-[#172121]">{order.order_id}</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div>
                      <span className="text-[11px] text-[#647070] block">Order Date</span>
                      <span className="text-xs text-[#172121] font-medium">{order.order_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-[#647070] block">Order Total</span>
                      <span className="text-xs font-bold text-[#172121] tabular-nums">
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.order_status)}</div>
                  </div>
                </div>

                {/* Multi-Vendor Items preview */}
                <div className="space-y-2 text-xs">
                  {items.map(item => (
                    <div
                      key={item.vendor_order_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 rounded-lg bg-[#F8FAF9] gap-3"
                    >
                      <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                        <ProductImage
                          productId={item.product_id}
                          productName={item.product_name}
                          size="xs"
                          className="w-10 h-10 shrink-0 rounded"
                        />
                        <div className="truncate">
                          <span className="font-semibold text-[#172121] truncate block">{item.product_name}</span>
                          <span className="text-[11px] text-[#0F766E]">
                            Sold by {item.business_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] shrink-0">
                        <span className="text-[#647070]">Qty: {item.quantity}</span>
                        <span className="font-semibold text-[#172121] tabular-nums">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </span>
                        <span className="font-mono text-[#647070] text-[10px]">
                          {item.tracking_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer action */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#647070] truncate max-w-sm">
                    Delivering to: {order.delivery_address}
                  </span>

                  <Link
                    to={`/orders/${order.order_id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
