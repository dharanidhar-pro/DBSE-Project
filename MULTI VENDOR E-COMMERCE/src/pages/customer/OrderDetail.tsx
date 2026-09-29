import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, VendorOrderDetail } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import {
  cancelOrderCustomer,
  requestOrderReturnCustomer,
} from '../../services/marketplaceFeatures';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  MapPin,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Package,
} from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<VendorOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Cancel & Return Modals
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found a better price / changed mind');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Item quality or fit issue');

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { order: o, items: itms } = await marketplaceService.getOrderDetails(id);
      if (o) setOrder(o);
      setItems(itms);
    } catch (err) {
      console.error('Failed to load order detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleConfirmCancel = () => {
    if (!order) return;
    const success = cancelOrderCustomer(order.order_id, cancelReason);
    if (success) {
      showSuccess(`Order ${order.order_id} has been cancelled.`, 'Order Cancelled');
      setIsCancelModalOpen(false);
      fetchOrder();
    } else {
      showError('Unable to cancel this order.');
    }
  };

  const handleConfirmReturn = () => {
    if (!order) return;
    const success = requestOrderReturnCustomer(order.order_id, returnReason);
    if (success) {
      showSuccess(`Return pickup requested for order ${order.order_id}.`, 'Return Requested');
      setIsReturnModalOpen(false);
      fetchOrder();
    } else {
      showError('Unable to request return for this order.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#172121]">Order not found</h2>
        <p className="text-xs text-[#647070]">No order exists with ID {id}.</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Orders</span>
        </Link>
      </div>
    );
  }

  // 6-step timeline per Requirement 7
  const isCancelled = order.order_status === 'Cancelled' || order.order_status === 'Cancellation Requested';
  const isReturnFlow = order.order_status === 'Return Requested' || order.order_status === 'Return Approved';

  const steps = [
    { label: 'Order Placed', desc: `Received on ${order.order_date}`, done: true },
    {
      label: 'Confirmed',
      desc: 'Seller verified inventory & payment',
      done: ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Return Requested', 'Return Approved'].includes(order.order_status),
    },
    {
      label: 'Packed',
      desc: 'Carefully packaged at fulfillment hub',
      done: ['Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Return Requested', 'Return Approved'].includes(order.order_status),
    },
    {
      label: 'Shipped',
      desc: 'Handed over to Indian express logistics',
      done: ['Shipped', 'Out for Delivery', 'Delivered', 'Return Requested', 'Return Approved'].includes(order.order_status),
    },
    {
      label: 'Out for Delivery',
      desc: 'Courier executive dispatched to doorstep',
      done: ['Out for Delivery', 'Delivered', 'Return Requested', 'Return Approved'].includes(order.order_status),
    },
    {
      label: 'Delivered',
      desc: 'Handed over with OTP verification',
      done: ['Delivered', 'Return Requested', 'Return Approved'].includes(order.order_status),
    },
  ];

  // Eligibility for cancel / return (Requirement 8)
  const isCancellable = ['Pending', 'Confirmed', 'Packed'].includes(order.order_status);
  const isReturnable = order.order_status === 'Delivered';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8E6] gap-3">
        <div className="flex items-center gap-2">
          <Link to="/orders" className="p-1 rounded-lg hover:bg-slate-100 text-[#647070]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#172121]">
              Order <span className="font-mono text-[#0F766E]">{order.order_id}</span>
            </h1>
            <p className="text-xs text-[#647070]">Placed on {order.order_date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Status Badge */}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded border ${
              isCancelled
                ? 'bg-rose-50 text-[#DC2626] border-rose-200'
                : isReturnFlow
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : order.order_status === 'Delivered'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-teal-50 text-[#0F766E] border-teal-200'
            }`}
          >
            Status: {order.order_status}
          </span>

          {/* Cancellation CTA */}
          {isCancellable && (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3 py-1 text-xs font-semibold text-[#DC2626] bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          )}

          {/* Return CTA */}
          {isReturnable && (
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(true)}
              className="px-3 py-1 text-xs font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer"
            >
              Request Return
            </button>
          )}
        </div>
      </div>

      {/* Cancellation / Refund Alert Strip */}
      {isCancelled && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Order Cancelled</p>
            <p className="leading-relaxed">
              Reason: {order.cancellation_reason || 'Buyer requested cancellation'}.
            </p>
            <div className="pt-1 flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Refund Status: Refund Completed to original payment method (₹{order.total_amount.toLocaleString('en-IN')})</span>
            </div>
          </div>
        </div>
      )}

      {/* Return Flow Alert Strip */}
      {isReturnFlow && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Return & Refund in Progress</p>
            <p className="leading-relaxed">
              Reason: {order.return_reason || 'Customer requested reverse pickup'}.
            </p>
            <div className="pt-1 flex items-center gap-2 text-amber-800 font-semibold">
              <Clock className="w-4 h-4" />
              <span>Doorstep reverse pickup scheduled within 24–48 hours. Refund Status: {order.refund_status || 'Refund Processing'}.</span>
            </div>
          </div>
        </div>
      )}

      {/* Professional Order Tracking Timeline (Requirement 7) */}
      {!isCancelled && (
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#172121]">Live Tracking Timeline</h2>
            <span className="text-[11px] text-[#647070]">Carrier: Express Indian Logistics</span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8E6]">
            {steps.map((s, idx) => {
              const isCurrent = s.done && (idx === steps.length - 1 || !steps[idx + 1].done);

              return (
                <div key={s.label} className="relative flex items-start gap-4">
                  {/* Dot / Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                      isCurrent
                        ? 'bg-[#F26B5E] ring-4 ring-[#F26B5E]/20'
                        : s.done
                        ? 'bg-[#0F766E]'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <p
                      className={`font-semibold text-xs ${
                        isCurrent ? 'text-[#F26B5E]' : s.done ? 'text-[#0F766E]' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="text-[11px] text-[#647070]">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Multi-Vendor Consignment Details */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
          <h2 className="font-bold text-sm text-[#172121]">Consignment & Seller Details</h2>
          <span className="text-[11px] text-[#647070]">{items.length} Package(s)</span>
        </div>

        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.vendor_order_id}
              className="p-4 rounded-xl border border-[#E2E8E6] bg-[#FAFCFB] space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E6]/60 pb-3">
                <div className="flex items-center gap-3">
                  <ProductImage
                    productId={item.product_id}
                    productName={item.product_name}
                    size="xs"
                    className="w-12 h-12 shrink-0 rounded-lg"
                  />
                  <div>
                    <span className="font-semibold text-[#172121] text-sm block">{item.product_name}</span>
                    <p className="text-[11px] text-[#0F766E]">Sold by {item.business_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-[#E2E8E6] text-[#172121]">
                    AWB: {item.tracking_number}
                  </span>
                  <span className="text-[11px] font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {item.delivery_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-[#647070] block">Quantity:</span>
                  <span className="font-semibold text-[#172121]">{item.quantity}</span>
                </div>
                <div>
                  <span className="text-[#647070] block">Price:</span>
                  <span className="font-semibold text-[#172121] tabular-nums">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[#647070] block">Payment:</span>
                  <span className="font-semibold text-[#172121]">{item.payment_method}</span>
                </div>
                <div>
                  <span className="text-[#647070] block">Subtotal:</span>
                  <span className="font-bold text-[#172121] tabular-nums">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination & Invoice Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-2 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold text-[#172121]">
            <MapPin className="w-4 h-4 text-[#0F766E]" />
            <span>Delivery Destination</span>
          </div>
          <p className="text-[#172121] font-semibold pt-1">
            {order.customer_name || 'Customer'} {order.customer_phone ? `(${order.customer_phone})` : ''}
          </p>
          <p className="text-[#647070] leading-relaxed">{order.delivery_address}</p>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-2 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold text-[#172121]">
            <CreditCard className="w-4 h-4 text-[#0F766E]" />
            <span>Payment Summary</span>
          </div>
          <div className="pt-1 space-y-1.5 text-[#647070]">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-[#172121] tabular-nums">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </span>
            </div>
            {order.discount_amount && order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Savings ({order.coupon_code || 'PROMO'}):</span>
                <span className="tabular-nums">-₹{order.discount_amount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Indian Express Shipping:</span>
              <span className="font-semibold text-[#0F766E]">FREE</span>
            </div>
            <div className="pt-2 border-t border-[#E2E8E6] flex justify-between font-bold text-sm text-[#172121]">
              <span>Total Invoice Amount:</span>
              <span className="text-[#172121] tabular-nums">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8E6] max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-[#172121]">Cancel Order #{order.order_id}</h3>
            <p className="text-xs text-[#647070]">
              Are you sure you want to cancel this order? Any payments will be instantly refunded to your original payment method.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#172121]">Reason for cancellation:</label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg bg-white"
              >
                <option value="Found a better price / changed mind">Found a better price / changed mind</option>
                <option value="Ordered by mistake / wrong item">Ordered by mistake / wrong item</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Want to change delivery address">Want to change delivery address</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#E2E8E6] flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 border border-[#E2E8E6] rounded-lg text-[#647070] cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 font-semibold text-white bg-[#DC2626] hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8E6] max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-[#172121]">Request 7-Day Return & Refund</h3>
            <p className="text-xs text-[#647070]">
              Our logistics partner will arrange a doorstep reverse pickup from your registered Indian delivery address.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#172121]">Reason for return:</label>
              <select
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg bg-white"
              >
                <option value="Item quality or fit issue">Item quality or fit issue</option>
                <option value="Defective or damaged during transit">Defective or damaged during transit</option>
                <option value="Received incorrect product variant">Received incorrect product variant</option>
                <option value="Product not as described on marketplace">Product not as described on marketplace</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#E2E8E6] flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="px-4 py-2 border border-[#E2E8E6] rounded-lg text-[#647070] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-4 py-2 font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
              >
                Request Reverse Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
