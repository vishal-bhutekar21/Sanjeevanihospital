import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, FileDown, Hourglass, Plus, Receipt as ReceiptIcon, Search, TrendingUp, Wallet } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { BarList, EmptyState, MODE_COLORS, Notice, PageHeader, Panel, SplitBar, Stat } from '../../components/adminUi';
import type { Receipt, ReceiptSummary } from '../../lib/reception';
import { PAYMENT_MODES, addDays, dateTimeText, dayText, inputClass, inr, kindLabel, modeLabel, todayIst } from '../../lib/reception';

type Preset = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

const rangeFor = (p: Preset, custom: { from: string; to: string }) => {
  const today = todayIst();
  if (p === 'today') return { from: today, to: today };
  if (p === 'yesterday') return { from: addDays(today, -1), to: addDays(today, -1) };
  if (p === 'week') return { from: addDays(today, -6), to: today };
  if (p === 'month') return { from: `${today.slice(0, 8)}01`, to: today };
  return custom;
};

// Spreadsheet programs run text that starts with = + - @ as a formula, so those cells get a leading apostrophe
const csvCell = (v: string | number) => {
  const s = String(v ?? '');
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export const AdminReceiptsPage: React.FC = () => {
  const [preset, setPreset] = useState<Preset>('today');
  const [custom, setCustom] = useState({ from: todayIst(), to: todayIst() });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState('');
  const [dueOnly, setDueOnly] = useState(false);
  const [list, setList] = useState<Receipt[]>([]);
  const [summary, setSummary] = useState<ReceiptSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const range = rangeFor(preset, custom);

  const load = async () => {
    const qs = new URLSearchParams({ from: range.from, to: range.to, limit: '1000' });
    if (q.trim()) qs.set('q', q.trim());
    if (status) qs.set('status', status);
    if (mode) qs.set('mode', mode);
    if (dueOnly) qs.set('due', 'true');
    try {
      const [rows, sum] = await Promise.all([
        apiFetch<Receipt[]>(`/receipts?${qs}`),
        apiFetch<ReceiptSummary>(`/receipts/summary?from=${range.from}&to=${range.to}`),
      ]);
      setList(Array.isArray(rows.data) ? rows.data : []);
      setSummary(sum.data);
      setError('');
    } catch (e: any) {
      setError(e?.message || 'Could not load receipts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to, q, status, mode, dueOnly]);

  const byKind = useMemo(() => {
    const m = new Map<string, { n: number; total: number }>();
    list
      .filter((r) => r.status === 'ISSUED')
      .forEach((r) => {
        const e = m.get(r.kind) || { n: 0, total: 0 };
        e.n += 1;
        e.total += r.total;
        m.set(r.kind, e);
      });
    return Array.from(m.entries())
      .map(([k, v]) => ({ label: kindLabel(k), value: v.total, sub: `${v.n} receipt${v.n === 1 ? '' : 's'}` }))
      .sort((a, b) => b.value - a.value);
  }, [list]);

  const exportCsv = () => {
    const head = ['Receipt no', 'Date', 'Patient', 'Mobile', 'Type', 'Total', 'GST', 'Discount', 'Received', 'Balance', 'Paid by', 'Status', 'Made by'];
    const rows = list.map((r) => [
      r.receiptNo, dateTimeText(r.createdAt), r.patientName, r.patientPhone, kindLabel(r.kind), r.total, r.tax, r.discount, r.paid, r.balance,
      modeLabel(r.paymentMode), r.status === 'CANCELLED' ? 'Cancelled' : 'Issued', r.issuedByName || '',
    ]);
    const csv = [head, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts-${range.from}${range.from === range.to ? '' : `-to-${range.to}`}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const rangeText = range.from === range.to ? dayText(range.from) : `${dayText(range.from)} to ${dayText(range.to)}`;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <PageHeader
        icon={ReceiptIcon}
        title="Receipts"
        subtitle="Money received at the hospital, and the receipts given for it."
        actions={
          <Link to="/admin/receipts/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Make a receipt
          </Link>
        }
      />

      <div className="bg-white border border-[#E7E3DA] rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {([['today', 'Today'], ['yesterday', 'Yesterday'], ['week', 'Last 7 days'], ['month', 'This month'], ['custom', 'Pick dates']] as const).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={preset === k} onClick={() => setPreset(k)} className={`min-h-[44px] sm:min-h-0 px-3.5 py-2 rounded-md border text-sm ${preset === k ? 'bg-[#0F766E] border-[#0F766E] text-white font-semibold' : 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'}`}>
              {label}
            </button>
          ))}
          <span className="ml-auto text-sm text-stone-600">Showing <span className="font-semibold text-[#1C2321]">{rangeText}</span></span>
        </div>
        {preset === 'custom' && (
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm">From<input type="date" max={custom.to} value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className={`${inputClass} mt-1`} /></label>
            <label className="text-sm">To<input type="date" min={custom.from} value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className={`${inputClass} mt-1`} /></label>
          </div>
        )}
      </div>

      {error && <Notice kind="error" action={{ label: 'Try again', onClick: load }}>{error}</Notice>}

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Stat icon={Wallet} label="Money received" value={inr(summary.collected)} hint={`${summary.receiptsIssued} receipt${summary.receiptsIssued === 1 ? '' : 's'}`} />
            <Stat icon={TrendingUp} label="Total billed" value={inr(summary.billed)} tone="stone" hint={summary.tax > 0 ? `includes ${inr(summary.tax)} GST` : undefined} />
            <Stat icon={Hourglass} label="Still to collect" value={inr(summary.outstanding)} tone={summary.outstanding > 0 ? 'amber' : 'stone'} hint="all dates" />
            <Stat icon={Banknote} label="Cancelled" value={summary.receiptsCancelled} tone={summary.receiptsCancelled > 0 ? 'red' : 'stone'} hint="not counted in money" />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Panel title="How the money came in" icon={Wallet} className="p-0">
              <div className="p-4 sm:p-5">
                <SplitBar
                  parts={PAYMENT_MODES.map((m) => ({ label: m.label, value: summary.byMode[m.value] || 0, color: MODE_COLORS[m.value] }))}
                  format={inr}
                  emptyText="No money received in these dates."
                />
              </div>
            </Panel>
            <Panel title="What it was for" icon={ReceiptIcon} className="p-0">
              <div className="p-4 sm:p-5">
                {byKind.length === 0 ? <p className="text-sm text-stone-500">No receipts in these dates.</p> : <BarList rows={byKind} format={inr} />}
              </div>
            </Panel>
          </div>
        </>
      )}

      <Panel>
        <div className="p-4 border-b border-[#E7E3DA] grid md:grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
          <label className="relative block">
            <span className="sr-only">Search receipts</span>
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by patient, mobile number or receipt number" className={`${inputClass} pl-9`} />
          </label>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="">All receipts</option>
            <option value="ISSUED">Valid only</option>
            <option value="CANCELLED">Cancelled only</option>
          </select>
          <select aria-label="How it was paid" value={mode} onChange={(e) => setMode(e.target.value)} className={inputClass}>
            <option value="">Any payment type</option>
            {PAYMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm min-h-[44px] md:min-h-0 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[#0F766E]" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} /> Balance due only
          </label>
        </div>

        {loading && list.length === 0 ? (
          <p className="px-5 py-10 text-center text-stone-500">Loading…</p>
        ) : list.length === 0 ? (
          <EmptyState icon={ReceiptIcon} title="No receipts here" text="Try another date range, or make the first receipt." action={<Link to="/admin/receipts/new" className="btn-primary"><Plus className="w-4 h-4" /> Make a receipt</Link>} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead>
                  <tr className="bg-stone-50 border-b border-[#E7E3DA] text-stone-600 text-sm">
                    <th className="py-3 px-4 font-medium">Receipt</th>
                    <th className="py-3 px-4 font-medium">Patient</th>
                    <th className="py-3 px-4 font-medium">For</th>
                    <th className="py-3 px-4 font-medium text-right">Total</th>
                    <th className="py-3 px-4 font-medium text-right">Received</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E3DA]">
                  {list.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4">
                        <Link to={`/admin/receipts/${r.id}`} className="font-medium text-[#0F766E] hover:underline underline-offset-4">{r.receiptNo}</Link>
                        <span className="block text-sm text-stone-500">{dateTimeText(r.createdAt)}</span>
                      </td>
                      <td className="py-3 px-4"><span className="font-medium">{r.patientName}</span><span className="block text-sm text-stone-500">+91 {r.patientPhone}</span></td>
                      <td className="py-3 px-4 text-stone-700">{kindLabel(r.kind)}<span className="block text-sm text-stone-500">{modeLabel(r.paymentMode)}</span></td>
                      <td className="py-3 px-4 text-right font-medium tabular-nums">{inr(r.total)}</td>
                      <td className="py-3 px-4 text-right tabular-nums">{inr(r.paid)}</td>
                      <td className="py-3 px-4 text-sm">
                        {r.status === 'CANCELLED' ? (
                          <span className="inline-flex items-center gap-1.5 text-stone-500"><span className="w-2 h-2 rounded-full bg-stone-300" />Cancelled</span>
                        ) : r.balance > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-800"><span className="w-2 h-2 rounded-full bg-amber-500" />{inr(r.balance)} due</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#0F766E]"><span className="w-2 h-2 rounded-full bg-[#0F766E]" />Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-[#E7E3DA] flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
              <span>{list.length} receipt{list.length === 1 ? '' : 's'} shown{list.length >= 1000 ? ' (first 1,000)' : ''}</span>
              <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4">
                <FileDown className="w-4 h-4" /> Download for Excel
              </button>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
};
