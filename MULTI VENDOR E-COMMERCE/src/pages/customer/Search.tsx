import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { ProductCard } from '../../components/common/ProductCard';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const results = await marketplaceService.getProducts({ search: query });
        setProducts(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="pb-6 border-b border-[#E2E8E6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#647070] mb-1">
            <Link to="/shop" className="hover:text-[#0F766E] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">
            Search results for <span className="text-[#0F766E]">"{query}"</span>
          </h1>
          <p className="text-xs text-[#647070] mt-0.5">
            Found <span className="font-semibold text-[#172121]">{products.length}</span> matching products
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      <div className="pt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-72 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8E6] p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#647070]">
              <SearchIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172121]">No products found</h3>
            <p className="text-xs text-[#647070]">
              Try another search or browse categories such as Electronics, Fashion, Home & Living, Sports, or Books.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/shop"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
