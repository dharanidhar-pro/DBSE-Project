import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { UserAvatar } from '../profile/UserAvatar';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Package,
  LogOut,
  Store,
  ShieldCheck,
  ChevronDown,
  Edit3,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { cartCount, wishlist } = useCartWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    { name: 'All Products', path: '/shop' },
    { name: 'Electronics', path: '/shop?category=Electronics' },
    { name: 'Fashion', path: '/shop?category=Fashion' },
    { name: 'Home & Living', path: '/shop?category=Home' },
    { name: 'Sports', path: '/shop?category=Sports' },
    { name: 'Books', path: '/shop?category=Books' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8E6] transition-all">
      {/* Main Bar: Top Bar Contract (Wordmark — Search/Nav — Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-[#172121] hover:bg-[#F8FAF9]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#172121]">
              <span className="text-[#172121]">Market</span>
              <span className="text-[#F26B5E]">Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] inline-block mb-1" />
            </Link>
          </div>

          {/* Zone 2: Prominent Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands and categories in India..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors text-[#172121] placeholder:text-[#647070]"
              />
              <Search className="w-4 h-4 text-[#647070] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Zone 3: Primary Actions (Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#172121] hover:text-[#F26B5E] hover:bg-[#F8FAF9] rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#F26B5E] rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 p-2 text-[#172121] hover:text-[#0F766E] hover:bg-[#F8FAF9] rounded-lg transition-colors"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-[#0F766E] rounded-full tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-medium">Cart</span>
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 py-1 px-2 rounded-lg border border-[#E2E8E6] text-xs font-medium text-[#172121] hover:bg-[#F8FAF9] transition-colors cursor-pointer"
                  >
                    <UserAvatar
                      name={user.name || user.business_name}
                      avatar={user.avatar}
                      size="xs"
                    />
                    <span className="truncate max-w-[85px] sm:max-w-[120px] font-semibold text-[#172121]">
                      {role === 'CUSTOMER' ? user.name.split(' ')[0] : role === 'VENDOR' ? (user.business_name || 'Seller') : 'Admin'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647070]" />
                  </button>

                  {accountMenuOpen && (
                    <div
                      onMouseLeave={() => setAccountMenuOpen(false)}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-[#E2E8E6] py-1.5 z-50 text-xs animate-in fade-in-50 duration-150"
                    >
                      <div className="px-3.5 py-3 border-b border-[#E2E8E6] flex items-center gap-3">
                        <UserAvatar
                          name={user.name || user.business_name}
                          avatar={user.avatar}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#172121] truncate">{user.name}</p>
                          <p className="text-[#647070] text-[11px] truncate">{user.email}</p>
                          <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {role === 'CUSTOMER' && (
                        <>
                          <Link
                            to="/account?edit=profile"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center justify-between px-3.5 py-2 hover:bg-[#F8FAF9] text-[#0F766E] font-medium"
                          >
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-[#0F766E]" />
                              <span>Customize Profile</span>
                            </div>
                            <span className="text-[10px] bg-teal-50 text-[#0F766E] px-1.5 py-0.5 rounded border border-teal-200 font-semibold">
                              New
                            </span>
                          </Link>
                          <Link
                            to="/account"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8FAF9] text-[#172121]"
                          >
                            <User className="w-4 h-4 text-[#647070]" />
                            <span>Account Dashboard</span>
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8FAF9] text-[#172121]"
                          >
                            <Package className="w-4 h-4 text-[#647070]" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8FAF9] text-[#172121]"
                          >
                            <Heart className="w-4 h-4 text-[#647070]" />
                            <span>Saved Items</span>
                          </Link>
                        </>
                      )}

                      {role === 'VENDOR' && (
                        <>
                          <Link
                            to="/vendor/profile"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center justify-between px-3.5 py-2 hover:bg-[#F8FAF9] text-[#0F766E] font-medium"
                          >
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-[#0F766E]" />
                              <span>Customize Store Profile</span>
                            </div>
                          </Link>
                          <Link
                            to="/vendor/dashboard"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8FAF9] text-[#172121]"
                          >
                            <Store className="w-4 h-4 text-[#0F766E]" />
                            <span>Seller Dashboard</span>
                          </Link>
                          <Link
                            to="/vendor/orders"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8FAF9] text-[#172121]"
                          >
                            <Package className="w-4 h-4 text-[#647070]" />
                            <span>Customer Orders</span>
                          </Link>
                        </>
                      )}

                      {role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F8FAF9] text-[#172121]"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="border-t border-[#E2E8E6] mt-1 pt-1">
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-[#DC2626] hover:bg-rose-50 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products, brands and categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs bg-[#F8FAF9] border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
            />
            <Search className="w-3.5 h-3.5 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 text-[11px] font-semibold text-white bg-[#0F766E] rounded-md"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Sub-Nav Bar: Clean Categories (Single line, text with hover underlines) */}
      <div className="hidden lg:block border-t border-[#E2E8E6]/60 bg-[#FAFCFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
            <nav className="flex items-center gap-6 font-medium text-[#647070]">
              {categories.map(cat => {
                const isActive = location.pathname + location.search === cat.path;
                return (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className={`transition-colors hover:text-[#0F766E] whitespace-nowrap ${
                      isActive ? 'text-[#0F766E] font-semibold' : ''
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 text-xs">
              <Link
                to="/vendor/login"
                className="flex items-center gap-1.5 font-medium text-[#0F766E] hover:text-[#115E59] transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Sell on MarketHub</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8E6] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#647070] mb-1">Categories</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F8FAF9] text-[#172121] text-xs font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#E2E8E6] pt-3">
            <Link
              to="/vendor/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-xs font-semibold text-[#0F766E]"
            >
              <Store className="w-4 h-4" />
              <span>Seller Portal / Register as Vendor</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
