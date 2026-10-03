import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Lock, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@marketplace.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9]">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#115E59]/10 text-[#115E59] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#172121]">MarketHub Platform Administration</h1>
          <p className="mt-1 text-xs text-[#647070]">
            Restricted staff access for marketplace operations & governance
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-white border border-[#E2E8E6] rounded-xl p-3.5 text-xs text-[#172121] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#115E59]">Administrator MySQL Credentials</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#115E59] hover:underline font-medium text-[11px]"
            >
              Fill Credentials
            </button>
          </div>
          <div className="mt-1.5 text-[#647070] font-mono text-[11px] space-y-0.5">
            <p>Email: admin@marketplace.com</p>
            <p>Password: admin123</p>
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
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="admin-email">
              Administrative Email
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@marketplace.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59] text-[#172121]"
              />
              <Mail className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172121] mb-1.5" htmlFor="admin-password">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59] text-[#172121]"
              />
              <Lock className="w-4 h-4 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#115E59] hover:bg-[#0d4a46] active:bg-[#093532] rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Enter Admin Console'
            )}
          </button>
        </form>

        <div className="text-center text-xs">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[#647070] hover:text-[#172121]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
