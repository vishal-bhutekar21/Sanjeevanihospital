import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Banknote, Download, Printer, Receipt as ReceiptIcon, XCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ReceiptLangToggle } from '../../components/ReceiptLangToggle';
import { Field, Notice, PageHeader, Panel } from '../../components/adminUi';
import type { PaymentMode, Receipt } from '../../lib/reception';
import { PAYMENT_MODES, dateTimeText, getReceiptLang, inputClass, inr, kindLabel, modeLabel, setReceiptLang } from '../../lib/reception';
import { HOSPITAL } from '../../config/hospital';
import { KIND_MR, MODE_MR, RECEIPT_LABELS, downloadReceiptPdf, printReceiptPdf } from '../../lib/receiptPdf';

export const AdminReceiptDetailPage: React.FC = () => {
  const { id } = useParams();
  const { admin } = useAdminAuth();
  const [r, setR] = useState<Receipt | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState(getReceiptLang());
  const [panel, setPanel] = useState<'none' | 'collect' | 'cancel'>('none');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<PaymentMode>('CASH');
  const [ref, setRef] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    apiFetch<Receipt>(`/receipts/${id}`)
      .then((res) => setR(res.data))
      .catch((e) => setError(e?.message || 'Could not load this receipt.'));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const act = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      setMessage(done);
      setPanel('none');
      await load();
    } catch (e: any) {
      setError(e?.message || 'That did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const changeLang = (l: 'en' | 'mr') => {
    setLang(l);
    setReceiptLang(l);
  };

  if (!r) return <div className="max-w-[900px] mx-auto">{error ? <Notice kind="error">{error}</Notice> : <p className="text-stone-500">Loading…</p>}</div>;

  const t = RECEIPT_LABELS[lang];
  const cancelled = r.status === 'CANCELLED';
  const kind = lang === 'mr' ? KIND_MR[r.kind] || kindLabel(r.kind) : kindLabel(r.kind);

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <Link to="/admin/receipts" className="inline-flex items-center gap-1.5 text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4 min-h-[44px] sm:min-h-0">
        <ArrowLeft className="w-4 h-4" /> All receipts
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
        <PageHeader icon={ReceiptIcon} title={r.receiptNo} subtitle={`${r.patientName} · ${dateTimeText(r.createdAt)}`} />
        <ReceiptLangToggle value={lang} onChange={changeLang} />
      </div>

      {message && <Notice kind="ok">{message}</Notice>}
      {error && <Notice kind="error">{error}</Notice>}
      {cancelled && <Notice kind="warn">This receipt was cancelled{r.cancelReason ? ` because: ${r.cancelReason}` : ''}. It is kept for the records and is not counted in the money received.</Notice>}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => downloadReceiptPdf(r, lang)}><Download className="w-4 h-4" /> Download PDF</button>
        <button type="button" className="btn-secondary" onClick={() => printReceiptPdf(r, lang)}><Printer className="w-4 h-4" /> Print</button>
        {!cancelled && r.balance > 0 && (
          <button type="button" className="btn-secondary" onClick={() => { setPanel(panel === 'collect' ? 'none' : 'collect'); setAmount(String(r.balance)); }}>
            <Banknote className="w-4 h-4" /> Take remaining payment
          </button>
        )}
        {!cancelled && (
          <button type="button" className="btn-secondary text-red-700" onClick={() => setPanel(panel === 'cancel' ? 'none' : 'cancel')}>
            <XCircle className="w-4 h-4" /> Cancel receipt
          </button>
        )}
      </div>

      {panel === 'collect' && (
        <form
          className="bg-white border border-[#0F766E] rounded-lg p-4 sm:p-5 grid sm:grid-cols-3 gap-4 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            act(() => apiFetch(`/receipts/${r.id}/collect`, { method: 'POST', body: JSON.stringify({ amount: Number(amount), mode, ref: ref.trim() || undefined }) }), 'Payment added to this receipt.');
          }}
        >
          <Field label={`Amount (₹) · ${inr(r.balance)} is due`} htmlFor="c-amt"><input id="c-amt" inputMode="decimal" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} /></Field>
          <Field label="How was it paid?" htmlFor="c-mode">
            <select id="c-mode" className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as PaymentMode)}>
              {PAYMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Reference number" htmlFor="c-ref"><input id="c-ref" className={inputClass} value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
          <div className="sm:col-span-3"><button type="submit" disabled={busy || !(Number(amount) > 0)} className="btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Add payment'}</button></div>
        </form>
      )}

      {panel === 'cancel' && (
        <form
          className="bg-white border border-red-300 rounded-lg p-4 sm:p-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            act(() => apiFetch(`/receipts/${r.id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }), 'Receipt cancelled.');
          }}
        >
          <p className="text-sm text-stone-700">A receipt can’t be edited or deleted. If it has a mistake, cancel it and make a new one.{admin?.role === 'RECEPTIONIST' ? ' You can only cancel receipts made today.' : ''}</p>
          <Field label="Why is it being cancelled?" htmlFor="x-reason"><input id="x-reason" className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
          <button type="submit" disabled={busy || reason.trim().length < 3} className="btn-primary bg-red-700 hover:bg-red-800 border-red-700 disabled:opacity-60">{busy ? 'Cancelling…' : 'Cancel this receipt'}</button>
        </form>
      )}

      {/* The receipt as it will print */}
      <Panel className={`p-5 sm:p-8 ${cancelled ? 'opacity-70' : ''}`}>
        <div className="border-b-2 border-[#0F766E] pb-4">
          <p className="text-lg font-semibold">{HOSPITAL.name}</p>
          <p className="text-sm text-stone-600">{HOSPITAL.address.letterhead}</p>
          {r.hospital.gstin && <p className="text-sm text-stone-600">{t.gstin}: {r.hospital.gstin}</p>}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[#0F766E] font-semibold text-lg">{t.title}</p>
          {cancelled && <p className="text-red-700 font-bold text-xl">{t.cancelled}</p>}
        </div>
        <dl className="mt-3 grid sm:grid-cols-3 gap-x-6 gap-y-3 text-[15px]">
          {[
            [t.no, r.receiptNo],
            [t.date, dateTimeText(r.createdAt)],
            [t.type, kind],
            [t.patient, r.patientName],
            [t.regNo, r.patientRegNo || '-'],
            [t.mobile, `+91 ${r.patientPhone}`],
            ...(r.doctorName ? [[t.doctor, r.doctorName]] : []),
            ...(r.appointmentCode ? [[t.token, r.appointmentCode]] : []),
          ].map(([k, v]) => (
            <div key={k}><dt className="text-xs text-stone-500">{k}</dt><dd className="font-medium break-words">{v}</dd></div>
          ))}
        </dl>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-[15px] min-w-[520px]">
            <thead>
              <tr className="bg-stone-50 text-stone-600 text-sm text-left">
                <th className="py-2 px-3 font-medium">{t.item}</th>
                <th className="py-2 px-3 font-medium text-right">{t.qty}</th>
                <th className="py-2 px-3 font-medium text-right">{t.rate}</th>
                <th className="py-2 px-3 font-medium text-right">{t.gst} %</th>
                <th className="py-2 px-3 font-medium text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DA]">
              {r.items.map((i, n) => (
                <tr key={n}>
                  <td className="py-2.5 px-3">{n + 1}. {i.name}</td>
                  <td className="py-2.5 px-3 text-right">{i.qty}</td>
                  <td className="py-2.5 px-3 text-right">{inr(i.rate)}</td>
                  <td className="py-2.5 px-3 text-right">{i.gstPercent ? `${i.gstPercent}%` : '-'}</td>
                  <td className="py-2.5 px-3 text-right">{inr(i.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="mt-4 ml-auto max-w-xs space-y-1.5 text-[15px]">
          <div className="flex justify-between"><dt className="text-stone-600">{t.subtotal}</dt><dd>{inr(r.subtotal)}</dd></div>
          {r.discount > 0 && <div className="flex justify-between"><dt className="text-stone-600">{t.discount}</dt><dd>- {inr(r.discount)}</dd></div>}
          {r.tax > 0 && (
            <>
              <div className="flex justify-between"><dt className="text-stone-600">{t.cgst}</dt><dd>{inr(Math.round((r.tax / 2) * 100) / 100)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-600">{t.sgst}</dt><dd>{inr(Math.round((r.tax - Math.round((r.tax / 2) * 100) / 100) * 100) / 100)}</dd></div>
            </>
          )}
          <div className="flex justify-between border-t border-[#E7E3DA] pt-2 text-lg font-semibold"><dt>{t.total}</dt><dd>{inr(r.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-600">{t.paid}</dt><dd>{inr(r.paid)}</dd></div>
          <div className={`flex justify-between font-medium ${r.balance > 0 ? 'text-amber-800' : 'text-[#0F766E]'}`}><dt>{t.balance}</dt><dd>{inr(r.balance)}</dd></div>
        </dl>

        {r.payments.length > 0 && (
          <div className="mt-6">
            <p className="font-medium text-[#0F766E]">{t.payments}</p>
            <ul className="mt-2 divide-y divide-[#E7E3DA] text-[15px]">
              {r.payments.map((p, i) => (
                <li key={i} className="py-2 flex flex-wrap justify-between gap-x-4">
                  <span>{dateTimeText(p.at)} · {lang === 'mr' ? MODE_MR[p.mode] || modeLabel(p.mode) : modeLabel(p.mode)}{p.ref ? ` · ${p.ref}` : ''}</span>
                  <span className="font-medium">{inr(p.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {r.note && <p className="mt-4 text-[15px]"><span className="text-stone-500">{t.note}: </span>{r.note}</p>}
        {r.issuedByName && <p className="mt-4 text-sm text-stone-500">{t.by}: {r.issuedByName}</p>}
      </Panel>
    </div>
  );
};
