import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { marketplaceService } from '../../services/api/marketplaceService';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  IndianRupee,
} from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCartWishlist();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [deliveryData, setDeliveryData] = useState({
    name: user?.name || 'Aarav Sharma',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
  });

  // Sync with user's customized profile data
  useEffect(() => {
    if (user) {
      setDeliveryData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const shippingFee = cartTotal > 999 || cartTotal === 0 ? 0 : 79;
  const grandTotal = cartTotal + shippingFee;

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    setIsPlacing(true);

    try {
      const fullAddress = `${deliveryData.address}, ${deliveryData.city}, ${deliveryData.state} - ${deliveryData.pincode}`;
      const methodLabel =
        paymentMethod === 'UPI'
          ? `UPI (${upiId})`
          : paymentMethod === 'Card'
          ? 'Credit/Debit Card'
          : paymentMethod === 'COD'
          ? 'Cash on Delivery'
          : 'Net Banking';

      const items = cart.map(i => ({
        productId: i.product_id,
        quantity: i.quantity,
      }));

      const newOrder = await marketplaceService.placeOrder({
        customerId: user.id,
        customerName: deliveryData.name,
        customerPhone: deliveryData.phone,
        deliveryAddress: fullAddress,
        paymentMethod: methodLabel,
        items,
      });

      setPlacedOrderId(newOrder.order_id);
      setStep(4);
      showSuccess(`Order ${newOrder.order_id} placed successfully!`, 'Order Confirmed');
    } catch (err) {
      console.error('Order placement error:', err);
    } finally {
      setIsPlacing(false);
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#172121]">Your cart is empty</h2>
        <p className="text-xs text-[#647070]">Please add items to cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Step 4: Order Confirmation per section 22
  if (step === 4 && placedOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-[#E2E8E6] p-8 text-center space-y-6 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0F766E]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Order Confirmed
            </span>
            <h1 className="mt-3 text-2xl font-bold text-[#172121]">Thank you for your order!</h1>
            <p className="text-xs text-[#647070] mt-1">
              Order ID:{' '}
              <strong className="font-mono text-[#172121] text-sm">{placedOrderId}</strong>
            </p>
          </div>

          <div className="bg-[#FAFCFB] rounded-xl border border-[#E2E8E6] p-4 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-[#647070]">Total Paid:</span>
              <span className="font-bold text-[#172121] tabular-nums">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#647070]">Payment Method:</span>
              <span className="font-semibold text-[#172121]">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#647070]">Estimated Delivery:</span>
              <span className="font-semibold text-[#0F766E]">3–5 Business Days (Trackable)</span>
            </div>
            <div className="pt-2 border-t border-[#E2E8E6] text-[#647070]">
              <span className="block font-medium text-[#172121] mb-0.5">Shipping to:</span>
              <span>{deliveryData.name} · {deliveryData.phone}</span>
              <p className="text-[11px] mt-0.5">
                {deliveryData.address}, {deliveryData.city}, {deliveryData.state} - {deliveryData.pincode}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/orders/${placedOrderId}`}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-6 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Live</span>
            </Link>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-[#172121] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>View All Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 4 Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-semibold border-b border-[#E2E8E6] pb-4">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0F766E]' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-[#0F766E] text-white' : 'bg-slate-200'}`}>1</span>
          <span>Delivery</span>
        </div>
        <span className="text-slate-300">———</span>
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0F766E]' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-[#0F766E] text-white' : 'bg-slate-200'}`}>2</span>
          <span>Payment</span>
        </div>
        <span className="text-slate-300">———</span>
        <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#0F766E]' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-[#0F766E] text-white' : 'bg-slate-200'}`}>3</span>
          <span>Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Panels Left */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-6">
          {/* STEP 1: Delivery Address */}
          {step === 1 && (
            <form onSubmit={handleDeliverySubmit} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8E6]">
                <MapPin className="w-4 h-4 text-[#0F766E]" />
                <h2 className="font-bold text-sm text-[#172121]">Step 1: Indian Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172121] mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={deliveryData.name}
                    onChange={e => setDeliveryData({ ...deliveryData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172121] mb-1">Phone Number (SMS updates) *</label>
                  <input
                    type="tel"
                    required
                    value={deliveryData.phone}
                    onChange={e => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172121] mb-1">Street Address, Flat / House No. *</label>
                <textarea
                  rows={2}
                  required
                  value={deliveryData.address}
                  onChange={e => setDeliveryData({ ...deliveryData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172121] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={deliveryData.city}
                    onChange={e => setDeliveryData({ ...deliveryData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172121] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={deliveryData.state}
                    onChange={e => setDeliveryData({ ...deliveryData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172121] mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={deliveryData.pincode}
                    onChange={e => setDeliveryData({ ...deliveryData, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors mt-2"
              >
                Continue to Payment Method
              </button>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E6]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0F766E]" />
                  <h2 className="font-bold text-sm text-[#172121]">Step 2: Select Payment Method</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#0F766E] hover:underline"
                >
                  Edit Address
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* UPI Option */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E2E8E6] cursor-pointer hover:bg-[#F8FAF9] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-0.5 accent-[#0F766E]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#172121]">UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                      <span className="text-[10px] font-bold text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded">FAST</span>
                    </div>
                    <p className="text-[11px] text-[#647070]">Zero transaction fee with instant bank confirmation</p>
                    {paymentMethod === 'UPI' && (
                      <div className="pt-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="w-full max-w-xs px-2.5 py-1.5 text-xs border border-[#E2E8E6] rounded-md bg-white text-[#172121]"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* Card Option */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E2E8E6] cursor-pointer hover:bg-[#F8FAF9] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="mt-0.5 accent-[#0F766E]"
                  />
                  <div>
                    <span className="font-semibold text-[#172121] block">Credit / Debit Card (Visa, RuPay, Mastercard)</span>
                    <p className="text-[11px] text-[#647070]">Domestic & International cards accepted via RBI 2FA</p>
                  </div>
                </label>

                {/* COD Option */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E2E8E6] cursor-pointer hover:bg-[#F8FAF9] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-0.5 accent-[#0F766E]"
                  />
                  <div>
                    <span className="font-semibold text-[#172121] block">Cash on Delivery (COD)</span>
                    <p className="text-[11px] text-[#647070]">Pay cash or scan QR at doorstep upon physical delivery</p>
                  </div>
                </label>

                {/* Net Banking */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E2E8E6] cursor-pointer hover:bg-[#F8FAF9] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'NetBanking'}
                    onChange={() => setPaymentMethod('NetBanking')}
                    className="mt-0.5 accent-[#0F766E]"
                  />
                  <div>
                    <span className="font-semibold text-[#172121] block">Net Banking</span>
                    <p className="text-[11px] text-[#647070]">Supports HDFC, SBI, ICICI, Axis, Kotak and 50+ Indian banks</p>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium border border-[#E2E8E6] rounded-lg text-[#647070]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
                >
                  Review Order Details
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Review Order */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E6]">
                <h2 className="font-bold text-sm text-[#172121]">Step 3: Review Order & Confirm</h2>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#0F766E] hover:underline"
                >
                  Change Payment
                </button>
              </div>

              {/* Delivery Address Review */}
              <div className="bg-[#FAFCFB] p-3.5 rounded-xl border border-[#E2E8E6] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172121]">Delivery Address</span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[11px] text-[#0F766E] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-[#172121] font-medium">{deliveryData.name} ({deliveryData.phone})</p>
                <p className="text-[#647070]">
                  {deliveryData.address}, {deliveryData.city}, {deliveryData.state} - {deliveryData.pincode}
                </p>
              </div>

              {/* Payment Method Review */}
              <div className="bg-[#FAFCFB] p-3.5 rounded-xl border border-[#E2E8E6] text-xs">
                <span className="font-bold text-[#172121] block mb-1">Selected Payment Mode</span>
                <span className="text-[#0F766E] font-medium">
                  {paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod}
                </span>
              </div>

              {/* Multi-Vendor Order Breakdown Note */}
              <div className="text-[11px] text-[#647070] bg-teal-50/70 p-3 rounded-lg border border-teal-200">
                Notice: In accordance with MarketHub's multi-vendor architecture, items from different sellers will be packaged and tracked individually with vendor order IDs.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium border border-[#E2E8E6] rounded-lg text-[#647070]"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="flex-1 py-3 text-xs font-bold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] rounded-xl transition-colors shadow-xs disabled:opacity-50"
                >
                  {isPlacing ? 'Placing Order...' : `Confirm & Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Items Summary Right */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#172121] pb-2 border-b border-[#E2E8E6]">
            Items in Order ({cart.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
            {cart.map(item => (
              <div key={item.cart_item_id} className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ProductImage
                    productId={item.product_id}
                    category={item.product?.category}
                    productName={item.product?.product_name || 'Product'}
                    size="xs"
                    className="w-10 h-10 shrink-0 rounded-md"
                  />
                  <div className="truncate">
                    <span className="font-medium text-[#172121] truncate block">
                      {item.product?.product_name || 'Product'}
                    </span>
                    <span className="text-[11px] text-[#647070]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-semibold text-[#172121] tabular-nums shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E2E8E6] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#647070]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#172121] tabular-nums">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#647070]">
              <span>Delivery Charges</span>
              <span className="font-semibold text-[#0F766E] tabular-nums">
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E2E8E6] flex justify-between font-bold text-sm text-[#172121]">
              <span>Total Payable</span>
              <span className="tabular-nums text-base text-[#172121]">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
