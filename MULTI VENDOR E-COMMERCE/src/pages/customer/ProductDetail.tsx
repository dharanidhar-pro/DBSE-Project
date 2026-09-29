import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, Vendor, Inventory, ProductReview } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { ProductImage } from '../../components/common/ProductImage';
import { ProductCard } from '../../components/common/ProductCard';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useAuth } from '../../context/AuthContext';
import { getVendorById, getInventory } from '../../services/storage';
import { getProductImageGallery } from '../../services/productImages';
import {
  addRecentlyViewed,
  getRecentlyViewedProducts,
  getProductReviews,
  addProductReview,
  getRatingDistribution,
  verifyDeliveryPinCode,
  getSavedDeliveryPinCode,
  saveDeliveryPinCode,
  PinCodeVerificationResult,
} from '../../services/marketplaceFeatures';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  ShoppingCart,
  Zap,
  ArrowLeft,
  Store,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [youMayAlsoLike, setYouMayAlsoLike] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // PIN Code Delivery State
  const [pincode, setPincode] = useState(() => getSavedDeliveryPinCode());
  const [pinResult, setPinResult] = useState<PinCodeVerificationResult | null>(() =>
    verifyDeliveryPinCode(getSavedDeliveryPinCode())
  );

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  const { addToCart, toggleWishlist, isWishlisted } = useCartWishlist();
  const wishlisted = isWishlisted(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const item = await marketplaceService.getProductById(productId);
        if (item) {
          setProduct(item);

          // Track recently viewed
          addRecentlyViewed(item.product_id);
          setRecentlyViewed(getRecentlyViewedProducts(item.product_id));

          // Multi-image gallery
          const gallery = getProductImageGallery(item.product_id, item.category, item.images);
          setGalleryImages(gallery);
          setActiveImageIndex(0);

          // Vendor & Inventory
          const v = getVendorById(item.vendor_id);
          setVendor(v || null);

          const invList = getInventory();
          const inv = invList.find(i => i.product_id === item.product_id);
          setInventory(inv || null);

          // 1. Similar Products (same category)
          const allSameCat = await marketplaceService.getProducts({ category: item.category });
          setSimilarProducts(allSameCat.filter(p => p.product_id !== item.product_id).slice(0, 4));

          // 2. You May Also Like (cross-category recommendations)
          const otherCats = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].filter(
            c => c !== item.category
          );
          const randomOtherCat = otherCats[item.product_id % otherCats.length];
          const crossItems = await marketplaceService.getProducts({ category: randomOtherCat });
          setYouMayAlsoLike(crossItems.slice(0, 4));

          // Load Reviews
          setReviews(getProductReviews(item.product_id));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Handle PIN check
  const handleCheckPinCode = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyDeliveryPinCode(pincode);
    setPinResult(result);
    if (result.available) {
      saveDeliveryPinCode(pincode);
    }
  };

  // Handle Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newReviewComment.trim()) return;

    const reviewer = newReviewName.trim() || user?.name || 'Verified Indian Buyer';
    const added = addProductReview(product.product_id, {
      customer_name: reviewer,
      rating: newReviewRating,
      title: newReviewTitle.trim() || 'Great Product Experience',
      comment: newReviewComment.trim(),
    });

    setReviews(prev => [added, ...prev]);
    setNewReviewTitle('');
    setNewReviewComment('');
    setShowReviewForm(false);
    setReviewSubmitSuccess(true);
    setTimeout(() => setReviewSubmitSuccess(false), 4000);
  };

  // Loading Skeleton State (Requirement 12)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="h-4 w-48 bg-stone-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 h-96 bg-stone-200 rounded-2xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-6 w-32 bg-stone-200 rounded" />
            <div className="h-8 w-3/4 bg-stone-200 rounded" />
            <div className="h-4 w-1/2 bg-stone-200 rounded" />
            <div className="h-12 w-48 bg-stone-200 rounded" />
            <div className="h-24 w-full bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-[#DC2626] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#172121]">Product not found</h2>
        <p className="text-xs text-[#647070]">This item may have been discontinued or removed from catalog.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  // Stock calculations
  const stock = inventory ? inventory.quantity : 15;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isModerateStock = stock > 5 && stock <= 10;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    await addToCart(product.product_id, quantity);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product.product_id, quantity);
    navigate('/checkout');
  };

  const ratingDist = getRatingDistribution(product.product_id, product.rating || 4.8, product.review_count || 320);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#647070] overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-[#172121]">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-[#172121]">{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#172121] font-semibold truncate max-w-xs">{product.product_name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery / Product Images Left */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          {/* Main Hero Photo */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-[#E2E8E6] p-2 shadow-xs group">
            <ProductImage
              productId={product.product_id}
              category={product.category}
              productName={product.product_name}
              src={galleryImages[activeImageIndex]}
              customImages={galleryImages}
              size="hero"
              className="rounded-xl transition-transform duration-300 group-hover:scale-105"
            />

            {/* Multiple photos counter badge */}
            {galleryImages.length > 1 && (
              <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                Photo {activeImageIndex + 1} of {galleryImages.length}
              </span>
            )}
          </div>

          {/* Thumbnails Carousel (Multiple Pics Support) */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20 shadow-xs'
                      : 'border-[#E2E8E6] hover:border-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase & Details Module Right */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category & Verified Merchant Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Indian Merchant</span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#172121] leading-tight">
            {product.product_name}
          </h1>

          {/* Rating & Stock Summary */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#647070] pb-3 border-b border-[#E2E8E6]">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <span className="font-bold text-[#172121] tabular-nums">{ratingDist.average}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{ratingDist.totalCount} ratings & reviews</span>
            <span aria-hidden="true" className="text-slate-300">·</span>

            {/* Realistic Stock Indicators (Requirement 4) */}
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 font-bold text-[#DC2626] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                <Clock className="w-3 h-3" />
                Only {stock} left in stock!
              </span>
            ) : isModerateStock ? (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Low Stock ({stock} left)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                <CheckCircle2 className="w-3 h-3" />
                In Stock ({stock} units)
              </span>
            )}
          </div>

          {/* Price Box */}
          <div className="space-y-1">
            <span className="text-xs text-[#647070]">Special Marketplace Price</span>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#172121] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#647070]">Inclusive of all Indian taxes (GST)</span>
            </div>
          </div>

          {/* Delivery Availability / PIN Code Checker (Requirement 5) */}
          <div className="p-4 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#172121]">
              <MapPin className="w-4 h-4 text-[#0F766E]" />
              <span>Check Delivery Availability</span>
            </div>

            <form onSubmit={handleCheckPinCode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 500001)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
              >
                Check
              </button>
            </form>

            {pinResult && (
              <div
                className={`text-xs p-2 rounded-lg border flex items-start gap-2 ${
                  pinResult.available
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {pinResult.available ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{pinResult.available ? '✓ Delivery Available' : 'Delivery Unavailable'}</p>
                  <p className="text-[11px] leading-tight mt-0.5">{pinResult.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label htmlFor="pdp-qty" className="text-xs font-semibold text-[#172121]">
                Quantity:
              </label>
              <div className="flex items-center border border-[#E2E8E6] rounded-lg bg-white">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-[#172121] hover:bg-[#F8FAF9] disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= stock}
                  onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                  className="px-3 py-1.5 text-xs text-[#172121] hover:bg-[#F8FAF9] disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-[#647070]">
                {isOutOfStock ? 'Item currently unavailable' : stock < 10 ? `Only ${stock} left!` : 'Ready for dispatch'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] rounded-xl transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] active:bg-[#0b4844] rounded-xl transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.product_id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  wishlisted
                    ? 'bg-rose-50 border-rose-200 text-[#F26B5E]'
                    : 'bg-white border-[#E2E8E6] text-[#647070] hover:text-[#F26B5E]'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#F26B5E]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8E6]">
            <h3 className="font-semibold text-xs text-[#172121]">Product Overview</h3>
            <p className="text-xs text-[#647070] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Indian Logistics Strip */}
          <div className="bg-[#FAFCFB] rounded-xl border border-[#E2E8E6] p-4 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#0F766E] shrink-0" />
              <div>
                <p className="font-semibold text-[#172121]">Express Indian Delivery</p>
                <p className="text-[#647070] text-[11px]">Free delivery on orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#0F766E] shrink-0" />
              <div>
                <p className="font-semibold text-[#172121]">7-Day Easy Return</p>
                <p className="text-[#647070] text-[11px]">Doorstep reverse pickup guarantee</p>
              </div>
            </div>
          </div>

          {/* Verified Seller Box */}
          {vendor && (
            <div className="rounded-xl border border-[#E2E8E6] p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#0F766E]" />
                  <span className="font-semibold text-[#172121]">Sold by {vendor.business_name}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  GST Verified
                </span>
              </div>
              <p className="text-[#647070] text-[11px]">
                Hub location: {vendor.business_address}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Reviews & Ratings (Requirement 3) */}
      <section className="pt-8 border-t border-[#E2E8E6] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#172121]">Ratings & Customer Reviews</h2>
            <p className="text-xs text-[#647070]">Verified customer feedback from purchases on MarketHub</p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Rating Breakdown Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAFCFB] rounded-2xl border border-[#E2E8E6] p-6 items-center">
          <div className="md:col-span-4 text-center md:text-left space-y-1 md:border-r border-[#E2E8E6] md:pr-6">
            <div className="text-4xl font-extrabold text-[#172121]">{ratingDist.average}</div>
            <div className="flex items-center justify-center md:justify-start text-amber-500 gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(ratingDist.average) ? 'fill-amber-500' : 'text-stone-300'}`}
                />
              ))}
            </div>
            <p className="text-xs text-[#647070]">{ratingDist.totalCount} ratings & reviews</p>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-8 space-y-1.5 text-xs">
            {[5, 4, 3, 2, 1].map(star => {
              const data = ratingDist.stars[star];
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-6 font-semibold text-[#647070] flex items-center gap-0.5">
                    {star} <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  </span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[11px] text-[#647070] tabular-nums">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Form (Collapsible) */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="p-5 rounded-2xl bg-white border border-[#0F766E]/40 shadow-xs space-y-4 text-xs animate-in fade-in-50 duration-150"
          >
            <h3 className="font-bold text-sm text-[#172121]">Write Your Verified Review</h3>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#172121]">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewReviewRating(s)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${s <= newReviewRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172121] mb-1">Your Name</label>
                <input
                  type="text"
                  value={newReviewName}
                  onChange={e => setNewReviewName(e.target.value)}
                  placeholder={user?.name || 'e.g. Ramesh Kumar'}
                  className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172121] mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={e => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Excellent sound quality & quick delivery"
                  className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#172121] mb-1">Detailed Review</label>
              <textarea
                required
                rows={3}
                value={newReviewComment}
                onChange={e => setNewReviewComment(e.target.value)}
                placeholder="Share your honest experience regarding performance, build quality, and packaging..."
                className="w-full px-3 py-2 border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-[#E2E8E6] rounded-lg text-[#647070] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        )}

        {reviewSubmitSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your verified review has been posted successfully.</span>
          </div>
        )}

        {/* Customer Review Cards List */}
        <div className="space-y-3">
          {reviews.length > 0 ? (
            reviews.map(r => (
              <div
                key={r.review_id}
                className="p-4 rounded-xl bg-white border border-[#E2E8E6] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172121]">{r.customer_name}</span>
                    {r.verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#647070]">{r.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                    />
                  ))}
                  <span className="font-bold text-[#172121] ml-1.5">{r.title}</span>
                </div>

                <p className="text-[#647070] leading-relaxed">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#647070] italic">Be the first to review this product!</p>
          )}
        </div>
      </section>

      {/* Similar Products (Requirement 2) */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-[#E2E8E6] space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#172121]">Similar Products in {product.category}</h2>
            <p className="text-xs text-[#647070]">More verified picks with matching attributes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {similarProducts.map(p => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* You May Also Like (Requirement 2) */}
      {youMayAlsoLike.length > 0 && (
        <section className="pt-8 border-t border-[#E2E8E6] space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#172121]">You May Also Like</h2>
            <p className="text-xs text-[#647070]">Popular recommendations from complementary categories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {youMayAlsoLike.map(p => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products (Requirement 1) */}
      {recentlyViewed.length > 0 && (
        <section className="pt-8 border-t border-[#E2E8E6] space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#172121]">Recently Viewed</h2>
            <p className="text-xs text-[#647070]">Products you looked at during your browsing session</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recentlyViewed.map(p => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
