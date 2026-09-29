import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Lock, Mail, Store, Clock, XCircle, ArrowLeft } from 'lucide-react';

export const VendorLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [vendorStatusError, setVendorStatusError] = useState<'Pending' | 'Rejected' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginVendor } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVendorStatusError(null);
    setIsSubmitting(true);

    try {
      const result = await loginVendor(email, password);
      if (result.success) {
        navigate('/vendor/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid email or password.');
        if (result.vendorStatus === 'Pending') {
          setVendorStatusError('Pending');
        } else if (result.vendorStatus === 'Rejected') {
          setVendorStatusError('Rejected');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type: 'approved' | 'pending' | 'rejected') => {
    setPassword('Vendor@123');
    setError(null);
    setVendorStatusError(null);
    if (type === 'approved') setEmail('vendor01@gmail.com');
    else if (type === 'pending') setEmail('vendor03@gmail.com');
    else if (type === 'rejected') setEmail('vendor05@gmail.com');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#172121]">
            <span>Market</span>
            <span className="text-[#F26B5E]">Hub</span>
            <span className="text-xs px-2 py-0.5 ml-1 bg-teal-50 text-[#0F766E] border border-teal-200 rounded font-semibold">
              Merchant
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-[#172121]">Seller Portal Sign In</h1>
          <p className="mt-1 text-xs text-[#647070]">
            Manage your catalog, stock levels, and dispatch customer orders
          </p>
        </div>

        {/* Demo Vendor Accounts Box for Evaluators */}
        <div className="bg-[#FAFCFB] border border-[#0F766E]/20 rounded-xl p-3.5 text-xs text-[#172121] space-y-2">
          <div className="flex items-center justify-between border-b border-[#E2E8E6] pb-1.5">
            <span className="font-semibold text-[#0F766E]">MySQL Dump Vendor Accounts:</span>
            <span className="text-[10px] text-[#647070]">Pass: Vendor@123</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#172121]">1. Approved (Tech World):</span>{' '}
                <span className="text-[#647070]">vendor01@gmail.com</span>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('approved')}
                className="text-[#0F766E] hover:underline font-semibold"
              >
                Use
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#172121]">2. Pending (Smart Gadgets):</span>{' '}
                <span className="text-[#647070]">vendor03@gmail.com</span>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('pending')}
                className="text-amber-600 hover:underline font-semibold"
              >
                Use
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#172121]">3. Rejected (Home Essentials):</span>{' '}
                <span className="text-[#647070]">vendor05@gmail.com</span>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('rejected')}
                className="text-rose-600 hover:underline font-semibold"
              >
                Use
              </button>
            </div>
            <p className="text-[10px] text-[#647070] italic pt-1">
              All demo vendor passwords: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">Vendor@123</code>
            </p>
          </div>
        </div>

        {/* Status Error Display for Pending / Rejected */}
        {vendorStatusError === 'Pending' && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-amber-800">
              <Clock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Pending Approval</span>
            </div>
            <p className="leading-relaxed">
              Your vendor account is still pending approval. You will be able to access your vendor dashboard after administrator approval.
            </p>
          </div>
        )}

        {vendorStatusError === 'Rejected' && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-rose-800">
              <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Application Rejected</span>
            </div>
            <p className="leading-relaxed">
              Your vendor application has been rejected. Please contact MarketHub support for more information.
            </p>
          </div>
        )}

        {/* General Error Alert */}
        {error && !vendorStatusError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#DC2626] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
        )}

        {/* Vendor Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vendor-email">
              Merchant Email Address
            </label>
            <div className="relative">
              <input
                id="vendor-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vendor@markethub.demo"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
              />
              <Mail className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="vendor-password">
              Password
            </label>
            <div className="relative">
              <input
                id="vendor-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] text-[#172121]"
              />
              <Lock className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] active:bg-[#0b4844] rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In to Seller Dashboard'
            )}
          </button>
        </form>

        {/* Vendor Registration Link */}
        <div className="pt-2 text-center text-xs text-[#647070] space-y-3">
          <p>
            Don't have a seller account?{' '}
            <Link to="/vendor/register" className="font-semibold text-[#0F766E] hover:underline">
              Register as a Seller
            </Link>
          </p>

          <div className="pt-3 border-t border-[#E2E8E6] flex items-center justify-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5 text-[#647070]" />
            <Link to="/login" className="text-[#647070] hover:text-[#172121]">
              Return to Customer Shopping Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
