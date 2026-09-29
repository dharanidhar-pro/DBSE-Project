import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VendorOrderDetail } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Truck, CheckCircle2, Clock, Edit2 } from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const VendorOrders: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.id || 1;
  const { showSuccess } = useToast();

  const [orders, setOrders] = useState<VendorOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const items = await marketplaceService.getVendorOrders(vendorId);
      setOrders(items);
    } catch (err) {
      console.error('Failed to load vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [vendorId]);

  const handleStatusChange = async (
    vendorOrderId: number,
    newStatus: VendorOrderDetail['delivery_status']
  ) => {
    await marketplaceService.updateDeliveryStatus(vendorOrderId, newStatus);
    showSuccess(`Order status updated to ${newStatus}.`, 'Dispatch Status Updated');
    loadOrders();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Orders & Dispatch Fulfillment</h1>
        <p className="text-xs text-[#647070]">
          Process customer orders, assign Indian tracking numbers, and update delivery milestones
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-3 px-4">Vendor Order #</th>
                <th className="py-3 px-4">Master Order</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {orders.map(o => (
                <tr key={o.vendor_order_id} className="hover:bg-[#F8FAF9]">
                  <td className="py-3 px-4 font-mono font-medium text-[#172121]">
                    VO-{o.vendor_order_id}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#0F766E]">{o.order_id}</td>
                  <td className="py-3 px-4 font-semibold text-[#172121]">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <ProductImage
                        productId={o.product_id}
                        productName={o.product_name}
                        size="xs"
                        className="w-8 h-8 shrink-0 rounded"
                      />
                      <span className="truncate">{o.product_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 tabular-nums">{o.quantity}</td>
                  <td className="py-3 px-4 font-bold text-[#172121] tabular-nums">
                    ₹{o.subtotal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        o.payment_status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#647070]">
                    {o.tracking_number}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={o.delivery_status}
                      onChange={e =>
                        handleStatusChange(
                          o.vendor_order_id,
                          e.target.value as VendorOrderDetail['delivery_status']
                        )
                      }
                      className="py-1 px-2 border border-[#E2E8E6] rounded text-xs bg-white text-[#172121] font-medium focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
