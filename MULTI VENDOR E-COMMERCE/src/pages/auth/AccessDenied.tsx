import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  const { user, role, logout } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-[#E2E8E6] rounded-2xl p-8 text-center shadow-xs space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[#DC2626]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/60 px-2.5 py-1 rounded-full">
            HTTP 403 Forbidden
          </span>
          <h1 className="mt-3 text-2xl font-bold text-[#172121]">Access Denied</h1>
        </div>

        <p className="text-xs text-[#647070] leading-relaxed">
          You do not have permission to access this protected area.
          {user ? (
            <span className="block mt-2">
              Current authenticated session:{' '}
              <strong className="text-[#172121]">
                {role} ({user.email})
              </strong>
            </span>
          ) : (
            <span className="block mt-2">Please sign in with authorized credentials.</span>
          )}
        </p>

        <div className="pt-4 border-t border-[#E2E8E6] flex flex-col gap-2.5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="py-2 px-4 text-xs font-medium text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors"
            >
              Sign Out & Switch Account
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-medium text-[#647070] hover:text-[#172121]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Go to Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
