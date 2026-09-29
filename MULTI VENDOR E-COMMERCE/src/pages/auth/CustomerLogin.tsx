import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Lock, Mail, Store } from 'lucide-react';

export const CustomerLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await loginCustomer(email, password);
      if (result.success) {
        const target = redirectParam ? decodeURIComponent(redirectParam) : '/';
        navigate(target, { replace: true });
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('customer01@gmail.com');
    setPassword('pass123');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#172121]">
            <span>Market</span>
            <span className="text-[#F26B5E]">Hub</span>
            <span className="w-2 h-2 rounded-full bg-[#0F766E] inline-block mb-1" />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-[#172121]">Customer Sign In</h1>
          <p className="mt-1 text-xs text-[#647070]">
            Access your orders, saved wishlist, and fast Indian checkout
          </p>
        </div>

        {/* Demo Account Callout */}
        <div className="bg-[#FAFCFB] border border-[#0F766E]/20 rounded-xl p-3.5 text-xs text-[#172121]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#0F766E]">MySQL Customer Credentials</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#0F766E] hover:underline font-medium text-[11px]"
            >
              Fill Demo Credentials
            </button>
          </div>
          <div className="mt-1 text-[#647070] font-mono text-[11px] space-y-0.5">
            <p>Email: customer01@gmail.com</p>
            <p>Password: pass123</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#DC2626] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="customer-email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="customer-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#172121]"
              />
              <Mail className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="customer-password">
              Password
            </label>
            <div className="relative">
              <input
                id="customer-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#172121]"
              />
              <Lock className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#F26B5E] hover:bg-[#D9574D] active:bg-[#C9473D] rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Subtle Navigation: Register link & Seller login */}
        <div className="pt-2 text-center text-xs text-[#647070] space-y-3">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#0F766E] hover:underline">
              Create an account
            </Link>
          </p>

          <div className="pt-3 border-t border-[#E2E8E6] flex items-center justify-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#647070]" />
            <span>Are you a seller?</span>
            <Link to="/vendor/login" className="font-semibold text-[#0F766E] hover:underline ml-1">
              Seller Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
