import { Admin, Vendor, Customer, Product, Inventory, Order, VendorOrderDetail, CartItem, AuthUser, VendorApprovalStatus } from '../types/database';
import {
  initialAdmin,
  initialVendors,
  initialCustomers,
  initialProducts,
  initialInventory,
  initialOrders,
  initialVendorOrderDetails,
} from '../data/seedData';

const STORAGE_KEYS = {
  ADMIN: 'markethub_admin',
  VENDORS: 'markethub_vendors',
  CUSTOMERS: 'markethub_customers',
  PRODUCTS: 'markethub_products',
  INVENTORY: 'markethub_inventory',
  ORDERS: 'markethub_orders',
  VENDOR_ORDER_DETAILS: 'markethub_vendor_order_details',
  CART: 'markethub_cart',
  WISHLIST: 'markethub_wishlist',
  CURRENT_USER: 'markethub_current_user',
  SEEDED: 'markethub_seeded_v6_164products',
};

// [CO1: RDBMS Foundations & Client Persistence Store]
// [CO2: Database Engineering - SQL & Polyglot Persistence]
// Initialize seed data from multi_vendor_ecommerce MySQL database dump
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  const isSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
  const storedProducts = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  
  if (!isSeeded || storedProducts.length < initialProducts.length) {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(initialAdmin));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(initialVendors));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(initialInventory));
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VENDOR_ORDER_DETAILS)) {
      localStorage.setItem(STORAGE_KEYS.VENDOR_ORDER_DETAILS, JSON.stringify(initialVendorOrderDetails));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([1, 4]));
    }
    localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  }
};

// Generic read/write helpers
const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// --- AUTH & SESSION ---
export const getSessionUser = (): AuthUser | null => {
  return getStored<AuthUser | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const setSessionUser = (user: AuthUser | null): void => {
  if (user) {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// --- ADMIN ---
export const getAdmin = (): Admin => {
  return getStored<Admin>(STORAGE_KEYS.ADMIN, initialAdmin);
};

// --- VENDORS ---
export const getVendors = (): Vendor[] => {
  return getStored<Vendor[]>(STORAGE_KEYS.VENDORS, initialVendors);
};

export const getVendorById = (vendorId: number): Vendor | undefined => {
  const vendors = getVendors();
  return vendors.find(v => v.vendor_id === vendorId);
};

export const getVendorByEmail = (email: string): Vendor | undefined => {
  const vendors = getVendors();
  return vendors.find(v => v.email.toLowerCase() === email.toLowerCase());
};

export const saveVendor = (vendor: Vendor): void => {
  const vendors = getVendors();
  const existingIdx = vendors.findIndex(v => v.vendor_id === vendor.vendor_id);
  if (existingIdx >= 0) {
    vendors[existingIdx] = vendor;
  } else {
    vendors.push(vendor);
  }
  setStored(STORAGE_KEYS.VENDORS, vendors);

  // If this affects current user session, update it
  const currentUser = getSessionUser();
  if (currentUser && currentUser.role === 'VENDOR' && currentUser.id === vendor.vendor_id) {
    setSessionUser({
      ...currentUser,
      approval_status: vendor.approval_status,
      business_name: vendor.business_name,
    });
  }
};

export const updateVendorApprovalStatus = (vendorId: number, status: VendorApprovalStatus): Vendor | null => {
  const vendors = getVendors();
  const vendor = vendors.find(v => v.vendor_id === vendorId);
  if (!vendor) return null;

  vendor.approval_status = status;
  if (status === 'Approved') {
    vendor.approved_date = new Date().toISOString().split('T')[0];
  } else {
    vendor.approved_date = null;
  }
  setStored(STORAGE_KEYS.VENDORS, vendors);

  // Update session if currently logged in
  const currentUser = getSessionUser();
  if (currentUser && currentUser.role === 'VENDOR' && currentUser.id === vendorId) {
    setSessionUser({
      ...currentUser,
      approval_status: status,
    });
  }

  return vendor;
};

// --- CUSTOMERS ---
export const getCustomers = (): Customer[] => {
  return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers);
};

export const getCustomerByEmail = (email: string): Customer | undefined => {
  const customers = getCustomers();
  return customers.find(c => c.email.toLowerCase() === email.toLowerCase());
};

export const saveCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  const existingIdx = customers.findIndex(c => c.customer_id === customer.customer_id);
  if (existingIdx >= 0) {
    customers[existingIdx] = customer;
  } else {
    customers.push(customer);
  }
  setStored(STORAGE_KEYS.CUSTOMERS, customers);
};

export const updateCustomerProfile = (
  customerId: number,
  updates: Partial<Customer>
): Customer | null => {
  const customers = getCustomers();
  const customer = customers.find(c => c.customer_id === customerId);
  if (!customer) return null;

  Object.assign(customer, updates);
  setStored(STORAGE_KEYS.CUSTOMERS, customers);

  // Sync with active session if currently logged in
  const currentUser = getSessionUser();
  if (currentUser && currentUser.role === 'CUSTOMER' && currentUser.id === customerId) {
    const updatedUser: AuthUser = {
      ...currentUser,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      avatar: customer.avatar,
    };
    setSessionUser(updatedUser);
  }

  return customer;
};

export const updateVendorProfile = (
  vendorId: number,
  updates: Partial<Vendor>
): Vendor | null => {
  const vendors = getVendors();
  const vendor = vendors.find(v => v.vendor_id === vendorId);
  if (!vendor) return null;

  Object.assign(vendor, updates);
  setStored(STORAGE_KEYS.VENDORS, vendors);

  // Sync with active session if currently logged in
  const currentUser = getSessionUser();
  if (currentUser && currentUser.role === 'VENDOR' && currentUser.id === vendorId) {
    const updatedUser: AuthUser = {
      ...currentUser,
      name: vendor.business_name,
      business_name: vendor.business_name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.business_address,
      avatar: vendor.avatar,
      approval_status: vendor.approval_status,
    };
    setSessionUser(updatedUser);
  }

  return vendor;
};

export const updateAdminProfile = (
  updates: Partial<Admin>
): Admin => {
  const admin = getAdmin();
  Object.assign(admin, updates);
  setStored(STORAGE_KEYS.ADMIN, admin);

  const currentUser = getSessionUser();
  if (currentUser && currentUser.role === 'ADMIN') {
    const updatedUser: AuthUser = {
      ...currentUser,
      name: admin.admin_name,
      email: admin.email,
      avatar: admin.avatar,
    };
    setSessionUser(updatedUser);
  }

  return admin;
};

// --- PRODUCTS ---
export const getProducts = (): Product[] => {
  return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
};

export const getProductById = (productId: number): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.product_id === productId);
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIdx = products.findIndex(p => p.product_id === product.product_id);
  if (existingIdx >= 0) {
    products[existingIdx] = product;
  } else {
    products.push(product);
  }
  setStored(STORAGE_KEYS.PRODUCTS, products);
};

// --- INVENTORY ---
export const getInventory = (): Inventory[] => {
  return getStored<Inventory[]>(STORAGE_KEYS.INVENTORY, initialInventory);
};

export const getInventoryForVendor = (vendorId: number): Inventory[] => {
  const inventory = getInventory();
  return inventory.filter(i => i.vendor_id === vendorId);
};

export const updateInventoryQuantity = (inventoryId: number, quantity: number): void => {
  const inventory = getInventory();
  const item = inventory.find(i => i.inventory_id === inventoryId);
  if (item) {
    item.quantity = Math.max(0, quantity);
    item.last_updated = new Date().toISOString().split('T')[0];
    setStored(STORAGE_KEYS.INVENTORY, inventory);
  }
};

export const saveInventory = (item: Inventory): void => {
  const inventory = getInventory();
  const existingIdx = inventory.findIndex(i => i.inventory_id === item.inventory_id);
  if (existingIdx >= 0) {
    inventory[existingIdx] = item;
  } else {
    inventory.push(item);
  }
  setStored(STORAGE_KEYS.INVENTORY, inventory);
};

// --- ORDERS ---
export const getOrders = (): Order[] => {
  return getStored<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
};

export const getOrderById = (orderId: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(o => o.order_id === orderId);
};

export const getOrdersForCustomer = (customerId: number): Order[] => {
  const orders = getOrders();
  return orders.filter(o => o.customer_id === customerId);
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  const existingIdx = orders.findIndex(o => o.order_id === order.order_id);
  if (existingIdx >= 0) {
    orders[existingIdx] = order;
  } else {
    orders.unshift(order);
  }
  setStored(STORAGE_KEYS.ORDERS, orders);
};

// --- VENDOR ORDER DETAILS ---
export const getVendorOrderDetails = (): VendorOrderDetail[] => {
  return getStored<VendorOrderDetail[]>(STORAGE_KEYS.VENDOR_ORDER_DETAILS, initialVendorOrderDetails);
};

export const getVendorOrderDetailsForOrder = (orderId: string): VendorOrderDetail[] => {
  const details = getVendorOrderDetails();
  return details.filter(d => d.order_id === orderId);
};

export const getVendorOrderDetailsForVendor = (vendorId: number): VendorOrderDetail[] => {
  const details = getVendorOrderDetails();
  return details.filter(d => d.vendor_id === vendorId);
};

export const updateVendorOrderDetailStatus = (
  vendorOrderId: number,
  deliveryStatus: VendorOrderDetail['delivery_status'],
  trackingNumber?: string
): void => {
  const details = getVendorOrderDetails();
  const item = details.find(d => d.vendor_order_id === vendorOrderId);
  if (item) {
    item.delivery_status = deliveryStatus;
    if (trackingNumber) item.tracking_number = trackingNumber;
    if (deliveryStatus === 'Delivered') {
      item.delivery_date = new Date().toISOString().split('T')[0];
    }
    setStored(STORAGE_KEYS.VENDOR_ORDER_DETAILS, details);

    // Update parent order status if all vendor items match or progress
    const parentOrder = getOrderById(item.order_id);
    if (parentOrder) {
      const orderItems = details.filter(d => d.order_id === item.order_id);
      const allDelivered = orderItems.every(d => d.delivery_status === 'Delivered');
      const anyShipped = orderItems.some(d => d.delivery_status === 'Shipped' || d.delivery_status === 'Out for Delivery');
      
      if (allDelivered) {
        parentOrder.order_status = 'Delivered';
        saveOrder(parentOrder);
      } else if (anyShipped && parentOrder.order_status !== 'Shipped') {
        parentOrder.order_status = 'Shipped';
        saveOrder(parentOrder);
      }
    }
  }
};

export const saveVendorOrderDetail = (detail: VendorOrderDetail): void => {
  const details = getVendorOrderDetails();
  const existingIdx = details.findIndex(d => d.vendor_order_id === detail.vendor_order_id);
  if (existingIdx >= 0) {
    details[existingIdx] = detail;
  } else {
    details.unshift(detail);
  }
  setStored(STORAGE_KEYS.VENDOR_ORDER_DETAILS, details);
};

// --- CART ITEMS ---
export const getStoredCart = (): CartItem[] => {
  return getStored<CartItem[]>(STORAGE_KEYS.CART, []);
};

export const setStoredCart = (items: CartItem[]): void => {
  setStored(STORAGE_KEYS.CART, items);
};

// --- WISHLIST ---
export const getStoredWishlist = (): number[] => {
  return getStored<number[]>(STORAGE_KEYS.WISHLIST, [1, 15]);
};

export const setStoredWishlist = (productIds: number[]): void => {
  setStored(STORAGE_KEYS.WISHLIST, productIds);
};

// --- RESET UTILITY ---
export const resetDemoData = (): void => {
  localStorage.clear();
  initializeStorage();
};
