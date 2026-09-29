import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Inventory, Product } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { getProductById } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { Layers, CheckCircle2, AlertTriangle, Save, Camera, Image as ImageIcon } from 'lucide-react';
import { ProductImage } from '../../components/common/ProductImage';
import { ProductPhotosModal } from '../../components/vendor/ProductPhotosModal';

export const VendorInventory: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.id || 1;
  const { showSuccess } = useToast();

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [stockEdits, setStockEdits] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [photoModalProduct, setPhotoModalProduct] = useState<Product | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await marketplaceService.getVendorInventory(vendorId);
      setInventory(items);
      const edits: Record<number, number> = {};
      for (const i of items) {
        edits[i.inventory_id] = i.quantity;
      }
      setStockEdits(edits);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [vendorId]);

  const handleUpdateStock = async (invId: number) => {
    const qty = stockEdits[invId];
    if (qty === undefined) return;
    await marketplaceService.updateVendorStock(invId, qty);
    showSuccess('Stock level updated successfully.', 'Inventory Synchronized');
    loadInventory();
  };

  const getStockBadge = (qty: number) => {
    if (qty <= 0) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-[#DC2626] border border-rose-200">
          Out of Stock
        </span>
      );
    }
    if (qty < 10) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          Low Stock
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">
        In Stock
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Store Inventory & Stock Levels</h1>
        <p className="text-xs text-[#647070]">
          Audit stock availability across warehouse hubs in real time
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {inventory.map(item => {
                const prod = getProductById(item.product_id);
                const currentEdit = stockEdits[item.inventory_id] ?? item.quantity;
                const hasChanged = currentEdit !== item.quantity;

                return (
                  <tr key={item.inventory_id} className="hover:bg-[#F8FAF9]">
                    <td className="py-3 px-4 font-semibold text-[#172121]">
                      <div className="flex items-center gap-2 max-w-[220px]">
                        <button
                          type="button"
                          onClick={() => {
                            if (prod) {
                              setPhotoModalProduct(prod);
                              setIsPhotoModalOpen(true);
                            }
                          }}
                          className="relative group shrink-0 cursor-pointer"
                          title="Click to view/manage product pictures"
                        >
                          <ProductImage
                            productId={item.product_id}
                            category={prod?.category}
                            productName={prod?.product_name || `Product #${item.product_id}`}
                            customImages={prod?.images}
                            size="xs"
                            className="w-9 h-9 shrink-0 rounded transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </button>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{prod?.product_name || `Product #${item.product_id}`}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (prod) {
                                setPhotoModalProduct(prod);
                                setIsPhotoModalOpen(true);
                              }
                            }}
                            className="text-[10px] text-[#0F766E] hover:underline font-medium flex items-center gap-0.5 text-left"
                          >
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>
                              {prod?.images && prod.images.length > 0
                                ? `${prod.images.length} photos`
                                : '+ Add photos'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#647070]">{item.business_name}</td>
                    <td className="py-3 px-4 font-bold text-[#172121] tabular-nums">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={currentEdit}
                        onChange={e =>
                          setStockEdits({
                            ...stockEdits,
                            [item.inventory_id]: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-20 px-2 py-1 border border-[#E2E8E6] rounded text-xs font-semibold tabular-nums text-[#172121] focus:outline-none focus:border-[#0F766E]"
                      />
                    </td>
                    <td className="py-3 px-4">{getStockBadge(item.quantity)}</td>
                    <td className="py-3 px-4 text-[#647070] font-mono text-[11px]">
                      {item.last_updated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {hasChanged && (
                        <button
                          onClick={() => handleUpdateStock(item.inventory_id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0F766E] text-white text-[11px] font-semibold hover:bg-[#115E59] transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Product Photos Modal */}
      <ProductPhotosModal
        product={photoModalProduct}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotosUpdated={() => loadInventory()}
      />
    </div>
  );
};
