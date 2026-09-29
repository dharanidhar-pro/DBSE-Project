import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { ProductCard } from '../../components/common/ProductCard';
import {
  ArrowRight,
  Sparkles,
  Store,
  ChevronRight,
  ShieldCheck,
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const all = await marketplaceService.getProducts();
        // Curate featured items from different categories
        setFeaturedProducts(all.slice(0, 8));
        // High rating items as deals
        setDealProducts(all.filter(p => (p.rating || 0) >= 4.7).slice(0, 4));
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories = [
    { name: 'Electronics', count: '35+ Gadgets', icon: Laptop, color: 'text-[#0F766E]', bg: 'bg-teal-50', path: '/shop?category=Electronics' },
    { name: 'Fashion', count: '30+ Styles', icon: Shirt, color: 'text-[#F26B5E]', bg: 'bg-rose-50', path: '/shop?category=Fashion' },
    { name: 'Home & Living', count: '30+ Essentials', icon: Home, color: 'text-[#D97706]', bg: 'bg-amber-50', path: '/shop?category=Home' },
    { name: 'Sports', count: '25+ Gear', icon: Dumbbell, color: 'text-[#059669]', bg: 'bg-emerald-50', path: '/shop?category=Sports' },
    { name: 'Books', count: '30+ Titles', icon: BookOpen, color: 'text-[#7C3AED]', bg: 'bg-purple-50', path: '/shop?category=Books' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Compact Hero Section per Section 12 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F26B5E_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F26B5E]" />
              <span>Multi-Vendor Indian Marketplace</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Shop directly from verified Indian sellers.
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
              Discover authentic electronics, apparel, home crafts, sports gear, and books delivered with fast doorstep tracking and secure UPI / COD payments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] transition-colors shadow-xs"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?category=Electronics"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-stone-200 bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
              >
                Explore Electronics
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:flex justify-end">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs max-w-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                <span>Verified Multi-Vendor Platform</span>
              </div>
              <p className="text-xs text-stone-400 leading-normal">
                Every merchant undergoes strict GST verification, catalog auditing, and fulfillment SLA commitments before joining MarketHub.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-300 border-t border-white/10">
                <span>100% Genuine Brands</span>
                <span className="text-[#F26B5E] font-semibold">₹ Free Delivery &gt; ₹999</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#172121]">Browse by Category</h2>
            <p className="text-xs text-[#647070]">Curated collections from specialized merchants</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="group p-4 bg-white rounded-xl border border-[#E2E8E6] hover:border-[#0F766E]/40 hover:shadow-xs transition-all flex flex-col items-center text-center space-y-2.5"
              >
                <div className={`p-3 rounded-xl ${cat.bg} ${cat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#172121] group-hover:text-[#0F766E] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#647070]">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#172121]">Featured Marketplace Products</h2>
            <p className="text-xs text-[#647070]">Top picks directly from certified Indian manufacturers & sellers</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <span>View All ({featuredProducts.length}+)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-72 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Top Rated / Deals Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFCFB] rounded-2xl border border-[#E2E8E6] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F766E]">
                <Sparkles className="w-4 h-4" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-lg font-bold text-[#172121] mt-0.5">Highly Rated Collections (★ 4.7+)</h2>
            </div>
            <Link
              to="/shop?sort=rating"
              className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
            >
              <span>Explore Highest Rated</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dealProducts.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Seller CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-800/80 text-teal-200 text-xs font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Onboarding Open</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Grow your retail business on MarketHub</h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Register as a verified seller today. Manage inventory, process automated dispatch labels, and receive weekly payouts with zero listing fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/vendor/register"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 transition-colors shadow-xs"
            >
              Apply as a Seller
            </Link>
            <Link
              to="/vendor/login"
              className="px-4 py-2.5 rounded-lg text-xs font-medium text-white hover:text-teal-200 transition-colors"
            >
              Merchant Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
