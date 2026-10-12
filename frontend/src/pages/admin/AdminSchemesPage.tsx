import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '../../lib/api';

type SchemeType = 'MJPJAY' | 'AYUSHMAN_BHARAT' | 'EMPLOYEE_STATE_INSURANCE' | 'CASHLESS_TPA';
type ClaimStatus = 'PENDING' | 'PRE_AUTHORIZED' | 'IN_TREATMENT' | 'SUBMITTED' | 'SETTLED' | 'REJECTED';

interface Claim {
  id: string;
  schemeType: SchemeType;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  rationCardNumber?: string;
  ayushmanCardNumber?: string;
  insurerName?: string;
  tpaName?: string;
  diagnosisDescription: string;
  estimatedAmount: number;
  status: ClaimStatus;
  arogyaMitraId?: string;
  preAuthorizationId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  pending: number;
  preAuthorized: number;
  inTreatment: number;
  settled: number;
  rejected: number;
  mjpjayClaims: number;
  ayushmanClaims: number;
  tpaClaims: number;
  totalEstimatedAmount: number;
}

const STATUS_LABEL: Record<ClaimStatus, string> = {
  PENDING: 'Pre-auth pending',
  PRE_AUTHORIZED: 'Pre-auth approved',
  IN_TREATMENT: 'In treatment',
  SUBMITTED: 'Claim submitted',
  SETTLED: 'Settled',
  REJECTED: 'Rejected',
};

const STATUS_DOT: Record<ClaimStatus, string> = {
  PENDING: 'bg-amber-500',
  PRE_AUTHORIZED: 'bg-[#0F766E]',
  IN_TREATMENT: 'bg-sky-500',
  SUBMITTED: 'bg-indigo-400',
  SETTLED: 'bg-stone-400',
  REJECTED: 'bg-red-400',
};

const SCHEME_LABEL: Record<SchemeType, string> = {
  MJPJAY: 'MJPJAY',
  AYUSHMAN_BHARAT: 'Ayushman Bharat',
  CASHLESS_TPA: 'Cashless insurance (TPA)',
  EMPLOYEE_STATE_INSURANCE: 'ESI',
};

const inputClass =
  'w-full px-3 py-2.5 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

const rupees = (n?: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;
const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const StatusText: React.FC<{ status: ClaimStatus }> = ({ status }) => (
  <span className="inline-flex items-center gap-1.5 text-sm text-stone-700">
    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[status] || 'bg-stone-300'}`} />
    {STATUS_LABEL[status] || 'Unknown'}
  </span>
);

export const AdminSchemesPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filterScheme, setFilterScheme] = useState<'' | SchemeType>('');
  const [filterStatus, setFilterStatus] = useState<'' | ClaimStatus>('');
  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState<Claim | null>(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', remarks: '', preAuthorizationId: '' });
  const [updating, setUpdating] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const panelRef = useRef<HTMLElement>(null);

  // On narrow screens the panel sits below the list, so bring it into view
  useEffect(() => {
    if (selected && window.innerWidth < 1024) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected?.id]);

  const fetchData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [claimsRes, statsRes] = await Promise.all([
        apiFetch<Claim[]>(`/schemes/claims${filterScheme ? `?schemeType=${filterScheme}` : ''}`),
        apiFetch<Stats>('/schemes/stats'),
      ]);
      setClaims(Array.isArray(claimsRes.data) ? claimsRes.data : []);
      setStats(statsRes.data || null);
    } catch (e: any) {
      setLoadError(e?.message || 'Could not load scheme claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterScheme]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return claims
      .filter((c) => !filterStatus || c.status === filterStatus)
      .filter(
        (c) =>
          !q ||
          [c.patientName, c.patientPhone, c.arogyaMitraId, c.preAuthorizationId]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q)),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [claims, filterStatus, search]);

  const open = (c: Claim) => {
    setSelected(c);
    setStatusUpdate({ status: c.status, remarks: c.remarks || '', preAuthorizationId: c.preAuthorizationId || '' });
    setFormError('');
    setNotice('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !statusUpdate.status) return;
    setUpdating(true);
    setFormError('');
    try {
      await apiFetch(`/schemes/claims/${selected.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusUpdate),
      });
      setNotice(`${selected.patientName}’s claim is now “${STATUS_LABEL[statusUpdate.status as ClaimStatus]}”.`);
      setSelected(null);
      setStatusUpdate({ status: '', remarks: '', preAuthorizationId: '' });
      await fetchData();
    } catch (err: any) {
      setFormError(err?.message || 'Could not save. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const figures = stats
    ? [
        { label: 'Claims in total', value: String(stats.total) },
        { label: 'Waiting for pre-auth', value: String(stats.pending) },
        { label: 'In treatment', value: String(stats.inTreatment) },
        { label: 'Estimated value', value: rupees(stats.totalEstimatedAmount) },
      ]
    : [];

  const cardNo = (c: Claim) => c.rationCardNumber || c.ayushmanCardNumber || '';

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Scheme claims</h1>
        <p className="mt-1 text-stone-600">
          MJPJAY, Ayushman Bharat and cashless insurance claims. Update each claim as it moves from pre-auth to settlement.
        </p>
      </div>

      {loadError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between gap-3">
          <span>{loadError}</span>
          <button type="button" className="font-semibold underline shrink-0" onClick={fetchData}>
            Try again
          </button>
        </div>
      )}

      {notice && (
        <p role="status" className="text-sm p-3 rounded-md bg-[#E8F3F1] text-[#0B5D57] flex justify-between gap-3">
          <span>{notice}</span>
          <button type="button" className="shrink-0 underline" onClick={() => setNotice('')}>
            Dismiss
          </button>
        </p>
      )}

      {/* Totals from /schemes/stats */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#E7E3DA] rounded-lg divide-x divide-y lg:divide-y-0 divide-[#E7E3DA]">
        {(figures.length ? figures : [{ label: 'Claims in total', value: '–' }, { label: 'Waiting for pre-auth', value: '–' }, { label: 'In treatment', value: '–' }, { label: 'Estimated value', value: '–' }]).map((f) => (
          <div key={f.label} className="p-5 flex flex-col-reverse min-w-0">
            <dt className="text-sm text-stone-500 mt-1">{f.label}</dt>
            <dd className="font-heading text-2xl sm:text-3xl text-[#1C2321] truncate">{f.value}</dd>
          </div>
        ))}
      </dl>
      {stats && (
        <p className="-mt-3 text-sm text-stone-500">
          By scheme: MJPJAY {stats.mjpjayClaims} · Ayushman Bharat {stats.ayushmanClaims} · Cashless insurance {stats.tpaClaims}.
          {' '}Settled {stats.settled}, rejected {stats.rejected}, pre-auth approved {stats.preAuthorized}.
        </p>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <section className={`${selected ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white border border-[#E7E3DA] rounded-lg min-w-0`}>
          {/* Filters */}
          <div className="p-4 sm:p-5 border-b border-[#E7E3DA] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-sm">
              <span className="block text-stone-600 mb-1">Scheme</span>
              <select value={filterScheme} onChange={(e) => setFilterScheme(e.target.value as SchemeType | '')} className={inputClass}>
                <option value="">All schemes</option>
                {(Object.keys(SCHEME_LABEL) as SchemeType[]).map((s) => (
                  <option key={s} value={s}>
                    {SCHEME_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-stone-600 mb-1">Status</span>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ClaimStatus | '')} className={inputClass}>
                <option value="">Any status</option>
                {(Object.keys(STATUS_LABEL) as ClaimStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-stone-600 mb-1">Search</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Patient, phone or claim no."
                className={inputClass}
              />
            </label>
          </div>

          {loading && claims.length === 0 ? (
            <p className="px-5 py-10 text-center text-stone-500">Loading claims…</p>
          ) : loadError && claims.length === 0 ? (
            <p className="px-5 py-10 text-center text-stone-500">Claims could not be shown.</p>
          ) : visible.length === 0 ? (
            <p className="px-5 py-10 text-center text-stone-500">
              {claims.length === 0 ? 'No claims registered yet.' : 'No claims match these filters.'}
            </p>
          ) : (
            <ul className="divide-y divide-[#E7E3DA]">
              {visible.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => open(c)}
                    aria-current={selected?.id === c.id ? 'true' : undefined}
                    className={`w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 ${
                      selected?.id === c.id ? 'bg-[#E8F3F1]' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1C2321]">
                        {c.patientName}
                        <span className="text-stone-500 font-normal"> · {c.patientAge} yrs</span>
                      </p>
                      <p className="text-sm text-stone-700 mt-0.5">{c.diagnosisDescription}</p>
                      <p className="text-sm text-stone-500 mt-0.5 break-words">
                        {SCHEME_LABEL[c.schemeType] || c.schemeType}
                        {c.tpaName ? ` · ${c.tpaName}` : ''}
                        {c.preAuthorizationId ? (
                          <>
                            {' · '}
                            <span className="font-mono text-xs">{c.preAuthorizationId}</span>
                          </>
                        ) : c.arogyaMitraId ? (
                          <>
                            {' · '}
                            <span className="font-mono text-xs">{c.arogyaMitraId}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex sm:flex-col sm:items-end justify-between gap-1 shrink-0 sm:w-[170px]">
                      <span className="font-semibold text-[#1C2321]">{rupees(c.estimatedAmount)}</span>
                      <StatusText status={c.status} />
                      <span className="hidden sm:block text-xs text-stone-500">Submitted {shortDate(c.createdAt)}</span>
                    </div>
                    <span className="sm:hidden text-xs text-stone-500">Submitted {shortDate(c.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Update panel */}
        {selected && (
          <section ref={panelRef} className="lg:col-span-4 bg-white border border-[#E7E3DA] rounded-lg lg:sticky lg:top-6">
            <div className="px-5 py-4 border-b border-[#E7E3DA] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg">Update claim</h2>
                <p className="text-sm text-stone-500 truncate">{selected.patientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 -m-1 rounded-md text-stone-500 hover:bg-stone-100 hover:text-[#1C2321]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <dl className="px-5 py-4 border-b border-[#E7E3DA] space-y-1.5 text-sm">
              {[
                ['Scheme', SCHEME_LABEL[selected.schemeType] || selected.schemeType],
                ['Procedure', selected.diagnosisDescription],
                ['Estimate', rupees(selected.estimatedAmount)],
                ['Phone', selected.patientPhone],
                ['Arogya Mitra', selected.arogyaMitraId],
                ['Card no.', cardNo(selected)],
                ['Insurer', selected.insurerName],
                ['Submitted', shortDate(selected.createdAt)],
                ['Current status', STATUS_LABEL[selected.status]],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="w-28 shrink-0 text-stone-500">{k}</dt>
                    <dd className="min-w-0 break-words text-[#1C2321]">{v}</dd>
                  </div>
                ))}
            </dl>

            <form onSubmit={handleUpdateStatus} className="p-5 space-y-4">
              <label className="block text-sm">
                <span className="block text-stone-600 mb-1">New status</span>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className={inputClass}
                >
                  {(Object.keys(STATUS_LABEL) as ClaimStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="block text-stone-600 mb-1">Pre-authorisation ID</span>
                <input
                  value={statusUpdate.preAuthorizationId}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, preAuthorizationId: e.target.value })}
                  placeholder="e.g. MJPJAY/PREAUTH/2026/…"
                  className={`${inputClass} font-mono`}
                />
              </label>
              <label className="block text-sm">
                <span className="block text-stone-600 mb-1">Remarks</span>
                <textarea
                  rows={3}
                  value={statusUpdate.remarks}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                  placeholder="Internal note for the scheme desk"
                  className={inputClass}
                />
              </label>

              {formError && (
                <p role="alert" className="text-sm p-3 rounded-md bg-red-50 text-red-800">
                  {formError}
                </p>
              )}

              <div className="flex gap-2">
                <button type="button" onClick={() => setSelected(null)} className="btn-secondary text-sm flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn-primary text-sm flex-1 disabled:opacity-50">
                  {updating ? 'Saving…' : 'Save update'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};
