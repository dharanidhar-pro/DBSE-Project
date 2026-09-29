import React, { useState, useEffect } from 'react';
import { Product } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { getProductImageUrl } from '../../services/productImages';
import { ProductPhotoManager } from './ProductPhotoManager';
import { useToast } from '../../context/ToastContext';
import { X, Layers, Save, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ProductPhotosModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated?: (updatedProduct: Product) => void;
}

export const ProductPhotosModal: React.FC<ProductPhotosModalProps> = ({
  product,
  isOpen,
  onClose,
  onPhotosUpdated,
}) => {
  const { showSuccess, showError } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setImages([...product.images]);
      } else {
        // Default to the designated catalog image so vendor starts with their product picture
        setImages([getProductImageUrl(product.product_id, product.category)]);
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated: Product = {
        ...product,
        images: images.length > 0 ? images : undefined,
      };

      await marketplaceService.saveProduct(updated);
      showSuccess(
        `Updated photos for "${product.product_name}". Multiple pictures saved!`,
        'Gallery Updated'
      );
      if (onPhotosUpdated) {
        onPhotosUpdated(updated);
      }
      onClose();
    } catch (err) {
      showError('Failed to save product photos. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="bg-white rounded-2xl border border-[#E2E8E6] max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E6] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#172121]">Manage Product Pictures</h2>
            </div>
            <p className="text-xs text-[#647070] mt-1">
              Add multiple pictures for <span className="font-semibold text-[#172121]">{product.product_name}</span> ({product.category})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#647070] hover:text-[#172121] hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rich Multi-Photo Manager */}
        <ProductPhotoManager
          images={images}
          onChange={setImages}
          category={product.category}
          productName={product.product_name}
          maxImages={10}
        />

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#E2E8E6] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#647070]">
            {images.length === 0
              ? 'No custom photos (default photo will be used)'
              : `${images.length} photo(s) will be published to your product page`}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#647070] hover:text-[#172121] border border-[#E2E8E6] rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Photos...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Publish Photos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
