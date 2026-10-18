import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import type { PatientBill, PatientMedicine, PatientRecord } from '../../lib/patientPortal';
import { daysUntil, medicineAlerts, todayKey } from '../../lib/patientPortal';

interface Summary {
  phone: string;
  name: string;
  bills: number;
  amountDue: number;
  medicines: number;
  updatedAt: string;
}

const inputClass =
  'w-full px-3 py-2.5 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';
const labelClass = 'block text-sm font-medium mb-1';
const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const dateText = (key: string) =>
  key ? new Date(`${key}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

type Message = { kind: 'ok' | 'warn' | 'error'; text: string } | null;

export const AdminPatientRecordsPage: React.FC = () => {
  const [list, setList] = useState<Summary[]>([]);
  const [listError, setListError] = useState('');
  const [query, setQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [form, setForm] = useState<'bill' | 'medicine' | null>(null);

  const loadList = async () => {
    try {
      const res = await apiFetch<Summary[]>('/patient-records');
      setList(Array.isArray(res.data) ? res.data : []);
      setListError('');
    } catch (e: any) {
      setListError(e?.message || 'Could not load patients.');
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const open = async (p: string) => {
    const ten = p.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(ten)) {
      setMessage({ kind: 'error', text: 'Enter a valid 10-digit mobile number.' });
      return;
    }
    setPhone(ten);
    setLoading(true);
    setMessage(null);
    setForm(null);
    try {
      const res = await apiFetch<PatientRecord>(`/patient-records/${ten}`);
      setRecord(res.data);
    } catch (e: any) {
      setMessage({ kind: 'error', text: e?.message || 'Could not load this patient.' });
    } finally {
      setLoading(false);
    }
  };

  /** Apply a save result from the server and report where it was stored. */
  const applied = (res: { record: PatientRecord; savedInDatabase: boolean }, what: string) => {
    setRecord(res.record);
    setForm(null);
    setMessage(
      res.savedInDatabase
        ? { kind: 'ok', text: `${what} The patient sees it after signing in to Patient login.` }
        : {
            kind: 'warn',
            text: `${what} The database could not be reached, so it is kept on the server only until the next restart.`,
          },
    );
    loadList();
  };

  const remove = async (kind: 'bills' | 'medicines', id: string, label: string) => {
    if (!record || !window.confirm(`Remove ${label}? The patient will no longer see it.`)) return;
    try {
      const res = await apiFetch<{ record: PatientRecord; savedInDatabase: boolean }>(`/patient-records/${record.phone}/${kind}/${id}`, {
        method: 'DELETE',
      });
      applied(res.data, 'Removed.');
    } catch (e: any) {
      setMessage({ kind: 'error', text: e?.message || 'Could not remove. Please try again.' });
    }
  };

  const markPaid = async (b: PatientBill) => {
    if (!record) return;
    try {
      const res = await apiFetch<{ record: PatientRecord; savedInDatabase: boolean }>(`/patient-records/${record.phone}/bills/${b.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ paid: b.total }),
      });
      applied(res.data, `Bill ${b.billNo} marked as paid.`);
    } catch (e: any) {
      setMessage({ kind: 'error', text: e?.message || 'Could not update. Please try again.' });
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return list.filter((p) => !q || p.phone.includes(q.replace(/\D/g, '') || '~') || p.name.toLowerCase().includes(q));
  }, [list, query]);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Patient records</h1>
        <p className="mt-1 text-stone-600">
          Share bills and medicines with a patient by mobile number. The patient sees them under Patient login on the website, with
          reminders before a medicine expires.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Find patient */}
        <section className="lg:col-span-4 bg-white border border-[#E7E3DA] rounded-lg p-4 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              open(query);
            }}
          >
            <label htmlFor="pr-find" className={labelClass}>
              Mobile number or name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input id="pr-find" value={query} onChange={(e) => setQuery(e.target.value)} className={`${inputClass} pl-9`} inputMode="search" />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                Open
              </button>
            </div>
            <p className="mt-1.5 text-xs text-stone-500">Type a new mobile number and press Open to start a record.</p>
          </form>

          {listError && <p className="text-sm text-red-700">{listError}</p>}
          <ul className="divide-y divide-[#E7E3DA] border-t border-[#E7E3DA] max-h-[55vh] overflow-y-auto">
            {filtered.map((p) => (
              <li key={p.phone}>
                <button
                  type="button"
                  onClick={() => open(p.phone)}
                  className={`w-full text-left py-3 px-2 min-h-[44px] rounded ${phone === p.phone ? 'bg-[#E8F3F1]' : 'hover:bg-stone-50'}`}
                >
                  <span className="block font-medium">{p.name || 'Name not given'}</span>
                  <span className="block text-sm text-stone-500">
                    +91 {p.phone} · {p.bills} bill{p.bills === 1 ? '' : 's'} · {p.medicines} medicine{p.medicines === 1 ? '' : 's'}
                    {p.amountDue > 0 && <span className="text-amber-800"> · {rupees(p.amountDue)} due</span>}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && !listError && <li className="py-6 text-sm text-center text-stone-500">No patient records yet.</li>}
          </ul>
        </section>

        {/* Record */}
        <section className="lg:col-span-8 space-y-4 min-w-0">
          {message && (
            <div
              role={message.kind === 'error' ? 'alert' : 'status'}
              className={`p-3 rounded-md text-sm border ${
                message.kind === 'ok'
                  ? 'bg-[#E8F3F1] border-[#BFE3DD] text-[#0B5D57]'
                  : message.kind === 'warn'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {!record && !loading && (
            <p className="bg-white border border-[#E7E3DA] rounded-lg p-8 text-center text-stone-600">
              Choose a patient on the left, or type a mobile number and press Open.
            </p>
          )}
          {loading && <p className="bg-white border border-[#E7E3DA] rounded-lg p-8 text-center text-stone-500">Loading…</p>}

          {record && !loading && (
            <>
              <div className="bg-white border border-[#E7E3DA] rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-xl">{record.name || 'New patient'}</p>
                  <p className="text-stone-600">+91 {record.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-primary" onClick={() => setForm('bill')}>
                    <Plus className="w-4 h-4" /> Add bill
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setForm('medicine')}>
                    <Plus className="w-4 h-4" /> Add medicine
                  </button>
                </div>
              </div>

              {form === 'bill' && <BillForm record={record} onCancel={() => setForm(null)} onSaved={(r) => applied(r, 'Bill sent.')} />}
              {form === 'medicine' && (
                <MedicineForm record={record} onCancel={() => setForm(null)} onSaved={(r) => applied(r, 'Medicine sent.')} />
              )}

              {/* Bills */}
              <div className="bg-white border border-[#E7E3DA] rounded-lg">
                <h2 className="text-lg px-4 sm:px-5 pt-4">Bills</h2>
                {record.bills.length === 0 ? (
                  <p className="px-4 sm:px-5 py-4 text-sm text-stone-500">No bills yet.</p>
                ) : (
                  <ul className="divide-y divide-[#E7E3DA] mt-2">
                    {record.bills.map((b) => {
                      const due = Math.max(0, b.total - b.paid);
                      return (
                        <li key={b.id} className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium">
                              {b.title} <span className="text-stone-500 font-normal">· {b.billNo}</span>
                            </p>
                            <p className="text-sm text-stone-500">
                              {dateText(b.date)} · {b.items.length} line{b.items.length === 1 ? '' : 's'} · total {rupees(b.total)}
                              {due > 0 ? <span className="text-amber-800"> · {rupees(due)} due</span> : <span className="text-[#0B5D57]"> · paid</span>}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {due > 0 && (
                              <button type="button" className="btn-secondary" onClick={() => markPaid(b)}>
                                Mark paid
                              </button>
                            )}
                            <button
                              type="button"
                              aria-label={`Remove bill ${b.billNo}`}
                              className="p-2.5 min-w-[44px] min-h-[44px] rounded-md text-stone-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => remove('bills', b.id, `bill ${b.billNo}`)}
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Medicines */}
              <div className="bg-white border border-[#E7E3DA] rounded-lg">
                <h2 className="text-lg px-4 sm:px-5 pt-4">Medicines</h2>
                {record.medicines.length === 0 ? (
                  <p className="px-4 sm:px-5 py-4 text-sm text-stone-500">No medicines yet.</p>
                ) : (
                  <ul className="divide-y divide-[#E7E3DA] mt-2">
                    {record.medicines.map((m) => {
                      const alert = medicineAlerts([m]).find((a) => a.kind !== 'course-ending');
                      const exp = m.expiryDate ? daysUntil(m.expiryDate, todayKey()) : null;
                      return (
                        <li key={m.id} className="px-4 sm:px-5 py-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium">
                              {m.name} {m.strength} {m.dosage && <span className="text-stone-500 font-normal">· {m.dosage}</span>}
                            </p>
                            <p className="text-sm text-stone-500">
                              {dateText(m.startDate)} – {m.endDate ? dateText(m.endDate) : 'ongoing'}
                              {m.expiryDate && (
                                <span className={alert ? (exp! < 0 ? 'text-red-700' : 'text-amber-800') : ''}>
                                  {' '}
                                  · expires {dateText(m.expiryDate)}
                                  {exp !== null && exp < 0 ? ' (expired)' : ''}
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${m.name}`}
                            className="p-2.5 min-w-[44px] min-h-[44px] rounded-md text-stone-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                            onClick={() => remove('medicines', m.id, m.name)}
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

// ─── Forms ──────────────────────────────────────────────────────────────────

type SaveResult = { record: PatientRecord; savedInDatabase: boolean };

const BillForm: React.FC<{ record: PatientRecord; onCancel: () => void; onSaved: (r: SaveResult) => void }> = ({ record, onCancel, onSaved }) => {
  const [patientName, setPatientName] = useState(record.name);
  const [title, setTitle] = useState('OPD consultation');
  const [date, setDate] = useState(todayKey());
  const [items, setItems] = useState([{ name: '', qty: '1', amount: '' }]);
  const [paid, setPaid] = useState('0');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const total = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const setItem = (idx: number, key: 'name' | 'qty' | 'amount', value: string) =>
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const lines = items.filter((i) => i.name.trim());
    if (!lines.length) return setError('Add at least one line with a name and amount.');
    if (lines.some((i) => i.amount === '' || Number(i.amount) < 0)) return setError('Every line needs an amount.');
    setBusy(true);
    try {
      const res = await apiFetch<SaveResult>(`/patient-records/${record.phone}/bills`, {
        method: 'POST',
        body: JSON.stringify({
          patientName,
          title,
          date,
          items: lines.map((i) => ({ name: i.name.trim(), qty: Number(i.qty) || 1, amount: Number(i.amount) })),
          paid: Number(paid) || 0,
          note,
        }),
      });
      onSaved(res.data);
    } catch (err: any) {
      setError(err?.message || 'Could not send the bill.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-[#0F766E] rounded-lg p-4 sm:p-5 space-y-4">
      <h2 className="text-lg">New bill</h2>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass} htmlFor="b-name">Patient name</label>
          <input id="b-name" value={patientName} onChange={(e) => setPatientName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="b-title">Bill for</label>
          <input id="b-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} list="bill-titles" />
          <datalist id="bill-titles">
            {['OPD consultation', 'Pharmacy', 'Laboratory tests', 'X-ray / Sonography', 'IPD (admission)', 'Procedure'].map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div>
          <label className={labelClass} htmlFor="b-date">Date</label>
          <input id="b-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Lines</legend>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr,64px,104px,44px] gap-2 items-center">
              <input aria-label={`Line ${i + 1} item`} placeholder="Item or test" value={it.name} onChange={(e) => setItem(i, 'name', e.target.value)} className={inputClass} />
              <input aria-label={`Line ${i + 1} quantity`} inputMode="numeric" value={it.qty} onChange={(e) => setItem(i, 'qty', e.target.value.replace(/\D/g, ''))} className={`${inputClass} text-center`} />
              <input aria-label={`Line ${i + 1} amount in rupees`} inputMode="decimal" placeholder="₹" value={it.amount} onChange={(e) => setItem(i, 'amount', e.target.value.replace(/[^\d.]/g, ''))} className={`${inputClass} text-right`} />
              <button
                type="button"
                aria-label={`Remove line ${i + 1}`}
                disabled={items.length === 1}
                onClick={() => setItems((l) => l.filter((_, j) => j !== i))}
                className="min-h-[44px] rounded-md text-stone-500 hover:text-red-700 disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 text-sm font-semibold text-[#0F766E] py-2" onClick={() => setItems((l) => [...l, { name: '', qty: '1', amount: '' }])}>
          + Add line
        </button>
      </fieldset>

      <div className="grid sm:grid-cols-3 gap-3 items-end">
        <p className="text-[15px]">
          Total <span className="font-semibold">{rupees(total)}</span>
        </p>
        <div>
          <label className={labelClass} htmlFor="b-paid">Paid now (₹)</label>
          <input id="b-paid" inputMode="decimal" value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d.]/g, ''))} className={inputClass} />
        </div>
        <button type="button" className="btn-secondary" onClick={() => setPaid(String(total))}>
          Fully paid
        </button>
      </div>
      <div>
        <label className={labelClass} htmlFor="b-note">Note for the patient (optional)</label>
        <input id="b-note" value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Sending…' : 'Send bill'}</button>
      </div>
    </form>
  );
};

const MedicineForm: React.FC<{ record: PatientRecord; onCancel: () => void; onSaved: (r: SaveResult) => void }> = ({ record, onCancel, onSaved }) => {
  const [f, setF] = useState({
    patientName: record.name,
    name: '',
    strength: '',
    dosage: '1-0-1',
    instructions: 'After food',
    startDate: todayKey(),
    endDate: '',
    expiryDate: '',
    quantity: '',
    doctorName: '',
    note: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!f.name.trim()) return setError('Medicine name is missing.');
    setBusy(true);
    try {
      const res = await apiFetch<SaveResult>(`/patient-records/${record.phone}/medicines`, {
        method: 'POST',
        body: JSON.stringify({ ...f, quantity: Number(f.quantity) || 0 }),
      });
      onSaved(res.data);
    } catch (err: any) {
      setError(err?.message || 'Could not send the medicine.');
    } finally {
      setBusy(false);
    }
  };

  const field = (k: keyof typeof f, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className={labelClass} htmlFor={`m-${k}`}>{label}</label>
      <input id={`m-${k}`} value={f[k]} onChange={set(k)} className={inputClass} {...props} />
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-white border border-[#0F766E] rounded-lg p-4 sm:p-5 space-y-4">
      <h2 className="text-lg">New medicine</h2>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-3">
        {field('patientName', 'Patient name')}
        {field('name', 'Medicine', { placeholder: 'e.g. Paracetamol' })}
        {field('strength', 'Strength', { placeholder: 'e.g. 500 mg' })}
        {field('dosage', 'Dose (morning-afternoon-night)', { placeholder: '1-0-1' })}
        {field('instructions', 'How to take', { placeholder: 'After food' })}
        {field('quantity', 'Quantity', { inputMode: 'numeric' })}
        {field('startDate', 'Start date', { type: 'date' })}
        {field('endDate', 'Course ends (optional)', { type: 'date', min: f.startDate })}
        {field('expiryDate', 'Pack expiry date', { type: 'date' })}
        {field('doctorName', 'Prescribed by')}
      </div>
      {field('note', 'Note for the patient (optional)')}
      <p className="text-sm text-stone-500">
        The patient is reminded 30 days before the pack expiry date and in the last 3 days of the course.
      </p>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Sending…' : 'Send medicine'}</button>
      </div>
    </form>
  );
};
