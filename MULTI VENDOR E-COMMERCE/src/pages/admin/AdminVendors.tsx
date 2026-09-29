import React, { useState, useEffect } from 'react';
import { Vendor, VendorApprovalStatus } from '../../types/database';
import { marketplaceService } from '../../services/api/marketplaceService';
import { useToast } from '../../context/ToastContext';
import { Store, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdminVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { showSuccess, showInfo } = useToast();

  const loadVendors = async () => {
    setLoading(true);
    try {
      const list = await marketplaceService.getAllVendors();
      setVendors(list);
    } catch (err) {
      console.error('Failed to load vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleUpdateStatus = async (vendorId: number, status: VendorApprovalStatus) => {
    await marketplaceService.setVendorStatus(vendorId, status);
    if (status === 'Approved') {
      showSuccess('Vendor approved. Seller dashboard access is now granted.', 'Vendor Approved');
    } else if (status === 'Rejected') {
      showInfo('Vendor application rejected. Access denied.', 'Vendor Rejected');
    } else {
      showInfo('Vendor set to Pending approval review.');
    }
    loadVendors();
  };

  const filtered = vendors.filter(v => {
    const matchesSearch =
      v.business_name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search);
    const matchesStatus = filterStatus === 'All' || v.approval_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E6]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172121]">Vendor Management & Approvals</h1>
        <p className="text-xs text-[#647070]">
          Manage seller applications, verify business credentials, and grant dashboard authorization
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search vendors by store, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
          />
          <Search className="w-3.5 h-3.5 text-[#647070] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8E6] rounded-lg">
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-[#647070] hover:text-[#172121]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-[#E2E8E6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFCFB] border-b border-[#E2E8E6] text-[#647070] font-semibold">
              <tr>
                <th className="py-3 px-4">Vendor ID</th>
                <th className="py-3 px-4">Business / Store</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E6]/60">
              {filtered.map(v => (
                <tr key={v.vendor_id} className="hover:bg-[#F8FAF9]">
                  <td className="py-3 px-4 font-mono font-bold text-[#172121]">
                    VEN-{v.vendor_id.toString().padStart(3, '0')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#172121]">
                    {v.business_name}
                  </td>
                  <td className="py-3 px-4 space-y-0.5">
                    <div className="font-mono text-[#172121]">{v.email}</div>
                    <div className="text-[11px] text-[#647070]">{v.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-[#647070] max-w-[200px] truncate" title={v.business_address}>
                    {v.business_address}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#647070]">
                    {v.registration_date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        v.approval_status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : v.approval_status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {v.approval_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {v.approval_status !== 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(v.vendor_id, 'Approved')}
                        className="px-2.5 py-1 rounded bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold transition-colors text-[11px]"
                      >
                        Approve
                      </button>
                    )}
                    {v.approval_status !== 'Rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(v.vendor_id, 'Rejected')}
                        className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-[#DC2626] border border-rose-200 font-semibold transition-colors text-[11px]"
                      >
                        Reject
                      </button>
                    )}
                    {v.approval_status !== 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(v.vendor_id, 'Pending')}
                        className="px-2 py-1 rounded text-stone-500 hover:text-stone-800 text-[11px]"
                      >
                        Reset
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
