// Seed data shaped to mirror the existing MySQL schema
// (vendor, customer, product, inventory, orders, vendor_order_details).
// In production these come from Flask REST endpoints; here they seed the
// client store so every interaction is real and consistent.

export type Vendor = {
  vendor_id: number
  business_name: string
  email: string
  phone: string
  address: string
  status: "pending" | "approved" | "rejected"
  registered_on: string
  approved_on: string | null
  rating: number
}

export type Product = {
  product_id: number
  name: string
  category: string
  vendor_id: number
  price: number
  mrp: number
  description: string
  rating: number
  reviews: number
  tags: ("new" | "deal" | "popular")[]
}

export type Inventory = {
  product_id: number
  stock: number
  low_stock_threshold: number
}

export type Customer = {
  customer_id: number
  name: string
  email: string
  phone: string
  city: string
  joined_on: string
  orders: number
}

export type OrderItem = {
  product_id: number
  name: string
  vendor_id: number
  price: number
  quantity: number
}

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"
export type DeliveryStatus =
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"

export type Order = {
  order_id: string
  customer_id: number
  customer_name: string
  placed_on: string
  items: OrderItem[]
  total: number
  payment_method: string
  payment_status: "Paid" | "Pending" | "Refunded"
  status: OrderStatus
  delivery_status: DeliveryStatus
  tracking_number: string
  expected_delivery: string
  address: string
}

export const CATEGORIES = [
  "Electronics",
  "Audio",
  "Footwear",
  "Accessories",
  "Wearables",
  "Home & Kitchen",
  "Fitness",
]

export const VENDORS: Vendor[] = [
  { vendor_id: 1, business_name: "Nexa Electronics", email: "sales@nexaelectronics.in", phone: "+91 98200 41122", address: "Andheri East, Mumbai, MH", status: "approved", registered_on: "2024-11-04", approved_on: "2024-11-06", rating: 4.6 },
  { vendor_id: 2, business_name: "Stride Footwear Co.", email: "hello@stridefootwear.in", phone: "+91 90040 22119", address: "Koramangala, Bengaluru, KA", status: "approved", registered_on: "2025-01-12", approved_on: "2025-01-14", rating: 4.4 },
  { vendor_id: 3, business_name: "AuraSound Audio", email: "care@aurasound.in", phone: "+91 99872 55410", address: "Salt Lake, Kolkata, WB", status: "approved", registered_on: "2025-02-02", approved_on: "2025-02-05", rating: 4.7 },
  { vendor_id: 4, business_name: "HearthWare Living", email: "support@hearthware.in", phone: "+91 90310 78822", address: "Satellite, Ahmedabad, GJ", status: "approved", registered_on: "2025-03-18", approved_on: "2025-03-20", rating: 4.3 },
  { vendor_id: 5, business_name: "Peak Active Gear", email: "team@peakactive.in", phone: "+91 98111 00934", address: "Sector 62, Noida, UP", status: "pending", registered_on: "2025-08-21", approved_on: null, rating: 0 },
  { vendor_id: 6, business_name: "Vault Accessories", email: "orders@vaultbags.in", phone: "+91 96540 33218", address: "T. Nagar, Chennai, TN", status: "pending", registered_on: "2025-09-02", approved_on: null, rating: 0 },
]

export const PRODUCTS: Product[] = [
  { product_id: 1, name: "Nexa UltraBook 14 Pro", category: "Electronics", vendor_id: 1, price: 68990, mrp: 79990, description: "14-inch 2.8K OLED display, Intel Core Ultra 7, 16GB LPDDR5 RAM and a 1TB SSD. Built for developers and creators who need all-day battery and a colour-accurate screen.", rating: 4.6, reviews: 214, tags: ["popular"] },
  { product_id: 2, name: "Nexa Vibe 5G Smartphone", category: "Electronics", vendor_id: 1, price: 24999, mrp: 29999, description: "6.7-inch 120Hz AMOLED, Snapdragon processor, 50MP triple camera and a 5000mAh battery with 67W fast charging.", rating: 4.4, reviews: 512, tags: ["popular", "deal"] },
  { product_id: 3, name: "Stride Velocity Running Shoes", category: "Footwear", vendor_id: 2, price: 4499, mrp: 5999, description: "Lightweight breathable mesh upper with responsive cushioning. Designed for daily road running and long-distance comfort.", rating: 4.5, reviews: 328, tags: ["popular"] },
  { product_id: 4, name: "AuraSound Zen Wireless Headphones", category: "Audio", vendor_id: 3, price: 8999, mrp: 12999, description: "Active noise cancellation, 40-hour battery life and plush memory-foam ear cushions for immersive, fatigue-free listening.", rating: 4.7, reviews: 419, tags: ["deal", "new"] },
  { product_id: 5, name: "Vault Metro Laptop Backpack", category: "Accessories", vendor_id: 6, price: 1899, mrp: 2799, description: "Water-resistant 28L backpack with padded 15.6-inch laptop sleeve, USB charging port and anti-theft rear pocket.", rating: 4.3, reviews: 176, tags: [] },
  { product_id: 6, name: "Peak Pulse Smart Watch", category: "Wearables", vendor_id: 5, price: 6499, mrp: 8999, description: "1.4-inch AMOLED, SpO2 and heart-rate tracking, 100+ sport modes and up to 10 days of battery on a single charge.", rating: 4.2, reviews: 254, tags: ["new"] },
  { product_id: 7, name: "HearthWare Barista Coffee Maker", category: "Home & Kitchen", vendor_id: 4, price: 7499, mrp: 9499, description: "15-bar pump espresso machine with milk frother and thermoblock heating for cafe-quality coffee at home.", rating: 4.4, reviews: 132, tags: ["deal"] },
  { product_id: 8, name: "AuraSound Polarised Sunglasses", category: "Accessories", vendor_id: 3, price: 1499, mrp: 2299, description: "UV400 polarised lenses in a lightweight acetate frame with a scratch-resistant coating.", rating: 4.1, reviews: 88, tags: [] },
  { product_id: 9, name: "Nexa Tactile Mechanical Keyboard", category: "Electronics", vendor_id: 1, price: 3999, mrp: 5499, description: "Hot-swappable brown switches, per-key RGB and a durable aluminium top plate for a satisfying typing experience.", rating: 4.6, reviews: 201, tags: ["popular"] },
  { product_id: 10, name: "Peak Insulated Steel Bottle 1L", category: "Fitness", vendor_id: 5, price: 899, mrp: 1299, description: "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12. Leak-proof and BPA-free.", rating: 4.5, reviews: 305, tags: ["deal"] },
  { product_id: 11, name: "Peak Grip Yoga Mat 6mm", category: "Fitness", vendor_id: 5, price: 1299, mrp: 1899, description: "Non-slip TPE mat with alignment lines, 6mm cushioning and a carry strap. Free of PVC and latex.", rating: 4.4, reviews: 143, tags: ["new"] },
  { product_id: 12, name: "HearthWare Aura Desk Lamp", category: "Home & Kitchen", vendor_id: 4, price: 2199, mrp: 2999, description: "Dimmable LED desk lamp with three colour temperatures, USB charging base and a flicker-free panel.", rating: 4.3, reviews: 97, tags: [] },
  { product_id: 13, name: "HearthWare Nonstick Fry Pan 26cm", category: "Home & Kitchen", vendor_id: 4, price: 1599, mrp: 2499, description: "Granite-coated nonstick pan with an ergonomic stay-cool handle. Induction and gas compatible.", rating: 4.2, reviews: 121, tags: ["deal"] },
  { product_id: 14, name: "Nexa Glide Wireless Mouse", category: "Electronics", vendor_id: 1, price: 1299, mrp: 1799, description: "Silent-click ergonomic mouse with 2.4GHz + Bluetooth dual mode and an adjustable 4000 DPI sensor.", rating: 4.5, reviews: 267, tags: ["new"] },
  { product_id: 15, name: "Nexa UltraBook 14 Air", category: "Electronics", vendor_id: 1, price: 54990, mrp: 62990, description: "Feather-light 1.19kg magnesium chassis, 14-inch IPS display and 18-hour battery for work on the move.", rating: 4.4, reviews: 158, tags: [] },
  { product_id: 16, name: "Stride Trail Blazer Shoes", category: "Footwear", vendor_id: 2, price: 5499, mrp: 6999, description: "Rugged trail runners with a grippy lugged outsole, rock plate and a protective toe cap for off-road terrain.", rating: 4.6, reviews: 112, tags: ["popular"] },
]

export const INVENTORY: Inventory[] = [
  { product_id: 1, stock: 42, low_stock_threshold: 10 },
  { product_id: 2, stock: 8, low_stock_threshold: 10 },
  { product_id: 3, stock: 120, low_stock_threshold: 20 },
  { product_id: 4, stock: 31, low_stock_threshold: 15 },
  { product_id: 5, stock: 0, low_stock_threshold: 10 },
  { product_id: 6, stock: 54, low_stock_threshold: 15 },
  { product_id: 7, stock: 6, low_stock_threshold: 8 },
  { product_id: 8, stock: 76, low_stock_threshold: 20 },
  { product_id: 9, stock: 23, low_stock_threshold: 10 },
  { product_id: 10, stock: 210, low_stock_threshold: 30 },
  { product_id: 11, stock: 4, low_stock_threshold: 12 },
  { product_id: 12, stock: 38, low_stock_threshold: 10 },
  { product_id: 13, stock: 45, low_stock_threshold: 10 },
  { product_id: 14, stock: 88, low_stock_threshold: 20 },
  { product_id: 15, stock: 12, low_stock_threshold: 10 },
  { product_id: 16, stock: 19, low_stock_threshold: 10 },
]

export const CUSTOMERS: Customer[] = [
  { customer_id: 1, name: "Ananya Sharma", email: "ananya.sharma@gmail.com", phone: "+91 98765 43210", city: "Pune", joined_on: "2025-01-08", orders: 7 },
  { customer_id: 2, name: "Rohan Mehta", email: "rohan.mehta@gmail.com", phone: "+91 90123 45678", city: "Delhi", joined_on: "2025-02-19", orders: 3 },
  { customer_id: 3, name: "Priya Nair", email: "priya.nair@outlook.com", phone: "+91 88456 12390", city: "Kochi", joined_on: "2025-03-27", orders: 12 },
  { customer_id: 4, name: "Aditya Verma", email: "aditya.v@gmail.com", phone: "+91 97654 33221", city: "Jaipur", joined_on: "2025-05-11", orders: 2 },
  { customer_id: 5, name: "Sneha Iyer", email: "sneha.iyer@gmail.com", phone: "+91 99887 76655", city: "Hyderabad", joined_on: "2025-06-30", orders: 5 },
]

export const SEED_ORDERS: Order[] = [
  {
    order_id: "MH-24815",
    customer_id: 1,
    customer_name: "Ananya Sharma",
    placed_on: "2025-09-03",
    items: [
      { product_id: 4, name: "AuraSound Zen Wireless Headphones", vendor_id: 3, price: 8999, quantity: 1 },
      { product_id: 10, name: "Peak Insulated Steel Bottle 1L", vendor_id: 5, price: 899, quantity: 2 },
    ],
    total: 10797,
    payment_method: "UPI",
    payment_status: "Paid",
    status: "Shipped",
    delivery_status: "Out for Delivery",
    tracking_number: "MHX7789341IN",
    expected_delivery: "2025-09-13",
    address: "Flat 12B, Lakeview Residency, Baner, Pune, MH 411045",
  },
  {
    order_id: "MH-24788",
    customer_id: 1,
    customer_name: "Ananya Sharma",
    placed_on: "2025-08-22",
    items: [{ product_id: 3, name: "Stride Velocity Running Shoes", vendor_id: 2, price: 4499, quantity: 1 }],
    total: 4499,
    payment_method: "Card",
    payment_status: "Paid",
    status: "Delivered",
    delivery_status: "Delivered",
    tracking_number: "MHX7712045IN",
    expected_delivery: "2025-08-27",
    address: "Flat 12B, Lakeview Residency, Baner, Pune, MH 411045",
  },
  {
    order_id: "MH-24902",
    customer_id: 3,
    customer_name: "Priya Nair",
    placed_on: "2025-09-08",
    items: [{ product_id: 1, name: "Nexa UltraBook 14 Pro", vendor_id: 1, price: 68990, quantity: 1 }],
    total: 68990,
    payment_method: "Net Banking",
    payment_status: "Paid",
    status: "Confirmed",
    delivery_status: "Processing",
    tracking_number: "MHX7801277IN",
    expected_delivery: "2025-09-15",
    address: "24 Marine Drive, Ernakulam, Kochi, KL 682031",
  },
  {
    order_id: "MH-24756",
    customer_id: 2,
    customer_name: "Rohan Mehta",
    placed_on: "2025-08-15",
    items: [
      { product_id: 9, name: "Nexa Tactile Mechanical Keyboard", vendor_id: 1, price: 3999, quantity: 1 },
      { product_id: 14, name: "Nexa Glide Wireless Mouse", vendor_id: 1, price: 1299, quantity: 1 },
    ],
    total: 5298,
    payment_method: "Cash on Delivery",
    payment_status: "Pending",
    status: "Pending",
    delivery_status: "Processing",
    tracking_number: "MHX7690012IN",
    expected_delivery: "2025-09-14",
    address: "B-44, Green Park, New Delhi, DL 110016",
  },
]

// Signed-in demo customer for the storefront.
export const DEMO_CUSTOMER: Customer = CUSTOMERS[0]
// Signed-in demo vendor for the vendor dashboard.
export const DEMO_VENDOR_ID = 1
