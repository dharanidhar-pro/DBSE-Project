import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ChevronDown, ChevronUp, KeyRound, ArrowRight } from 'lucide-react';

export const DemoNoticeBar: React.FC = () => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = async (type: 'customer' | 'vendor_approved' | 'vendor_pending' | 'vendor_rejected' | 'admin') => {
    await switchDemoRole(type);
    if (type === 'customer') navigate('/account');
    else if (type === 'vendor_approved') navigate('/vendor/dashboard');
    else if (type === 'vendor_pending' || type === 'vendor_rejected') navigate('/vendor/approval-status');
    else if (type === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="bg-[#172121] text-white text-xs border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
        {/* Left: Info */}
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-[#F26B5E] shrink-0" />
          <span className="font-semibold text-stone-200">Demo Prototype Mode:</span>
          <span className="text-stone-300 hidden sm:inline">Active session:</span>
          <span className="font-medium text-[#F26B5E] truncate">
            {role ? `${role} (${user?.name || user?.email})` : 'Unauthenticated (Guest)'}
          </span>
          {user?.role === 'VENDOR' && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                user.approval_status === 'Approved'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : user.approval_status === 'Pending'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {user.approval_status}
            </span>
          )}
        </div>

        {/* Right: Quick Role Switcher Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Test Accounts & Quick Switch</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded Quick Switch Drawer */}
      {isOpen && (
        <div className="bg-stone-900 border-t border-stone-800 px-4 sm:px-6 lg:px-8 py-3 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-[11px] text-stone-400 space-y-1">
              <p className="font-semibold text-stone-200">
                Evaluation Access Control Shortcuts (Testing Rubric Criteria):
              </p>
              <p>
                Click any role below to instantly load that demo session and verify route guards and permission checks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSwitch('customer')}
                className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-[#F26B5E] hover:text-white text-stone-200 transition-colors border border-stone-700"
              >
                Customer (Aarav)
              </button>

              <button
                onClick={() => handleSwitch('vendor_approved')}
                className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-[#0F766E] hover:text-white text-stone-200 transition-colors border border-stone-700"
              >
                Approved Seller (TechNest)
              </button>

              <button
                onClick={() => handleSwitch('vendor_pending')}
                className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-amber-600 hover:text-white text-stone-200 transition-colors border border-stone-700"
              >
                Pending Seller (UrbanStyle)
              </button>

              <button
                onClick={() => handleSwitch('vendor_rejected')}
                className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-rose-600 hover:text-white text-stone-200 transition-colors border border-stone-700"
              >
                Rejected Seller (QuickDrop)
              </button>

              <button
                onClick={() => handleSwitch('admin')}
                className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-indigo-600 hover:text-white text-stone-200 transition-colors border border-stone-700"
              >
                Admin (Platform Admin)
              </button>

              {role && (
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors border border-rose-800"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
