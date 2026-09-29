import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, XCircle, ArrowLeft, LogOut } from 'lucide-react';

export const VendorApprovalStatus: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isPending = user?.approval_status === 'Pending' || !user?.approval_status;
  const isRejected = user?.approval_status === 'Rejected';

  const handleSignOut = () => {
    logout();
    navigate('/vendor/login');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-[#E2E8E6] rounded-2xl p-8 text-center shadow-xs space-y-6">
        {/* Status Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isRejected
              ? 'bg-rose-50 border border-rose-200 text-[#DC2626]'
              : 'bg-amber-50 border border-amber-200 text-amber-600'
          }`}
        >
          {isRejected ? <XCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
        </div>

        {/* Status Headline */}
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isRejected ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isRejected ? 'Application Status: Rejected' : 'Application Status: Pending Approval'}
          </span>
          <h1 className="mt-3 text-xl font-bold text-[#172121]">
            {isRejected ? 'Application Rejected' : 'Waiting for Administrator Approval'}
          </h1>
        </div>

        {/* Message */}
        <div className="text-xs text-[#647070] leading-relaxed space-y-2">
          {isRejected ? (
            <p className="text-[#172121]">
              Your vendor application has been rejected.
              <br />
              Please contact MarketHub support for more information.
            </p>
          ) : (
            <>
              <p className="text-[#172121]">
                Your vendor account is waiting for administrator approval.
              </p>
              <p>
                You will be able to access your vendor dashboard after approval. An administrator reviews merchant credentials and GST verification.
              </p>
            </>
          )}

          {user && (
            <div className="bg-[#F8FAF9] border border-[#E2E8E6] rounded-lg p-3 mt-3 text-left space-y-1">
              <p className="text-[#647070]">
                Store:{' '}
                <span className="font-semibold text-[#172121]">{user.business_name || user.name}</span>
              </p>
              <p className="text-[#647070]">
                Email: <span className="font-mono text-[#172121]">{user.email}</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#E2E8E6] flex flex-col gap-2.5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#DC2626] bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Switch Account</span>
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#647070] hover:text-[#172121]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
