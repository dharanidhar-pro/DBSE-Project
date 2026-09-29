import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Vendor } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { ProductCard } from '../../components/common/ProductCard';
import { Filter, SlidersHorizontal, X, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Filter states
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'relevance';
  const vendorParam = searchParams.get('vendor') ? Number(searchParams.get('vendor')) : undefined;
  const minRatingParam = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [items, vList] = await Promise.all([
          marketplaceService.getProducts({
            category: categoryParam,
            sort: sortParam,
            vendorId: vendorParam,
            minRating: minRatingParam,
            maxPrice: maxPriceParam,
          }),
          marketplaceService.getAllVendors(),
        ]);
        setProducts(items);
        setVendors(vList.filter(v => v.approval_status === 'Approved'));
      } catch (err) {
        console.error('Failed to fetch shop products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryParam, sortParam, vendorParam, minRatingParam, maxPriceParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, sortParam, vendorParam, minRatingParam, maxPriceParam]);

  const updateFilter = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount = [
    categoryParam !== 'All',
    vendorParam !== undefined,
    minRatingParam !== undefined,
    maxPriceParam !== undefined,
  ].filter(Boolean).length;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar: Title, Count, Mobile Filter Trigger, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2E8E6] gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">
            {categoryParam === 'All' ? 'All Products' : `${(categoryParam === 'Home' || categoryParam === 'Home & Living') ? 'Home & Living' : categoryParam} Products`}
          </h1>
          <p className="text-xs text-[#647070] mt-0.5">
            Showing <span className="font-semibold text-[#172121]">{products.length}</span> items across verified Indian merchants
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#172121] bg-white border border-[#E2E8E6] rounded-lg"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#647070] hidden sm:inline">Sort:</span>
            <select
              value={sortParam}
              onChange={e => updateFilter('sort', e.target.value)}
              className="py-1.5 px-3 bg-white border border-[#E2E8E6] rounded-lg text-xs font-medium text-[#172121] focus:outline-none focus:border-[#0F766E]"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 text-xs">
          {/* Active filters header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
            <span className="font-bold text-sm text-[#172121]">Filters</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#F26B5E] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <span className="font-semibold text-[#172121] block">Category</span>
            <div className="space-y-1">
              {categories.map(cat => {
                const isSelected = (cat === 'Home' && (categoryParam === 'Home' || categoryParam === 'Home & Living')) || categoryParam === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-teal-50 text-[#0F766E] font-semibold'
                        : 'text-[#647070] hover:bg-[#F8FAF9] hover:text-[#172121]'
                    }`}
                  >
                    <span>{cat === 'Home' ? 'Home & Living' : cat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8E6]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#172121]">Max Price</span>
              <span className="font-mono font-semibold text-[#172121]">
                {maxPriceParam !== undefined ? `₹${maxPriceParam.toLocaleString('en-IN')}` : 'All (₹1,00,000+)'}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="1000"
              value={maxPriceParam !== undefined ? maxPriceParam : 100000}
              onChange={e => updateFilter('maxPrice', e.target.value)}
              className="w-full accent-[#0F766E] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-[#647070]">
              <span>₹500</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8E6]">
            <span className="font-semibold text-[#172121] block">Customer Rating</span>
            <div className="space-y-1">
              {[4.5, 4.0, 3.5].map(rating => {
                const isSelected = minRatingParam === rating;
                return (
                  <button
                    key={rating}
                    onClick={() => updateFilter('rating', isSelected ? undefined : String(rating))}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-[#647070] hover:bg-[#F8FAF9] hover:text-[#172121]'
                    }`}
                  >
                    <span>★ {rating} & above</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vendor Filter */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8E6]">
            <span className="font-semibold text-[#172121] block">Merchant</span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {vendors.map(v => {
                const isSelected = vendorParam === v.vendor_id;
                return (
                  <button
                    key={v.vendor_id}
                    onClick={() => updateFilter('vendor', isSelected ? undefined : String(v.vendor_id))}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors truncate ${
                      isSelected
                        ? 'bg-teal-50 text-[#0F766E] font-semibold'
                        : 'text-[#647070] hover:bg-[#F8FAF9] hover:text-[#172121]'
                    }`}
                  >
                    <span className="truncate">{v.business_name}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-72 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8E6] p-12 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#647070]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172121]">No products found</h3>
              <p className="text-xs text-[#647070] max-w-sm mx-auto">
                No active products match your selected filters. Try resetting your criteria or browse a different category.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentProducts.map(product => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#E2E8E6] gap-4 text-xs">
                  <span className="text-[#647070]">
                    Showing <span className="font-semibold text-[#172121]">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-semibold text-[#172121]">{Math.min(currentPage * itemsPerPage, products.length)}</span> of{' '}
                    <span className="font-semibold text-[#172121]">{products.length}</span> products
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#E2E8E6] text-[#172121] hover:bg-[#F8FAF9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg font-medium text-xs transition-colors ${
                          currentPage === page
                            ? 'bg-[#0F766E] text-white shadow-xs font-semibold'
                            : 'border border-[#E2E8E6] text-[#647070] hover:bg-[#F8FAF9] hover:text-[#172121]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#E2E8E6] text-[#172121] hover:bg-[#F8FAF9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E6]">
                <span className="font-bold text-base text-[#172121]">Filter Catalog</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-[#647070] hover:text-[#172121]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <span className="font-semibold text-[#172121] block mb-2">Category</span>
                <div className="space-y-1">
                  {categories.map(cat => {
                    const isSelected = (cat === 'Home' && (categoryParam === 'Home' || categoryParam === 'Home & Living')) || categoryParam === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          updateFilter('category', cat);
                          setMobileFiltersOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg ${
                          isSelected ? 'bg-teal-50 text-[#0F766E] font-semibold' : 'text-[#647070]'
                        }`}
                      >
                        {cat === 'Home' ? 'Home & Living' : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Price */}
              <div className="pt-4 border-t border-[#E2E8E6]">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#172121]">Max Price</span>
                  <span className="font-bold text-[#172121]">
                    {maxPriceParam !== undefined ? `₹${maxPriceParam.toLocaleString('en-IN')}` : 'All (₹1,00,000+)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="1000"
                  value={maxPriceParam !== undefined ? maxPriceParam : 100000}
                  onChange={e => updateFilter('maxPrice', e.target.value)}
                  className="w-full accent-[#0F766E]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E8E6] flex gap-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-2 text-xs font-medium border border-[#E2E8E6] rounded-lg text-[#647070]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2 text-xs font-semibold bg-[#0F766E] text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

