import React from 'react';
import { X, Database, CheckCircle2, Server, Box, Layers, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8E6] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8E6] flex items-center justify-between bg-[#F8FAF9] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0F766E]/10 text-[#0F766E] rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172121]">University Syllabus & DBMS Architecture Guide</h2>
              <p className="text-xs text-[#647070]">Course Outcomes CO1 - CO6 Mapped to MarketHub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#647070] hover:text-[#172121] hover:bg-[#E2E8E6]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#172121]">
          {/* Quick Notice */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#0F766E] text-xs">Connected to your MySQL Dump Schema (`multi_vendor_ecommerce`)</p>
              <p className="text-[#115E59] text-[11px] mt-0.5">
                All 50 products, 50 vendors, 50 customers, 50 orders, and inventory records from your SQL dump are fully wired into both the Python Flask REST API (`/backend`) and the interactive web application.
              </p>
            </div>
          </div>

          {/* CO1: Relational Database Engineering */}
          <div className="border border-[#E2E8E6] rounded-xl p-4 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#172121]">
              <Database className="w-4 h-4 text-[#0F766E]" />
              <span>CO1: Relational Database Engineering (RDBMS Foundations & Stored Logic)</span>
            </div>
            <p className="text-[#647070] text-[11px]">
              Implements complete 3-schema architecture, 3NF normalization, foreign key constraints with ON DELETE CASCADE, ACID transactions, and stored routines.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 bg-[#F8FAF9] rounded-lg border border-[#E2E8E6]">
                <span className="font-bold text-[#0F766E]">8 Relational Tables:</span>
                <p className="text-[#647070] mt-0.5">admin, vendor, customer, product, inventory, orders, vendor_order_details, cart_items</p>
              </div>
              <div className="p-2 bg-[#F8FAF9] rounded-lg border border-[#E2E8E6]">
                <span className="font-bold text-[#0F766E]">Stored Logic & Triggers:</span>
                <p className="text-[#647070] mt-0.5">sp_PlaceOrderTransaction, trg_deduct_inventory_on_order, vw_customer_order_history</p>
              </div>
            </div>
          </div>

          {/* CO2: Database Engineering & Polyglot Persistence */}
          <div className="border border-[#E2E8E6] rounded-xl p-4 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#172121]">
              <Layers className="w-4 h-4 text-[#0F766E]" />
              <span>CO2: Database Engineering (SQL vs NoSQL Comparative Study)</span>
            </div>
            <p className="text-[#647070] text-[11px]">
              Comparative study between normalized tabular MySQL storage patterns and document-oriented client caching with automatic state synchronization.
            </p>
          </div>

          {/* CO3: Backend API Engineering */}
          <div className="border border-[#E2E8E6] rounded-xl p-4 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#172121]">
              <Server className="w-4 h-4 text-[#0F766E]" />
              <span>CO3: Backend API Engineering (Flask RESTful Architecture & RBAC)</span>
            </div>
            <p className="text-[#647070] text-[11px]">
              Flask REST API in <code className="bg-[#F8FAF9] px-1 py-0.5 rounded text-[#0F766E]">backend/app.py</code> with full CRUD operations, parameterized SQL queries preventing injection, and Role-Based Access Control (Admin, Vendor, Customer).
            </p>
            <div className="bg-[#172121] text-emerald-400 p-2.5 rounded-lg font-mono text-[10px] space-y-1">
              <p>POST /api/orders/place  {"->"} ACID Transaction: Orders + Line Items + Inventory Deduct</p>
              <p>GET  /api/products      {"->"} Parameterized query filtering by category & vendor</p>
              <p>PUT  /api/vendors/:id   {"->"} Admin workflow approving/rejecting vendor applications</p>
            </div>
          </div>

          {/* CO4 & CO5: Multi-Framework & Microservices Engineering */}
          <div className="border border-[#E2E8E6] rounded-xl p-4 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#172121]">
              <Box className="w-4 h-4 text-[#0F766E]" />
              <span>CO4 & CO5: Multi-Framework & Microservices Engineering</span>
            </div>
            <p className="text-[#647070] text-[11px]">
              Domain decomposition across Storefront, Vendor Portal, and Admin Engine with clean service boundaries connecting a Node.js/React frontend to a Python Flask REST backend.
            </p>
          </div>

          {/* CO6: Deployment, Observability & Delivery */}
          <div className="border border-[#E2E8E6] rounded-xl p-4 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#172121]">
              <Terminal className="w-4 h-4 text-[#0F766E]" />
              <span>CO6: Deployment, Observability & Containerisation</span>
            </div>
            <p className="text-[#647070] text-[11px]">
              Containerized multi-service assembly defined in <code className="bg-[#F8FAF9] px-1 py-0.5 rounded text-[#0F766E]">docker-compose.yml</code> and <code className="bg-[#F8FAF9] px-1 py-0.5 rounded text-[#0F766E]">backend/Dockerfile</code> with a dedicated <code className="bg-[#F8FAF9] px-1 py-0.5 rounded text-[#0F766E]">/api/health</code> endpoint.
            </p>
          </div>

          {/* Default Credentials Reference */}
          <div className="bg-[#F8FAF9] border border-[#E2E8E6] rounded-xl p-3.5 space-y-2">
            <span className="font-semibold text-xs text-[#172121]">MySQL Dump Login Credentials:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-white rounded border border-[#E2E8E6]">
                <p className="font-bold text-[#0F766E]">Admin</p>
                <p className="text-[#647070]">admin@marketplace.com</p>
                <p className="text-[#647070]">pass: admin123</p>
              </div>
              <div className="p-2 bg-white rounded border border-[#E2E8E6]">
                <p className="font-bold text-[#0F766E]">Customer 01</p>
                <p className="text-[#647070]">customer01@gmail.com</p>
                <p className="text-[#647070]">pass: pass123</p>
              </div>
              <div className="p-2 bg-white rounded border border-[#E2E8E6]">
                <p className="font-bold text-[#0F766E]">Vendor (Tech World)</p>
                <p className="text-[#647070]">vendor01@gmail.com</p>
                <p className="text-[#647070]">pass: Vendor@123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8E6] flex items-center justify-between bg-[#F8FAF9] rounded-b-2xl text-xs">
          <span className="text-[#647070]">See <code className="text-[#0F766E]">SYLLABUS_IMPLEMENTATION_GUIDE.md</code> for full details</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0F766E] text-white font-medium rounded-lg hover:bg-[#115E59] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
