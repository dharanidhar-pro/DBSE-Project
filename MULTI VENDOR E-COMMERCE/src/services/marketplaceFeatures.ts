import { Product, ProductReview, Coupon, Order } from '../types/database';
import { getProducts, getOrders, saveOrder, getVendorOrderDetailsForOrder, saveVendorOrderDetail } from './storage';

// Storage keys
const STORAGE_KEYS = {
  RECENTLY_VIEWED: 'markethub_recently_viewed_products',
  REVIEWS: 'markethub_product_reviews_v1',
  SAVED_PINCODE: 'markethub_saved_delivery_pincode',
  RECENT_SEARCHES: 'markethub_recent_search_history',
};

// Generic read/write helpers
const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// ============================================================================
// 1. RECENTLY VIEWED PRODUCTS
// ============================================================================

export const getRecentlyViewedIds = (): number[] => {
  return getStored<number[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
};

export const addRecentlyViewed = (productId: number): void => {
  if (!productId) return;
  const current = getRecentlyViewedIds();
  // Filter out existing to avoid duplicates, and place at front
  const updated = [productId, ...current.filter(id => id !== productId)].slice(0, 10);
  setStored(STORAGE_KEYS.RECENTLY_VIEWED, updated);
};

export const getRecentlyViewedProducts = (excludeId?: number): Product[] => {
  const ids = getRecentlyViewedIds();
  const all = getProducts();
  const filteredIds = excludeId ? ids.filter(id => id !== excludeId) : ids;
  return filteredIds
    .map(id => all.find(p => p.product_id === id))
    .filter((p): p is Product => Boolean(p && p.product_status === 'Active'));
};

// ============================================================================
// 2. PRODUCT REVIEWS & RATINGS
// ============================================================================

// Authentic initial seed reviews covering Indian buyers and realistic feedback
const initialReviewsSeed: ProductReview[] = [
  {
    review_id: 'rev-seed-1',
    product_id: 1, // Laptop Pro 14
    customer_name: 'Vikramaditya Roy',
    rating: 5,
    title: 'Superb build quality & blazing fast processing',
    comment: 'The metal chassis feels ultra premium. Battery backup easily lasts 9-10 hours of heavy multitasking. Fast delivery to Bengaluru in 2 days!',
    date: '2026-08-28',
    verified_purchase: true,
  },
  {
    review_id: 'rev-seed-2',
    product_id: 1,
    customer_name: 'Ananya Deshmukh',
    rating: 4,
    title: 'Great display, lightweight for work travel',
    comment: 'Colors are crisp and thermals stay cool under pressure. Only wish the charging brick was slightly more compact.',
    date: '2026-09-02',
    verified_purchase: true,
  },
  {
    review_id: 'rev-seed-3',
    product_id: 2, // Cotton Shirt
    customer_name: 'Rohan Mehra',
    rating: 5,
    title: 'Pure breathable cotton, perfect Indian summer fit',
    comment: 'The collar stays crisp even after machine washing. Fit is true to size and stitching is durable.',
    date: '2026-09-05',
    verified_purchase: true,
  },
  {
    review_id: 'rev-seed-4',
    product_id: 3, // Wireless Earbuds
    customer_name: 'Priya Nambiar',
    rating: 5,
    title: 'Crystal clear calls and punchy bass',
    comment: 'Active noise cancellation works very well during metro commutes. Connects instantly with my phone.',
    date: '2026-09-01',
    verified_purchase: true,
  },
  {
    review_id: 'rev-seed-5',
    product_id: 4, // Running Shoes
    customer_name: 'Arjun Sen',
    rating: 4,
    title: 'Great cushioning for road marathons',
    comment: 'Grip on wet tarmac is impressive and breathable mesh keeps feet dry during long runs.',
    date: '2026-08-25',
    verified_purchase: true,
  },
];

export const getProductReviews = (productId: number): ProductReview[] => {
  const customReviews = getStored<ProductReview[]>(STORAGE_KEYS.REVIEWS, initialReviewsSeed);
  return customReviews.filter(r => r.product_id === productId);
};

export const addProductReview = (
  productId: number,
  reviewData: {
    customer_name: string;
    rating: number;
    title: string;
    comment: string;
  }
): ProductReview => {
  const current = getStored<ProductReview[]>(STORAGE_KEYS.REVIEWS, initialReviewsSeed);
  const newReview: ProductReview = {
    review_id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    product_id: productId,
    customer_name: reviewData.customer_name.trim() || 'Verified Customer',
    rating: Math.max(1, Math.min(5, reviewData.rating)),
    title: reviewData.title.trim(),
    comment: reviewData.comment.trim(),
    date: new Date().toISOString().split('T')[0],
    verified_purchase: true,
  };

  const updated = [newReview, ...current];
  setStored(STORAGE_KEYS.REVIEWS, updated);
  return newReview;
};

export const getRatingDistribution = (
  productId: number,
  fallbackRating = 4.8,
  fallbackCount = 320
): {
  stars: Record<number, { count: number; percentage: number }>;
  totalCount: number;
  average: number;
} => {
  const reviews = getProductReviews(productId);
  
  // Calculate distribution
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  if (reviews.length > 0) {
    for (const r of reviews) {
      const star = Math.max(1, Math.min(5, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
    }
  }

  // Blend with baseline distribution for authentic marketplace presentation
  const baseCount = Math.max(fallbackCount, reviews.length);
  const total5 = Math.round(baseCount * 0.72) + counts[5];
  const total4 = Math.round(baseCount * 0.18) + counts[4];
  const total3 = Math.round(baseCount * 0.06) + counts[3];
  const total2 = Math.round(baseCount * 0.03) + counts[2];
  const total1 = Math.round(baseCount * 0.01) + counts[1];
  const total = total5 + total4 + total3 + total2 + total1;

  const avg = ((total5 * 5 + total4 * 4 + total3 * 3 + total2 * 2 + total1 * 1) / total).toFixed(1);

  return {
    stars: {
      5: { count: total5, percentage: Math.round((total5 / total) * 100) },
      4: { count: total4, percentage: Math.round((total4 / total) * 100) },
      3: { count: total3, percentage: Math.round((total3 / total) * 100) },
      2: { count: total2, percentage: Math.round((total2 / total) * 100) },
      1: { count: total1, percentage: Math.round((total1 / total) * 100) },
    },
    totalCount: total,
    average: Number(avg),
  };
};

// ============================================================================
// 3. PIN-CODE & INDIAN DELIVERY VERIFICATION
// ============================================================================

export interface PinCodeVerificationResult {
  available: boolean;
  city?: string;
  state?: string;
  estimatedDays: string;
  message: string;
}

// Indian postal zones & major hub coverage
const INDIAN_PINCODE_HUBS: Record<string, { city: string; state: string; days: string }> = {
  '500': { city: 'Hyderabad', state: 'Telangana', days: '1–2 Business Days' },
  '560': { city: 'Bengaluru', state: 'Karnataka', days: '2–3 Business Days' },
  '110': { city: 'New Delhi', state: 'Delhi NCR', days: '2–4 Business Days' },
  '400': { city: 'Mumbai', state: 'Maharashtra', days: '2–3 Business Days' },
  '600': { city: 'Chennai', state: 'Tamil Nadu', days: '2–4 Business Days' },
  '700': { city: 'Kolkata', state: 'West Bengal', days: '3–4 Business Days' },
  '411': { city: 'Pune', state: 'Maharashtra', days: '2–3 Business Days' },
  '380': { city: 'Ahmedabad', state: 'Gujarat', days: '2–4 Business Days' },
  '520': { city: 'Vijayawada', state: 'Andhra Pradesh', days: '2–3 Business Days' },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh', days: '2–3 Business Days' },
  '302': { city: 'Jaipur', state: 'Rajasthan', days: '3–4 Business Days' },
};

export const verifyDeliveryPinCode = (pincode: string): PinCodeVerificationResult => {
  const clean = pincode.trim().replace(/\D/g, '');

  if (clean.length !== 6) {
    return {
      available: false,
      estimatedDays: '',
      message: 'Please enter a valid 6-digit Indian postal PIN code.',
    };
  }

  // Realistic restriction: Indian PINs start with 1-8. PINs starting with 9 or 0 are invalid/military
  const firstDigit = clean[0];
  if (firstDigit === '0' || firstDigit === '9') {
    return {
      available: false,
      estimatedDays: '',
      message: `Delivery is currently unavailable for PIN code ${clean}.`,
    };
  }

  // Check matching hub
  const prefix3 = clean.substring(0, 3);
  const hub = INDIAN_PINCODE_HUBS[prefix3];

  if (hub) {
    return {
      available: true,
      city: hub.city,
      state: hub.state,
      estimatedDays: hub.days,
      message: `Fast doorstep delivery available to ${hub.city}, ${hub.state} in ${hub.days}.`,
    };
  }

  // Default valid Indian PIN
  return {
    available: true,
    estimatedDays: '3–5 Business Days',
    message: `Doorstep delivery available for PIN code ${clean} via Indian Express logistics in 3–5 days.`,
  };
};

export const getSavedDeliveryPinCode = (): string => {
  return localStorage.getItem(STORAGE_KEYS.SAVED_PINCODE) || '500001';
};

export const saveDeliveryPinCode = (pincode: string): void => {
  localStorage.setItem(STORAGE_KEYS.SAVED_PINCODE, pincode.trim());
};

// ============================================================================
// 4. COUPONS & OFFERS ENGINE
// ============================================================================

export const DEMO_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 500,
    max_discount: 500,
    description: '10% instant off on orders above ₹500 (Max discount ₹500)',
  },
  {
    code: 'SAVE200',
    discount_type: 'fixed',
    discount_value: 200,
    min_order_amount: 999,
    description: 'Flat ₹200 discount on orders above ₹999',
  },
  {
    code: 'MARKET50',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 499,
    description: 'Flat ₹50 savings on any purchase above ₹499',
  },
  {
    code: 'FESTIVE15',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_amount: 1499,
    max_discount: 1000,
    description: '15% Mega Indian Festive discount on orders above ₹1,499',
  },
];

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message: string;
}

export const applyCoupon = (code: string, subtotal: number): CouponValidationResult => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discount: 0, message: 'Please enter a coupon code.' };
  }

  const coupon = DEMO_COUPONS.find(c => c.code === cleanCode);
  if (!coupon) {
    return { valid: false, discount: 0, message: `Coupon code "${cleanCode}" is invalid or expired.` };
  }

  if (subtotal < coupon.min_order_amount) {
    return {
      valid: false,
      coupon,
      discount: 0,
      message: `Add items worth ₹${(coupon.min_order_amount - subtotal).toLocaleString('en-IN')} more to use ${coupon.code}. Minimum order ₹${coupon.min_order_amount.toLocaleString('en-IN')}.`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((subtotal * coupon.discount_value) / 100);
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.discount_value;
  }

  // Ensure total discount never exceeds subtotal
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon ${coupon.code} applied! Saved ₹${discount.toLocaleString('en-IN')}.`,
  };
};

// ============================================================================
// 5. ORDER CANCELLATION & RETURN LIFECYCLE
// ============================================================================

export const cancelOrderCustomer = (orderId: string, reason: string): boolean => {
  const orders = getOrders();
  const order = orders.find(o => o.order_id === orderId);
  if (!order) return false;

  // Only allow cancellation if order has not yet been delivered or out for delivery
  const nonCancellable = ['Out for Delivery', 'Delivered', 'Cancelled'];
  if (nonCancellable.includes(order.order_status)) {
    return false;
  }

  order.order_status = 'Cancelled';
  order.cancellation_reason = reason;
  order.refund_status = 'Refund Completed';
  saveOrder(order);

  // Update vendor order details items
  const items = getVendorOrderDetailsForOrder(orderId);
  for (const itm of items) {
    itm.delivery_status = 'Cancelled';
    saveVendorOrderDetail(itm);
  }

  return true;
};

export const requestOrderReturnCustomer = (orderId: string, reason: string): boolean => {
  const orders = getOrders();
  const order = orders.find(o => o.order_id === orderId);
  if (!order) return false;

  // Only allowed if status is Delivered
  if (order.order_status !== 'Delivered') {
    return false;
  }

  order.order_status = 'Return Requested';
  order.return_reason = reason;
  order.refund_status = 'Refund Processing';
  saveOrder(order);

  return true;
};

// ============================================================================
// 6. SEARCH AUTOCOMPLETE & RECENT SEARCHES
// ============================================================================

export const getRecentSearches = (): string[] => {
  return getStored<string[]>(STORAGE_KEYS.RECENT_SEARCHES, [
    'Headphones',
    'Smartphones',
    'Cotton Kurta',
    'Running Shoes',
    'Gaming Mouse',
  ]);
};

export const addRecentSearch = (query: string): void => {
  const q = query.trim();
  if (!q) return;
  const current = getRecentSearches();
  const updated = [q, ...current.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 8);
  setStored(STORAGE_KEYS.RECENT_SEARCHES, updated);
};

export const clearRecentSearches = (): void => {
  setStored(STORAGE_KEYS.RECENT_SEARCHES, []);
};

export const getSearchSuggestions = (
  query: string
): {
  suggestions: string[];
  matchingProducts: Product[];
  categories: string[];
} => {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { suggestions: [], matchingProducts: [], categories: [] };
  }

  const allProducts = getProducts().filter(p => p.product_status === 'Active');

  // Match products
  const matchingProducts = allProducts
    .filter(
      p =>
        p.product_name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    .slice(0, 5);

  // Suggestions generator
  const keywordsSet = new Set<string>();

  for (const p of allProducts) {
    const nameLower = p.product_name.toLowerCase();
    if (nameLower.includes(q)) {
      keywordsSet.add(p.product_name);
    }
  }

  // Matching categories
  const categoriesSet = new Set<string>();
  const allCategories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books'];
  for (const cat of allCategories) {
    if (cat.toLowerCase().includes(q)) {
      categoriesSet.add(cat);
    }
  }

  return {
    suggestions: Array.from(keywordsSet).slice(0, 6),
    matchingProducts,
    categories: Array.from(categoriesSet),
  };
};
