import React from 'react';
import { Link } from 'react-router-dom';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { getProductById, getVendorById } from '../../services/storage';
import { ProductImage } from '../../components/common/ProductImage';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();

  const products = wishlist.map(id => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-[#647070]">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-[#172121]">Your Wishlist is Empty</h1>
        <p className="text-xs text-[#647070]">
          Save items that catch your eye while browsing to easily revisit and purchase them later.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">My Wishlist</h1>
        <p className="text-xs text-[#647070]">
          You have <span className="font-semibold text-[#172121]">{products.length}</span> saved item(s)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map(product => {
          if (!product) return null;
          const vendor = getVendorById(product.vendor_id);

          return (
            <div
              key={product.product_id}
              className="bg-white rounded-xl border border-[#E2E8E6] p-4 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#CBD5D1] transition-all"
            >
              <div>
                <ProductImage
                  productId={product.product_id}
                  category={product.category}
                  productName={product.product_name}
                  size="md"
                  className="rounded-lg mb-3"
                />

                <div className="flex items-center justify-between text-xs text-[#647070] mb-1">
                  <span className="font-medium text-[#0F766E]">{product.category}</span>
                  <span className="truncate max-w-[120px]">{vendor?.business_name}</span>
                </div>

                <Link
                  to={`/product/${product.product_id}`}
                  className="font-semibold text-sm text-[#172121] hover:text-[#0F766E] line-clamp-2 leading-snug"
                >
                  {product.product_name}
                </Link>

                <div className="flex items-center gap-1 text-xs text-[#647070] mt-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-[#172121] tabular-nums">{product.rating || 4.5}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8E6] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#647070] block">Price</span>
                  <span className="text-base font-bold text-[#172121] tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product.product_id)}
                    aria-label="Remove from wishlist"
                    className="p-2 text-[#647070] hover:text-[#DC2626] rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => addToCart(product.product_id, 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#F26B5E] hover:bg-[#D9574D] rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
