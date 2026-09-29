import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Lock, Mail, Store, Phone, MapPin, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const VendorRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone: '',
    business_address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { registerVendor } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.business_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.business_address.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerVendor({
        business_name: formData.business_name,
        email: formData.email,
        phone: formData.phone,
        business_address: formData.business_address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Failed to register vendor account.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dedicated approval screen required by Section 5 of the instructions
  if (isSubmitted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white border border-[#E2E8E6] rounded-2xl p-8 text-center shadow-xs space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
              Status: Pending Approval
            </span>
            <h2 className="mt-3 text-2xl font-bold text-[#172121]">Registration submitted</h2>
          </div>

          <div className="text-xs text-[#647070] leading-relaxed space-y-2">
            <p>
              Your vendor account is waiting for administrator approval.
            </p>
            <p>
              You will be able to access your vendor dashboard after approval.
            </p>
            <p className="text-[11px] text-[#647070] pt-2">
              Registered business:{' '}
              <span className="font-semibold text-[#172121]">{formData.business_name}</span> (
              {formData.email})
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2E8E6] flex flex-col gap-2.5">
            <Link
              to="/vendor/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
            >
              <span>Go to Vendor Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/"
              className="py-2 px-4 text-xs font-medium text-[#647070] hover:text-[#172121]"
            >
              Return to Marketplace Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#172121]">
            <span>Market</span>
            <span className="text-[#F26B5E]">Hub</span>
            <span className="text-xs px-2 py-0.5 ml-1 bg-teal-50 text-[#0F766E] border border-teal-200 rounded font-semibold">
              Seller
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-[#172121]">Apply as a MarketHub Vendor</h1>
          <p className="mt-1 text-xs text-[#647070]">
            Expand your reach across thousands of verified Indian shoppers
          </p>
        </div>

        {/* Notice on Approval */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 text-xs text-[#0F766E] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Vendor accounts require platform administrator review and verification before dashboard access is activated.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#DC2626] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vreg-business">
              Business / Store Name *
            </label>
            <div className="relative">
              <input
                id="vreg-business"
                name="business_name"
                type="text"
                required
                value={formData.business_name}
                onChange={handleChange}
                placeholder="e.g. Bharat Artisans & Electronics"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
              />
              <Store className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vreg-email">
                Merchant Email *
              </label>
              <div className="relative">
                <input
                  id="vreg-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@store.in"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
                />
                <Mail className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vreg-phone">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  id="vreg-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98450 00000"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
                />
                <Phone className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vreg-address">
              Business Registered Address *
            </label>
            <div className="relative">
              <textarea
                id="vreg-address"
                name="business_address"
                rows={2}
                required
                value={formData.business_address}
                onChange={handleChange}
                placeholder="Shop/Unit No., Commercial Complex, City, State, Pincode"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121] resize-none"
              />
              <MapPin className="w-4 h-4 text-[#647070] absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vreg-password">
                Password *
              </label>
              <div className="relative">
                <input
                  id="vreg-password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
                />
                <Lock className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vreg-confirm">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="vreg-confirm"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
                />
                <Lock className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] active:bg-[#0b4844] rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting application...
              </span>
            ) : (
              'Submit Vendor Registration'
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#647070]">
          Already have an approved seller account?{' '}
          <Link to="/vendor/login" className="font-semibold text-[#0F766E] hover:underline">
            Seller Login
          </Link>
        </div>
      </div>
    </div>
  );
};
