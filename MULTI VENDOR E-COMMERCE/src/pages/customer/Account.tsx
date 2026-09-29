import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { UserAvatar } from '../../components/profile/UserAvatar';
import { ProfileEditModal } from '../../components/profile/ProfileEditModal';
import {
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  Edit3,
  Camera,
  Sparkles,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { wishlist } = useCartWishlist();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalInitialTab, setEditModalInitialTab] = useState<'details' | 'picture'>('details');

  // Handle opening modal via URL params e.g. /account?edit=profile or /account?edit=picture
  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'picture' || editParam === 'avatar') {
      setEditModalInitialTab('picture');
      setIsEditModalOpen(true);
    } else if (editParam === 'profile' || editParam === 'true') {
      setEditModalInitialTab('details');
      setIsEditModalOpen(true);
    }
  }, [searchParams]);

  const handleOpenEdit = (tab: 'details' | 'picture' = 'details') => {
    setEditModalInitialTab(tab);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    // Remove query param if present
    if (searchParams.get('edit')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('edit');
      setSearchParams(newParams, { replace: true });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar with Title and Actions */}
      <div className="pb-4 border-b border-[#E2E8E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Account Dashboard</h1>
          <p className="text-xs text-[#647070]">
            Manage your personal profile, addresses, avatar photo, and order history
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleOpenEdit('details')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-all shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#DC2626] bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card with Interactive Avatar & Name */}
      <div className="bg-white rounded-2xl border border-[#E2E8E6] p-6 space-y-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                size="lg"
                editable
                onEditClick={() => handleOpenEdit('picture')}
              />
              <button
                type="button"
                onClick={() => handleOpenEdit('picture')}
                className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] font-bold transition-opacity cursor-pointer"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>Edit</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[#172121]">{user?.name}</h2>
                <button
                  type="button"
                  onClick={() => handleOpenEdit('details')}
                  className="p-1 text-stone-400 hover:text-[#0F766E] transition-colors rounded"
                  title="Edit name and details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#647070] mt-0.5">
                <span>Customer Account</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-[#0F766E] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Member
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleOpenEdit('picture')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F766E] bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{user?.avatar ? 'Change Picture' : 'Add Profile Picture'}</span>
            </button>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#E2E8E6]">
          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1">
            <span className="text-[#647070] flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#0F766E]" />
              Email Address
            </span>
            <p className="font-semibold text-[#172121] font-mono">{user?.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1">
            <span className="text-[#647070] flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
              Contact Phone
            </span>
            <p className="font-semibold text-[#172121]">{user?.phone || '+91 98765 43210'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[#647070] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                Default Indian Shipping Address
              </span>
              <button
                type="button"
                onClick={() => handleOpenEdit('details')}
                className="text-[11px] text-[#0F766E] hover:underline font-semibold"
              >
                Change Address
              </button>
            </div>
            <p className="font-medium text-[#172121] leading-relaxed">
              {user?.address || 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/orders"
          className="group bg-white rounded-xl border border-[#E2E8E6] p-5 hover:border-[#0F766E] transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-teal-50 text-[#0F766E]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172121] group-hover:text-[#0F766E] transition-colors">
                My Orders & Deliveries
              </h3>
              <p className="text-xs text-[#647070]">View tracking, invoices, and reorder</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#0F766E]">View →</span>
        </Link>

        <Link
          to="/wishlist"
          className="group bg-white rounded-xl border border-[#E2E8E6] p-5 hover:border-[#F26B5E] transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-rose-50 text-[#F26B5E]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172121] group-hover:text-[#F26B5E] transition-colors">
                Saved Wishlist ({wishlist.length})
              </h3>
              <p className="text-xs text-[#647070]">Products saved for later checkout</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#F26B5E]">View →</span>
        </Link>
      </div>

      {/* Profile Customization Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        initialTab={editModalInitialTab}
      />
    </div>
  );
};

