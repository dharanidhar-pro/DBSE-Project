import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award, BookOpen } from 'lucide-react';
import { resetDemoData } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { SyllabusModal } from '../common/SyllabusModal';

export const Footer: React.FC = () => {
  const { showSuccess } = useToast();
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);

  const handleResetData = () => {
    resetDemoData();
    showSuccess('MarketHub DBMS demo database reset to initial seeds.', 'Data Reset');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <footer className="bg-white border-t border-[#E2E8E6] text-[#172121] mt-auto">
      <SyllabusModal isOpen={syllabusModalOpen} onClose={() => setSyllabusModalOpen(false)} />
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-[#E2E8E6] bg-[#FAFCFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-[#0F766E]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-[#172121]">Pan-India Delivery</p>
                <p className="text-[#647070]">Express delivery across 19,000+ pincodes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-[#0F766E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-[#172121]">Verified Vendors Only</p>
                <p className="text-[#647070]">Strict admin onboarding & GST checks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-[#0F766E]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-[#172121]">7-Day Easy Returns</p>
                <p className="text-[#647070]">Hassle-free doorstep return pickup</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-[#0F766E]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-[#172121]">100% Genuine Items</p>
                <p className="text-[#647070]">Authenticity guaranteed direct from makers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-xs">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-1 text-lg font-bold">
              <span>Market</span>
              <span className="text-[#F26B5E]">Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] inline-block mb-1" />
            </div>
            <p className="text-[#647070] leading-relaxed max-w-sm">
              MarketHub is a next-generation multi-vendor e-commerce platform built on a relational 8-table MySQL architecture. Designed for seamless merchant onboarding, distributed inventory management, and fast customer checkout.
            </p>
            <div className="text-[11px] text-[#647070] pt-2">
              <span className="font-semibold text-[#172121]">Operational Fulfillment Hubs:</span> Bengaluru · Mumbai · Delhi NCR · Hyderabad · Pune · Vijayawada
            </div>
          </div>

          {/* Col 2: Marketplace Catalog */}
          <div className="space-y-2">
            <p className="font-semibold text-[#172121] uppercase tracking-wider text-[11px]">Explore Store</p>
            <ul className="space-y-2 text-[#647070]">
              <li><Link to="/shop?category=Electronics" className="hover:text-[#0F766E] transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-[#0F766E] transition-colors">Apparel & Footwear</Link></li>
              <li><Link to="/shop?category=Home" className="hover:text-[#0F766E] transition-colors">Home & Living</Link></li>
              <li><Link to="/shop?category=Sports" className="hover:text-[#0F766E] transition-colors">Sports & Fitness</Link></li>
              <li><Link to="/shop?category=Books" className="hover:text-[#0F766E] transition-colors">Technical & Literature Books</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-2">
            <p className="font-semibold text-[#172121] uppercase tracking-wider text-[11px]">Customer Hub</p>
            <ul className="space-y-2 text-[#647070]">
              <li><Link to="/orders" className="hover:text-[#0F766E] transition-colors">Track Your Order</Link></li>
              <li><Link to="/account" className="hover:text-[#0F766E] transition-colors">Account Settings</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#0F766E] transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-[#0F766E] transition-colors">Shopping Bag</Link></li>
              <li><span className="text-[#647070]">Delivery Policy (UPI / COD)</span></li>
            </ul>
          </div>

          {/* Col 4: Merchant Services */}
          <div className="space-y-2">
            <p className="font-semibold text-[#172121] uppercase tracking-wider text-[11px]">Seller Services</p>
            <ul className="space-y-2 text-[#647070]">
              <li><Link to="/vendor/login" className="hover:text-[#0F766E] transition-colors font-medium text-[#0F766E]">Merchant Sign In</Link></li>
              <li><Link to="/vendor/register" className="hover:text-[#0F766E] transition-colors">Apply as Vendor</Link></li>
              <li><span className="text-[#647070]">Inventory Integration</span></li>
              <li><span className="text-[#647070]">GST Invoicing Standards</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom quiet bar with copyright, payments accepted, and private admin portal */}
        <div className="border-t border-[#E2E8E6] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#647070]">
          <div>
            © 2026 MarketHub Technologies. University DBMS Multi-Vendor Prototype. All rights reserved.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setSyllabusModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#0F766E] hover:text-[#115E59] font-medium transition-colors bg-teal-50/80 px-2.5 py-1 rounded-md border border-teal-200"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>DBMS Syllabus Guide (CO1-CO6)</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={handleResetData}
              className="text-[#647070] hover:text-[#DC2626] transition-colors underline"
            >
              Reset Demo Seeds
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <Link
              to="/admin/login"
              className="text-[#647070] hover:text-[#0F766E] transition-colors"
            >
              Staff Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
