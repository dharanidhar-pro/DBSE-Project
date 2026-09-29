import {
  Product,
  Order,
  VendorOrderDetail,
  CartItem,
  Vendor,
  Customer,
  Inventory,
  VendorApprovalStatus,
} from '../../types/database';
import {
  getProducts,
  getProductById,
  saveProduct,
  getInventory,
  getInventoryForVendor,
  updateInventoryQuantity,
  saveInventory,
  getOrders,
  getOrderById,
  getOrdersForCustomer,
  saveOrder,
  getVendorOrderDetails,
  getVendorOrderDetailsForOrder,
  getVendorOrderDetailsForVendor,
  updateVendorOrderDetailStatus,
  saveVendorOrderDetail,
  getStoredCart,
  setStoredCart,
  getStoredWishlist,
  setStoredWishlist,
  getVendors,
  updateVendorApprovalStatus,
  getCustomers,
} from '../storage';

export const marketplaceService = {
  // --- PRODUCTS ---
  async getProducts(params?: {
    category?: string;
    search?: string;
    vendorId?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Promise<Product[]> {
    let items = getProducts().filter(p => p.product_status === 'Active');

    if (params?.category && params.category !== 'All') {
      const cat = params.category.toLowerCase().trim();
      items = items.filter(p => {
        const pCat = p.category.toLowerCase().trim();
        if (cat === 'home' || cat === 'home & living') {
          return pCat === 'home' || pCat === 'home & living';
        }
        return pCat === cat;
      });
    }

    if (params?.vendorId) {
      items = items.filter(p => p.vendor_id === params.vendorId);
    }

    if (params?.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        p =>
          p.product_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      items = items.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      items = items.filter(p => p.price <= params.maxPrice!);
    }
    if (params?.minRating !== undefined) {
      items = items.filter(p => (p.rating || 0) >= params.minRating!);
    }

    if (params?.sort) {
      switch (params.sort) {
        case 'price-asc':
          items.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          items.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          items.sort((a, b) => b.product_id - a.product_id);
          break;
        default:
          // Relevance
          break;
      }
    }

    return items;
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    return getProducts();
  },

  async getProductById(id: number): Promise<Product | undefined> {
    return getProductById(id);
  },

  async saveProduct(product: Product): Promise<void> {
    saveProduct(product);
  },

  // --- CART ---
  async getCart(customerId: number): Promise<CartItem[]> {
    const rawItems = getStoredCart().filter(item => item.customer_id === customerId);
    // Enrich with product data
    return rawItems.map(item => ({
      ...item,
      product: getProductById(item.product_id),
    }));
  },

  async addToCart(customerId: number, productId: number, quantity: number = 1): Promise<CartItem[]> {
    const product = getProductById(productId);
    if (!product) throw new Error('Product not found');

    const cart = getStoredCart();
    const existingIndex = cart.findIndex(
      item => item.customer_id === customerId && item.product_id === productId
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      const newCartItemId = cart.length > 0 ? Math.max(...cart.map(c => c.cart_item_id)) + 1 : 1;
      cart.push({
        cart_item_id: newCartItemId,
        customer_id: customerId,
        product_id: productId,
        vendor_id: product.vendor_id,
        price: product.price,
        quantity: quantity,
        added_date: new Date().toISOString().split('T')[0],
      });
    }

    setStoredCart(cart);
    return this.getCart(customerId);
  },

  async updateCartQuantity(cartItemId: number, quantity: number, customerId: number): Promise<CartItem[]> {
    let cart = getStoredCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.cart_item_id !== cartItemId);
    } else {
      const item = cart.find(i => i.cart_item_id === cartItemId);
      if (item) {
        item.quantity = quantity;
      }
    }
    setStoredCart(cart);
    return this.getCart(customerId);
  },

  async removeFromCart(cartItemId: number, customerId: number): Promise<CartItem[]> {
    const cart = getStoredCart().filter(item => item.cart_item_id !== cartItemId);
    setStoredCart(cart);
    return this.getCart(customerId);
  },

  async clearCart(customerId: number): Promise<void> {
    const cart = getStoredCart().filter(item => item.customer_id !== customerId);
    setStoredCart(cart);
  },

  // --- WISHLIST ---
  getWishlist(): number[] {
    return getStoredWishlist();
  },

  toggleWishlist(productId: number): number[] {
    const current = getStoredWishlist();
    const index = current.indexOf(productId);
    let updated: number[];
    if (index >= 0) {
      updated = current.filter(id => id !== productId);
    } else {
      updated = [...current, productId];
    }
    setStoredWishlist(updated);
    return updated;
  },

  // --- ORDERS ---
  async placeOrder(params: {
    customerId: number;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: string;
    items: { productId: number; quantity: number }[];
  }): Promise<Order> {
    const { customerId, customerName, customerPhone, deliveryAddress, paymentMethod, items } = params;

    // Generate formatted Order ID: YYYYMMDD-ORDERNUMBER
    const now = new Date();
    const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, '');
    const existingOrders = getOrders();
    const seq = (existingOrders.length + 1).toString().padStart(3, '0');
    const orderId = `${datePrefix}-${seq}`;

    let totalAmount = 0;
    const vendorDetailsToSave: VendorOrderDetail[] = [];

    const vendors = getVendors();
    const details = getVendorOrderDetails();
    let nextDetailId = details.length > 0 ? Math.max(...details.map(d => d.vendor_order_id)) + 1 : 1;

    for (const item of items) {
      const prod = getProductById(item.productId);
      if (!prod) continue;

      const vendor = vendors.find(v => v.vendor_id === prod.vendor_id);
      const subtotal = prod.price * item.quantity;
      totalAmount += subtotal;

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const trackingNumber = `MH-TRK-${randomSuffix}IN`;

      vendorDetailsToSave.push({
        vendor_order_id: nextDetailId++,
        order_id: orderId,
        customer_id: customerId,
        vendor_id: prod.vendor_id,
        product_id: prod.product_id,
        business_name: vendor?.business_name || 'MarketHub Merchant',
        order_date: now.toISOString().split('T')[0],
        delivery_date: null,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'Cash on Delivery' ? 'COD' : 'Paid',
        delivery_status: 'Pending',
        tracking_number: trackingNumber,
        quantity: item.quantity,
        price: prod.price,
        subtotal: subtotal,
        product_name: prod.product_name,
      });

      // Update inventory stock
      const invItems = getInventory();
      const inv = invItems.find(i => i.product_id === prod.product_id);
      if (inv) {
        inv.quantity = Math.max(0, inv.quantity - item.quantity);
        saveInventory(inv);
      }
    }

    const newOrder: Order = {
      order_id: orderId,
      customer_id: customerId,
      order_date: now.toISOString().split('T')[0],
      total_amount: totalAmount,
      delivery_address: deliveryAddress,
      order_status: 'Pending',
      customer_name: customerName,
      customer_phone: customerPhone,
    };

    saveOrder(newOrder);
    for (const d of vendorDetailsToSave) {
      saveVendorOrderDetail(d);
    }

    // Clear cart for this customer
    await this.clearCart(customerId);

    return newOrder;
  },

  async getCustomerOrders(customerId: number): Promise<Order[]> {
    return getOrdersForCustomer(customerId);
  },

  async getOrderDetails(orderId: string): Promise<{ order: Order | undefined; items: VendorOrderDetail[] }> {
    const order = getOrderById(orderId);
    const items = getVendorOrderDetailsForOrder(orderId);
    return { order, items };
  },

  // --- VENDOR OPERATIONS ---
  async getVendorOrders(vendorId: number): Promise<VendorOrderDetail[]> {
    return getVendorOrderDetailsForVendor(vendorId);
  },

  async getVendorInventory(vendorId: number): Promise<Inventory[]> {
    return getInventoryForVendor(vendorId);
  },

  async updateVendorStock(inventoryId: number, quantity: number): Promise<void> {
    updateInventoryQuantity(inventoryId, quantity);
  },

  async updateDeliveryStatus(
    vendorOrderId: number,
    status: VendorOrderDetail['delivery_status'],
    trackingNumber?: string
  ): Promise<void> {
    updateVendorOrderDetailStatus(vendorOrderId, status, trackingNumber);
  },

  // --- ADMIN OPERATIONS ---
  async getAllVendors(): Promise<Vendor[]> {
    return getVendors();
  },

  async getAllCustomers(): Promise<Customer[]> {
    return getCustomers();
  },

  async getAllOrders(): Promise<Order[]> {
    return getOrders();
  },

  async getAllInventory(): Promise<Inventory[]> {
    return getInventory();
  },

  async setVendorStatus(vendorId: number, status: VendorApprovalStatus): Promise<Vendor | null> {
    return updateVendorApprovalStatus(vendorId, status);
  },
};
