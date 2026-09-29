import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/database';
import { ProductImage } from './ProductImage';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { getVendorById } from '../../services/storage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCartWishlist();
  const wishlisted = isWishlisted(product.product_id);
  const vendor = getVendorById(product.vendor_id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.product_id, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.product_id);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-[#E2E8E6] hover:border-[#CBD5D1] transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Visual / Image */}
      <Link to={`/product/${product.product_id}`} className="block relative overflow-hidden p-3 pb-0">
        <ProductImage
          productId={product.product_id}
          category={product.category}
          productName={product.product_name}
          customImages={product.images}
          size="md"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-all z-20 ${
            wishlisted
              ? 'bg-rose-50 border-rose-200 text-[#F26B5E]'
              : 'bg-white/90 border-[#E2E8E6] text-[#647070] hover:text-[#F26B5E] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#F26B5E]' : ''}`} />
        </button>
      </Link>

      {/* Details Container */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Vendor metadata with unboxed separator */}
        <div className="flex items-center gap-1.5 text-xs text-[#647070] mb-1.5">
          <span className="font-medium text-[#0F766E]">{product.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="truncate max-w-[140px]">{vendor?.business_name || 'Verified Merchant'}</span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.product_id}`}
          className="font-semibold text-sm text-[#172121] hover:text-[#0F766E] transition-colors line-clamp-2 min-h-[40px] leading-snug"
        >
          {product.product_name}
        </Link>

        {/* Rating unboxed text */}
        <div className="flex items-center gap-1 text-xs text-[#647070] mt-2 mb-3">
          <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
          <span className="font-semibold text-[#172121] tabular-nums">{product.rating || 4.5}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>({product.review_count || 120} reviews)</span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto pt-3 border-t border-[#E2E8E6]/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-[#647070] block">Price</span>
            <span className="text-base font-bold text-[#172121] tabular-nums tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
