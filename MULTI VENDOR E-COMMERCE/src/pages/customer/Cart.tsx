import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { ProductImage } from '../../components/common/ProductImage';
import { Trash2, Heart, ArrowRight, ShoppingBag, ShieldCheck, Tag, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { getVendorById } from '../../services/storage';
import { applyCoupon, DEMO_COUPONS, CouponValidationResult } from '../../services/marketplaceFeatures';
import { useToast } from '../../context/ToastContext';

export const CartPage: React.FC = () => {
  const { cart, cartCount, cartTotal, updateCartQuantity, removeFromCart, toggleWishlist, isWishlisted } =
    useCartWishlist();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const shippingFee = cartTotal > 999 || cartTotal === 0 ? 0 : 79;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) return;

    setCouponError(null);
    const result = applyCoupon(code, cartTotal);

    if (result.valid && result.coupon) {
      setAppliedCoupon({ code: result.coupon.code, discount: result.discount });
      setCouponInput('');
      showSuccess(`Coupon ${result.coupon.code} applied! Saved ₹${result.discount.toLocaleString('en-IN')}.`, 'Discount Applied');
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E2E8E6] p-10 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-[#647070]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#172121]">Your cart is empty</h1>
          <p className="text-xs text-[#647070] leading-relaxed">
            Discover authentic items across Indian electronics, fashion, home decor, sports, and books.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#F26B5E] hover:bg-[#D9574D] transition-colors"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#172121]">Shopping Bag</h1>
        <p className="text-xs text-[#647070]">
          You have <span className="font-semibold text-[#172121]">{cartCount}</span> items in your order bag
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Itemized List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const product = item.product;
            if (!product) return null;
            const vendor = getVendorById(item.vendor_id);
            const wishlisted = isWishlisted(item.product_id);

            return (
              <div
                key={item.cart_item_id}
                className="bg-white rounded-xl border border-[#E2E8E6] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all shadow-2xs"
              >
                {/* Product Info Left */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 shrink-0">
                    <ProductImage
                      productId={item.product_id}
                      category={product.category}
                      productName={product.product_name}
                      customImages={product.images}
                      size="sm"
                      className="rounded-lg h-full"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-[11px] font-medium text-[#0F766E]">
                      Sold by {vendor?.business_name || 'MarketHub Merchant'}
                    </div>
                    <Link
                      to={`/product/${item.product_id}`}
                      className="font-semibold text-sm text-[#172121] hover:text-[#0F766E] transition-colors line-clamp-1"
                    >
                      {product.product_name}
                    </Link>
                    <div className="text-xs font-bold text-[#172121] tabular-nums">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls and Actions Right */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#E2E8E6]">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E2E8E6] rounded-lg bg-white">
                    <button
                      onClick={() => updateCartQuantity(item.cart_item_id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-[#172121] hover:bg-[#F8FAF9] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cart_item_id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-[#172121] hover:bg-[#F8FAF9] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(item.product_id)}
                      aria-label="Save for later"
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        wishlisted ? 'bg-rose-50 text-[#F26B5E] border-rose-200' : 'text-[#647070] border-transparent hover:border-[#E2E8E6]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#F26B5E]' : ''}`} />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.cart_item_id)}
                      aria-label="Remove item"
                      className="p-1.5 rounded-lg text-[#647070] hover:text-[#DC2626] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon Engine Right */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          {/* Coupon Entry Card (Requirement 6) */}
          <div className="bg-white rounded-xl border border-[#E2E8E6] p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172121]">
              <Tag className="w-4 h-4 text-[#0F766E]" />
              <span>Coupons & Bank Offers</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="block text-[11px] text-emerald-700">
                      Savings of ₹{appliedCoupon.discount.toLocaleString('en-IN')} applied!
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 text-emerald-700 hover:text-rose-700 cursor-pointer"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    placeholder="Enter coupon code..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E2E8E6] rounded-lg uppercase tracking-wider font-semibold text-[#172121] focus:outline-none focus:border-[#0F766E]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-[#DC2626] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}

                {/* Quick-Apply Promo Chips */}
                <div className="pt-2 border-t border-[#E2E8E6]">
                  <span className="text-[10px] text-[#647070] block mb-1.5 uppercase tracking-wider font-semibold">
                    Available Coupons:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEMO_COUPONS.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold border border-teal-200 bg-teal-50 text-[#0F766E] hover:bg-teal-100 transition-colors cursor-pointer"
                        title={c.description}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-xl border border-[#E2E8E6] p-6 space-y-4 shadow-xs">
            <h2 className="font-bold text-sm text-[#172121] pb-3 border-b border-[#E2E8E6]">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#647070]">
                <span>Bag Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-[#172121] tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#647070]">
                <span>Standard Delivery</span>
                <span className="font-semibold text-[#172121] tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-[#0F766E] font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <div className="text-[11px] text-[#0F766E] bg-teal-50 p-2 rounded border border-teal-200">
                  Add items worth ₹{(1000 - cartTotal).toLocaleString('en-IN')} more for FREE delivery.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E2E8E6] flex justify-between items-baseline">
              <span className="font-bold text-sm text-[#172121]">Total Amount</span>
              <span className="text-xl font-extrabold text-[#172121] tabular-nums">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#647070] pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Safe & Encrypted Indian Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
