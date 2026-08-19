import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Filter,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  BarChart2,
  ChevronDown,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { apiUrl } from '../../lib/api';

const statusMeta: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:        { label: 'Pending',         color: 'bg-amber-100 text-amber-800 border-amber-200',   icon: Clock         },
  PRE_AUTHORIZED: { label: 'Pre-Authorized',  color: 'bg-blue-100 text-blue-800 border-blue-200',     icon: CheckCircle2  },
  IN_TREATMENT:   { label: 'In Treatment',    color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertCircle   },
  SUBMITTED:      { label: 'Claim Submitted', color: 'bg-sky-100 text-sky-800 border-sky-200',         icon: TrendingUp    },
  SETTLED:        { label: 'Settled',         color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  REJECTED:       { label: 'Rejected',        color: 'bg-rose-100 text-rose-800 border-rose-200',      icon: XCircle       },
};

const schemeMeta: Record<string, { label: string; color: string }> = {
  MJPJAY:            { label: 'MJPJAY',           color: 'bg-teal-100 text-teal-800 border-teal-200' },
  AYUSHMAN_BHARAT:   { label: 'Ayushman Bharat',  color: 'bg-orange-100 text-orange-800 border-orange-200' },
  CASHLESS_TPA:      { label: 'Cashless TPA',     color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  EMPLOYEE_STATE_INSURANCE: { label: 'ESI',       color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export const AdminSchemesPage: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterScheme, setFilterScheme] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', remarks: '', preAuthorizationId: '' });
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [claimsRes, statsRes] = await Promise.all([
        fetch(apiUrl(`/schemes/claims${filterScheme ? `?schemeType=${filterScheme}` : ''}`), { headers }),
        fetch(apiUrl('/schemes/stats'), { headers }),
      ]);
      const [claimsData, statsData] = await Promise.all([claimsRes.json(), statsRes.json()]);
      setClaims(claimsData.data || []);
      setStats(statsData.data || null);
    } catch {
      // silently handle in admin panel
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterScheme]);

  const handleUpdateStatus = async () => {
    if (!selectedClaim || !statusUpdate.status) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(apiUrl(`/schemes/claims/${selectedClaim.id}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(statusUpdate),
      });
      setSelectedClaim(null);
      setStatusUpdate({ status: '', remarks: '', preAuthorizationId: '' });
      await fetchData();
    } catch {}
    setUpdating(false);
  };

  const statCards = stats
    ? [
        { label: 'Total Claims', value: stats.total, color: 'text-slate-900' },
        { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
        { label: 'Pre-Authorized', value: stats.preAuthorized, color: 'text-blue-600' },
        { label: 'In Treatment', value: stats.inTreatment, color: 'text-purple-600' },
        { label: 'Settled', value: stats.settled, color: 'text-emerald-600' },
        { label: 'Rejected', value: stats.rejected, color: 'text-rose-600' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Government Scheme Claims</h1>
          <p className="text-xs text-slate-500 mt-0.5">MJPJAY · Ayushman Bharat · Cashless TPA — Claim Management</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">
          <RefreshCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-card-subtle">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Financial Summary */}
      {stats && (
        <div className="bg-gradient-to-r from-hospital-teal to-slate-700 rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-300 font-medium">Total Estimated Claim Value</p>
            <p className="text-2xl font-extrabold mt-0.5">
              ₹{stats.totalEstimatedAmount?.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-teal-300">{stats.mjpjayClaims}</p>
              <p className="text-[10px] text-slate-400">MJPJAY</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-300">{stats.ayushmanClaims}</p>
              <p className="text-[10px] text-slate-400">Ayushman</p>
            </div>
            <div>
              <p className="text-lg font-bold text-indigo-300">{stats.tpaClaims}</p>
              <p className="text-[10px] text-slate-400">TPA</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-600">Filter by scheme:</span>
        {['', 'MJPJAY', 'AYUSHMAN_BHARAT', 'CASHLESS_TPA'].map((s) => (
          <button key={s} onClick={() => setFilterScheme(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              filterScheme === s ? 'bg-hospital-teal text-white border-hospital-teal' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {s === '' ? 'All' : schemeMeta[s]?.label}
          </button>
        ))}
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-subtle overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No claims found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Patient', 'Scheme', 'Diagnosis', 'Est. Amount', 'Pre-Auth ID', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => {
                  const sm = statusMeta[claim.status] || statusMeta['PENDING'];
                  const Icon = sm.icon;
                  return (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{claim.patientName}</p>
                        <p className="text-slate-400">{claim.patientPhone} · Age {claim.patientAge}</p>
                        {claim.arogyaMitraId && <p className="text-hospital-teal font-semibold">{claim.arogyaMitraId}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold border ${schemeMeta[claim.schemeType]?.color || 'bg-slate-100 text-slate-700'}`}>
                          {schemeMeta[claim.schemeType]?.label || claim.schemeType}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="text-slate-700 leading-relaxed">{claim.diagnosisDescription}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        ₹{claim.estimatedAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        {claim.preAuthorizationId ? (
                          <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded border border-slate-200">{claim.preAuthorizationId}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${sm.color}`}>
                          <Icon className="w-3 h-3" />
                          {sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setSelectedClaim(claim); setStatusUpdate({ status: claim.status, remarks: claim.remarks || '', preAuthorizationId: claim.preAuthorizationId || '' }); }}
                          className="px-3 py-1.5 rounded-lg bg-hospital-teal/10 text-hospital-teal hover:bg-hospital-teal/20 font-bold text-[11px] transition border border-hospital-teal/20">
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Update Claim — {selectedClaim.patientName}</h3>
            <p className="text-[11px] text-slate-500">{selectedClaim.diagnosisDescription}</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Status</label>
              <select value={statusUpdate.status} onChange={e => setStatusUpdate({...statusUpdate, status: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none">
                {Object.entries(statusMeta).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pre-Authorization ID</label>
              <input value={statusUpdate.preAuthorizationId} onChange={e => setStatusUpdate({...statusUpdate, preAuthorizationId: e.target.value})}
                placeholder="e.g. MJPJAY/PREAUTH/2026/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Notes</label>
              <textarea rows={3} value={statusUpdate.remarks} onChange={e => setStatusUpdate({...statusUpdate, remarks: e.target.value})}
                placeholder="Internal notes on this claim update..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedClaim(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">
                Cancel
              </button>
              <button onClick={handleUpdateStatus} disabled={updating}
                className="flex-1 py-2 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition disabled:bg-slate-300">
                {updating ? 'Saving...' : 'Save Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
