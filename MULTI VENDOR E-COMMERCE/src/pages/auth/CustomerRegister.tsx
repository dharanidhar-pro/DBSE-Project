import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Lock, Mail, User, Phone, MapPin, Store } from 'lucide-react';

export const CustomerRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.password) {
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
      const result = await registerCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#172121]">
            <span>Market</span>
            <span className="text-[#F26B5E]">Hub</span>
            <span className="w-2 h-2 rounded-full bg-[#0F766E] inline-block mb-1" />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-[#172121]">Create Customer Account</h1>
          <p className="mt-1 text-xs text-[#647070]">
            Join India's premier multi-vendor marketplace
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
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="reg-name">
              Full Name *
            </label>
            <div className="relative">
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Vikram Malhotra"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
              />
              <User className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="reg-email">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vikram@example.in"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
                />
                <Mail className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="reg-phone">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
                />
                <Phone className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="reg-address">
              Delivery Address *
            </label>
            <div className="relative">
              <textarea
                id="reg-address"
                name="address"
                rows={2}
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Flat No., Street, City, State, Pincode"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121] resize-none"
              />
              <MapPin className="w-4 h-4 text-[#647070] absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="reg-password">
                Password *
              </label>
              <div className="relative">
                <input
                  id="reg-password"
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
              <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="reg-confirm">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
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
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Existing account link */}
        <div className="pt-2 text-center text-xs text-[#647070] space-y-3">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#0F766E] hover:underline">
              Sign In
            </Link>
          </p>

          <div className="pt-3 border-t border-[#E2E8E6] flex items-center justify-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#647070]" />
            <span>Are you a merchant?</span>
            <Link to="/vendor/register" className="font-semibold text-[#0F766E] hover:underline ml-1">
              Register as a Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
