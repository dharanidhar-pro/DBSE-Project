/**
 * MarketHub Database & Domain Types
 * Exactly matches the 8-table MySQL DBMS schema
 */

export interface Admin {
  admin_id: number;
  admin_name: string;
  email: string;
  password?: string;
  avatar?: string;
}

export type VendorApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Vendor {
  vendor_id: number;
  business_name: string;
  email: string;
  phone: string;
  business_address: string;
  approval_status: VendorApprovalStatus;
  registration_date: string; // YYYY-MM-DD
  approved_date: string | null;
  password?: string;
  avatar?: string;
  contact_name?: string;
}

export interface Customer {
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  registration_date: string;
  avatar?: string;
}

export type ProductStatus = 'Active' | 'Inactive';

export interface Product {
  product_id: number;
  vendor_id: number;
  product_name: string;
  description: string;
  price: number;
  category: string;
  product_status: ProductStatus;
  // Visual & presentation helpers
  rating?: number;
  review_count?: number;
  brand?: string;
  images?: string[]; // Multiple pictures supported
}

export interface Inventory {
  inventory_id: number;
  product_id: number;
  vendor_id: number;
  business_name: string;
  price: number;
  quantity: number;
  last_updated: string;
}

export interface CartItem {
  cart_item_id: number;
  customer_id: number;
  product_id: number;
  vendor_id: number;
  price: number;
  quantity: number;
  added_date: string;
  // Augmented for UI display
  product?: Product;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Cancellation Requested'
  | 'Return Requested'
  | 'Return Approved';

export interface Order {
  order_id: string; // YYYYMMDD-ORDERNUMBER e.g., 20260902-001
  customer_id: number;
  order_date: string;
  total_amount: number;
  delivery_address: string;
  order_status: OrderStatus;
  // Delivery contact details
  customer_name?: string;
  customer_phone?: string;
  // Cancellation, Returns & Coupons
  cancellation_reason?: string;
  return_reason?: string;
  refund_status?: 'Not Applicable' | 'Refund Processing' | 'Refund Completed';
  coupon_code?: string;
  discount_amount?: number;
}

export type DeliveryStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Completed' | 'Refunded' | 'COD' | 'Failed';

export interface ProductReview {
  review_id: string;
  product_id: number;
  customer_name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified_purchase: boolean;
}

export interface Coupon {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  description: string;
}

export interface VendorOrderDetail {
  vendor_order_id: number;
  order_id: string;
  customer_id: number;
  vendor_id: number;
  product_id: number;
  business_name: string;
  order_date: string;
  delivery_date: string | null;
  payment_method: string;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  tracking_number: string;
  quantity: number;
  price: number;
  subtotal: number;
  product_name?: string;
}

export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface AuthUser {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  approval_status?: VendorApprovalStatus; // For vendors
  business_name?: string; // For vendors
}
