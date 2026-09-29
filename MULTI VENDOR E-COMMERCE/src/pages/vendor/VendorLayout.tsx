import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../../components/profile/UserAvatar';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Store,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const VendorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/vendor/login');
  };

  const navItems = [
    { label: 'Overview', path: '/vendor/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/vendor/products', icon: Package },
    { label: 'Inventory', path: '/vendor/inventory', icon: Layers },
    { label: 'Orders & Dispatch', path: '/vendor/orders', icon: ShoppingBag },
    { label: 'Merchant Profile', path: '/vendor/profile', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E2E8E6] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Merchant Brand & Profile */}
          <div className="px-2 pt-2">
            <Link to="/" className="flex items-center gap-1.5 text-lg font-bold text-[#172121]">
              <span>Market</span>
              <span className="text-[#F26B5E]">Hub</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">
                Seller
              </span>
            </Link>

            <Link
              to="/vendor/profile"
              className="mt-3 p-2 rounded-xl bg-[#F8FAF9] hover:bg-teal-50/50 border border-[#E2E8E6] hover:border-[#0F766E]/40 flex items-center gap-2.5 transition-all group"
              title="Click to customize store profile & logo"
            >
              <UserAvatar
                name={user?.business_name || user?.name}
                avatar={user?.avatar}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-[#647070] block leading-none">Store</span>
                <span className="font-semibold text-xs text-[#172121] truncate block group-hover:text-[#0F766E] transition-colors mt-0.5">
                  {user?.business_name || user?.name || 'Verified Vendor'}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-[#0F766E] font-semibold'
                      : 'text-[#647070] hover:bg-[#F8FAF9] hover:text-[#172121]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E2E8E6] space-y-2 text-xs">
          <Link
            to="/shop"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-[#647070] hover:text-[#0F766E] transition-colors"
          >
            <span>View Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Seller Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
