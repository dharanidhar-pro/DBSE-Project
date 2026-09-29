import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../../components/profile/UserAvatar';
import { ProfileEditModal } from '../../components/profile/ProfileEditModal';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Store,
  Package,
  Layers,
  ShoppingBag,
  BarChart3,
  LogOut,
  ExternalLink,
  Edit3,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAdminLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Operations Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Vendor Approvals', path: '/admin/vendors', icon: Store },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Global Inventory', path: '/admin/inventory', icon: Layers },
    { label: 'Master Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Platform Reports', path: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col md:flex-row">
      {/* Dark Sidebar for Operations Console */}
      <aside className="w-full md:w-64 bg-[#111827] text-white p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="px-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0F766E] text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block">MarketHub Admin</span>
                <span className="text-[10px] text-stone-400 font-mono">DBMS Architecture v1.0</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-stone-400 border-t border-stone-800 pt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <UserAvatar
                  name={user?.name || 'Administrator'}
                  avatar={user?.avatar}
                  size="xs"
                />
                <span className="truncate">
                  <strong className="text-white">{user?.name || 'Administrator'}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition-colors cursor-pointer"
                title="Customize admin profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0F766E]" />
              </button>
            </div>
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
                      ? 'bg-[#0F766E] text-white font-semibold shadow-xs'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
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
        <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-stone-400 hover:text-white transition-colors"
          >
            <span>Public Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl overflow-y-auto">
        <Outlet />
      </main>

      {/* Admin Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
