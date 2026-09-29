import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Product, Inventory } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { getInventory, saveInventory } from '../../services/storage';
import { getProductImageUrl } from '../../services/productImages';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  IndianRupee,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Camera,
} from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';
import { ProductPhotoManager } from '../../components/vendor/ProductPhotoManager';
import { ProductPhotosModal } from '../../components/vendor/ProductPhotosModal';

export const VendorProducts: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.id || 1;
  const { showSuccess, showError } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<number, Inventory>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    product_name: string;
    category: string;
    price: string;
    quantity: string;
    description: string;
    images: string[];
  }>({
    product_name: '',
    category: 'Electronics',
    price: '',
    quantity: '20',
    description: '',
    images: [],
  });

  // Dedicated Product Photos Modal State
  const [photoModalProduct, setPhotoModalProduct] = useState<Product | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const items = await marketplaceService.getProducts({ vendorId });
      setProducts(items);

      const invList = getInventory();
      const map: Record<number, Inventory> = {};
      for (const i of invList) {
        map[i.product_id] = i;
      }
      setInventoryMap(map);
    } catch (err) {
      console.error('Error fetching vendor products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [vendorId]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      product_name: '',
      category: 'Electronics',
      price: '',
      quantity: '25',
      description: '',
      images: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    const inv = inventoryMap[p.product_id];
    const existingImages = p.images && p.images.length > 0
      ? [...p.images]
      : [getProductImageUrl(p.product_id, p.category)];

    setFormData({
      product_name: p.product_name,
      category: p.category,
      price: String(p.price),
      quantity: inv ? String(inv.quantity) : '15',
      description: p.description,
      images: existingImages,
    });
    setIsModalOpen(true);
  };

  const handleOpenPhotos = (p: Product) => {
    setPhotoModalProduct(p);
    setIsPhotoModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name.trim() || !formData.price) {
      showError('Please provide product name and price.');
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        const updated: Product = {
          ...editingProduct,
          product_name: formData.product_name.trim(),
          category: formData.category,
          price: Number(formData.price),
          description: formData.description.trim(),
          images: formData.images.length > 0 ? formData.images : undefined,
        };
        await marketplaceService.saveProduct(updated);

        // Update inventory
        const inv = inventoryMap[editingProduct.product_id];
        if (inv) {
          inv.quantity = Number(formData.quantity);
          inv.price = Number(formData.price);
          inv.last_updated = new Date().toISOString().split('T')[0];
          saveInventory(inv);
        }
        showSuccess('Product details & pictures updated successfully.', 'Product Saved');
      } else {
        // Create new product
        const allProds = await marketplaceService.getAllProductsAdmin();
        const newId = allProds.length > 0 ? Math.max(...allProds.map(p => p.product_id)) + 1 : 1;
        const newProd: Product = {
          product_id: newId,
          vendor_id: vendorId,
          product_name: formData.product_name.trim(),
          category: formData.category,
          price: Number(formData.price),
          description: formData.description.trim(),
          product_status: 'Active',
          rating: 4.8,
          review_count: 1,
          images: formData.images.length > 0 ? formData.images : undefined,
        };
        await marketplaceService.saveProduct(newProd);

        // Create inventory entry
        const invList = getInventory();
        const newInvId = invList.length > 0 ? Math.max(...invList.map(i => i.inventory_id)) + 1 : 1;
        const newInv: Inventory = {
          inventory_id: newInvId,
          product_id: newId,
          vendor_id: vendorId,
          business_name: user?.business_name || 'Vendor',
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          last_updated: new Date().toISOString().split('T')[0],
        };
        saveInventory(newInv);
        showSuccess('New product with photos published to MarketHub.', 'Listing Active');
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      showError('Failed to save product changes.');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.product_status === 'Active' ? 'Inactive' : 'Active';
    const updated: Product = { ...product, product_status: nextStatus };
    await marketplaceService.saveProduct(updated);
    showSuccess(`Product set to ${nextStatus}.`);
    loadProducts();
  };

  const filtered = products.filter(
    p =>
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8E6] gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Store Catalog</h1>
          <p className="text-xs text-[#647070]">
            Manage products, pricing, and stock visibility for {user?.business_name}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
        />
        <Search className="w-3.5 h-3.5 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Photos</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {filtered.map(p => {
                const inv = inventoryMap[p.product_id];
                const stockQty = inv ? inv.quantity : 0;
                const picCount = p.images?.length || 0;

                return (
                  <tr key={p.product_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-3 px-4 font-semibold text-[#172121]">
                      <div className="flex items-center gap-2.5">
                        <ProductImage
                          productId={p.product_id}
                          category={p.category}
                          productName={p.product_name}
                          customImages={p.images}
                          size="xs"
                          className="w-9 h-9 shrink-0 rounded"
                        />
                        <span className="truncate max-w-[200px]">{p.product_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#647070]">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-[#172121] tabular-nums">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold tabular-nums ${
                          stockQty === 0
                            ? 'text-[#DC2626]'
                            : stockQty < 10
                            ? 'text-amber-600'
                            : 'text-[#0F766E]'
                        }`}
                      >
                        {stockQty} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          p.product_status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {p.product_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleOpenPhotos(p)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer group shadow-2xs"
                        title="View and manage multiple photos for this product"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>{picCount > 0 ? `${picCount} Pics` : '+ Add Pics'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenPhotos(p)}
                        className="p-1 text-[#647070] hover:text-[#0F766E] rounded"
                        title="Manage Product Pictures"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 text-[#647070] hover:text-[#0F766E] rounded"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[11px] font-medium hover:underline ${
                          p.product_status === 'Active' ? 'text-[#DC2626]' : 'text-[#0F766E]'
                        }`}
                      >
                        {p.product_status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8E6] max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
              <h3 className="font-bold text-base text-[#172121]">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#647070] hover:text-[#172121]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#172121] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g. Ergonomic Office Stand"
                  className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172121] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home & Living</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#172121] mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="999"
                    className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172121] mb-1">Initial Stock Units *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172121] mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, materials, and warranty information..."
                  className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] resize-none"
                />
              </div>

              {/* Product Photos (Multiple Pics Supported via ProductPhotoManager) */}
              <div className="pt-2 border-t border-[#E2E8E6]">
                <ProductPhotoManager
                  images={formData.images}
                  onChange={newImages => setFormData(prev => ({ ...prev, images: newImages }))}
                  category={formData.category}
                  productName={formData.product_name}
                  maxImages={10}
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8E6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E8E6] rounded-lg text-[#647070]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Dedicated Product Photos Management Modal */}
      <ProductPhotosModal
        product={photoModalProduct}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotosUpdated={() => loadProducts()}
      />
    </div>
  );
};
