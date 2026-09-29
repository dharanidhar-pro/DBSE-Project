import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { AVATAR_PRESETS, compressAndFormatImage, AvatarPreset } from './avatarPresets';
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Check,
  User,
  Phone,
  MapPin,
  Mail,
  Store,
  Sparkles,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'picture' | 'details';
}

type PictureSourceTab = 'upload' | 'presets' | 'url';

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'details',
}) => {
  const { user, role, updateProfile } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // UI states
  const [activeTab, setActiveTab] = useState<'details' | 'picture'>(initialTab);
  const [pictureTab, setPictureTab] = useState<PictureSourceTab>('presets');
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or user updates
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || user.business_name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatar(user.avatar || null);
      setCustomUrl(user.avatar && user.avatar.startsWith('http') ? user.avatar : '');
      setActiveTab(initialTab);
      setValidationError(null);
      setUploadError(null);
      setUrlError(null);
    }
  }, [isOpen, user, initialTab]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !user) return null;

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const compressedDataUrl = await compressAndFormatImage(file);
      setAvatar(compressedDataUrl);
      setUploadError(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle applying custom URL
  const handleApplyUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) {
      setUrlError('Please enter an image URL.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setUrlError('URL must start with http:// or https://');
      return;
    }

    setAvatar(trimmed);
    setUrlError(null);
  };

  // Handle preset selection
  const handleSelectPreset = (preset: AvatarPreset) => {
    setAvatar(preset.url);
  };

  // Handle remove avatar (revert to initials)
  const handleRemoveAvatar = () => {
    setAvatar(null);
    setCustomUrl('');
    setUrlError(null);
    setUploadError(null);
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError(
        role === 'VENDOR' ? 'Business name cannot be empty.' : 'Full name cannot be empty.'
      );
      setActiveTab('details');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateProfile({
        name: trimmedName,
        business_name: role === 'VENDOR' ? trimmedName : undefined,
        avatar: avatar || '',
        phone: phone.trim(),
        address: address.trim(),
      });

      if (result.success) {
        onClose();
      } else {
        setValidationError(result.error || 'Failed to save changes.');
      }
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const isVendor = role === 'VENDOR';
  const isAdmin = role === 'ADMIN';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#E2E8E6] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8E6] flex items-center justify-between bg-gradient-to-r from-teal-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E]/10 border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E]">
              {isVendor ? <Store className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172121]">
                {isVendor ? 'Customize Store Profile' : isAdmin ? 'Customize Admin Profile' : 'Customize Your Profile'}
              </h2>
              <p className="text-xs text-[#647070]">
                Update your name, profile photo, and contact details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#E2E8E6] bg-[#FAFCFB] px-6 gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#647070] hover:text-[#172121]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('picture')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'picture'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#647070] hover:text-[#172121]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Profile Picture & Avatar</span>
            {avatar && <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'details' && (
            <form id="profile-form" onSubmit={handleSave} className="space-y-4">
              {/* Quick Avatar Banner in Details tab */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E2E8E6]">
                <UserAvatar
                  name={name || user.name}
                  avatar={avatar}
                  size="lg"
                  editable
                  onEditClick={() => setActiveTab('picture')}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#172121] truncate">
                      {name.trim() || (isVendor ? 'Your Store Name' : 'Your Name')}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200 uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                  <p className="text-xs text-[#647070] truncate mt-0.5">{user.email}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('picture')}
                    className="text-xs font-semibold text-[#0F766E] hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Change profile picture or avatar</span>
                  </button>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172121]">
                  {isVendor ? 'Business / Store Name *' : isAdmin ? 'Administrator Name *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isVendor ? 'e.g. Nexus Electronics Store' : 'e.g. Aarav Sharma'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#172121]"
                  />
                  <User className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-[#647070]">
                  {isVendor
                    ? 'This name is visible to customers across the marketplace and on invoices.'
                    : 'This name appears on your order receipts and delivery labels.'}
                </p>
              </div>

              {/* Email (Readonly for account security) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172121]">
                  Account Email (Primary ID)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F3F4F6] border border-[#E2E8E6] rounded-lg text-stone-500 cursor-not-allowed font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
                  Protected login identifier
                </span>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172121]">
                  {isVendor ? 'Merchant Hotline / Contact Phone' : 'Contact Phone Number'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#172121]"
                  />
                  <Phone className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Address Field */}
              {!isAdmin && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172121]">
                    {isVendor ? 'Registered Commercial Address' : 'Default Delivery / Shipping Address'}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={
                        isVendor
                          ? 'Plot 42, Electronics Complex, Hyderabad, Telangana 500081'
                          : 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103'
                      }
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#172121] leading-relaxed resize-none"
                    />
                    <MapPin className="w-4 h-4 text-[#647070] absolute left-3 top-3" />
                  </div>
                  <p className="text-[11px] text-[#647070]">
                    Used for automated shipping labels, delivery estimates, and merchant records.
                  </p>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: PROFILE PICTURE CUSTOMIZATION */}
          {activeTab === 'picture' && (
            <div className="space-y-5">
              {/* Picture Live Preview Card */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-gradient-to-br from-teal-50/50 via-[#F8FAF9] to-white border border-[#E2E8E6]">
                <UserAvatar
                  name={name || user.name}
                  avatar={avatar}
                  size="xl"
                />

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-bold text-sm text-[#172121]">
                      {name.trim() || user.name || 'Your Profile'}
                    </h3>
                    {avatar ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Custom Picture Active
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 font-medium">
                        Initials Avatar
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#647070] mt-1">
                    {avatar
                      ? 'Custom photo configured. Displays on top header, orders, and review cards.'
                      : 'Showing default monogram initials. Upload your own picture or pick a preset below.'}
                  </p>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md border border-rose-200 font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Picture (Use Initials)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Source Mode Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPictureTab('presets')}
                  className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    pictureTab === 'presets'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] shadow-xs'
                      : 'bg-white border-[#E2E8E6] text-[#647070] hover:text-[#172121]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1" />
                  <span>Choose Preset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPictureTab('upload')}
                  className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    pictureTab === 'upload'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] shadow-xs'
                      : 'bg-white border-[#E2E8E6] text-[#647070] hover:text-[#172121]'
                  }`}
                >
                  <Upload className="w-4 h-4 mx-auto mb-1" />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPictureTab('url')}
                  className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    pictureTab === 'url'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] shadow-xs'
                      : 'bg-white border-[#E2E8E6] text-[#647070] hover:text-[#172121]'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 mx-auto mb-1" />
                  <span>Image URL</span>
                </button>
              </div>

              {/* MODE 1: CHOOSE PRESET AVATARS */}
              {pictureTab === 'presets' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs text-[#647070]">
                    <span>Select an avatar from our curated gallery:</span>
                    <span className="text-[11px] font-medium">{AVATAR_PRESETS.length} available</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-1 border border-[#E2E8E6] rounded-xl bg-[#FAFCFB]">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = avatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          title={preset.label}
                          className={`group relative rounded-full p-0.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-3 ring-[#0F766E] scale-105'
                              : 'hover:scale-105 hover:ring-2 hover:ring-stone-300'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-12 h-12 rounded-full object-cover border border-white shadow-2xs"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#0F766E]/30 rounded-full flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 2: UPLOAD IMAGE FILE */}
              {pictureTab === 'upload' && (
                <div className="space-y-3 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-file-upload"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#0F766E]/40 hover:border-[#0F766E] bg-teal-50/20 hover:bg-teal-50/40 rounded-xl p-6 text-center cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-200">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-[#0F766E]" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#172121]">
                        {isUploading ? 'Optimizing photo...' : 'Click to browse or drop an image here'}
                      </p>
                      <p className="text-[11px] text-[#647070] mt-0.5">
                        Supports JPG, PNG, WebP or SVG (Automatically optimized & compressed)
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isUploading}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Photo from Device</span>
                    </button>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                      {uploadError}
                    </p>
                  )}
                </div>
              )}

              {/* MODE 3: CUSTOM IMAGE URL */}
              {pictureTab === 'url' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172121]">
                      Paste Web Image Address
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={customUrl}
                          onChange={(e) => {
                            setCustomUrl(e.target.value);
                            setUrlError(null);
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#172121]"
                        />
                        <LinkIcon className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {urlError && (
                    <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                      {urlError}
                    </p>
                  )}

                  <p className="text-[11px] text-[#647070]">
                    Tip: You can use any direct image link from Unsplash, Gravatar, GitHub, or social accounts.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 border-t border-[#E2E8E6] bg-[#FAFCFB] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-[#647070] hover:text-[#172121] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'picture' && (
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="px-3 py-2 text-xs font-semibold text-[#0F766E] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
              >
                Back to Details
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
