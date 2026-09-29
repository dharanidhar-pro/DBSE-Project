import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVendorById } from '../../services/storage';
import { UserAvatar } from '../../components/profile/UserAvatar';
import { ProfileEditModal } from '../../components/profile/ProfileEditModal';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Camera,
  Store,
} from 'lucide-react';

export const VendorProfile: React.FC = () => {
  const { user } = useAuth();
  const vendor = user?.id ? getVendorById(user.id) : null;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editInitialTab, setEditInitialTab] = useState<'details' | 'picture'>('details');

  const handleOpenEdit = (tab: 'details' | 'picture' = 'details') => {
    setEditInitialTab(tab);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Merchant Business Profile</h1>
          <p className="text-xs text-[#647070]">
            Verified business details, store logo, GSTIN compliance, and operational registry
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenEdit('details')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Customize Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E6] p-6 space-y-6 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <UserAvatar
                name={vendor?.business_name || user?.business_name || user?.name}
                avatar={vendor?.avatar || user?.avatar}
                size="lg"
                editable
                onEditClick={() => handleOpenEdit('picture')}
              />
              <button
                type="button"
                onClick={() => handleOpenEdit('picture')}
                className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] font-bold transition-opacity cursor-pointer"
                title="Change store logo / picture"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>Logo</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#172121]">
                  {vendor?.business_name || user?.business_name || user?.name}
                </h2>
                <button
                  type="button"
                  onClick={() => handleOpenEdit('details')}
                  className="p-1 text-stone-400 hover:text-[#0F766E] transition-colors rounded"
                  title="Edit merchant details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#647070] mt-0.5">
                <Store className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>MarketHub Certified Merchant</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: {vendor?.approval_status || user?.approval_status || 'Approved'}</span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenEdit('picture')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#0F766E] bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Store Photo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#E2E8E6]">
          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1">
            <span className="text-[#647070] flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#0F766E]" />
              Merchant Email
            </span>
            <p className="font-semibold text-[#172121] font-mono">{vendor?.email || user?.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1">
            <span className="text-[#647070] flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
              Merchant Hotline
            </span>
            <p className="font-semibold text-[#172121]">{vendor?.phone || user?.phone || '9000000001'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[#647070] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                Registered Commercial Address
              </span>
              <button
                type="button"
                onClick={() => handleOpenEdit('details')}
                className="text-[11px] text-[#0F766E] hover:underline font-semibold"
              >
                Update Address
              </button>
            </div>
            <p className="font-medium text-[#172121] leading-relaxed">
              {vendor?.business_address || user?.address || 'Hyderabad, Telangana'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1">
            <span className="text-[#647070] flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
              Application Date
            </span>
            <p className="font-mono text-[#172121]">{vendor?.registration_date || '2026-09-01'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFCFB] border border-[#E2E8E6] space-y-1">
            <span className="text-[#647070] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
              Administrator Approval Date
            </span>
            <p className="font-mono text-[#172121]">{vendor?.approved_date || '2026-09-02'}</p>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTab={editInitialTab}
      />
    </div>
  );
};
