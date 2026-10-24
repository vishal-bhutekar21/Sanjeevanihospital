import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarPlus, ClipboardList, Pencil, Receipt, Search, UserPlus, Users } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import type { RegisteredPatient } from '../../lib/reception';
import { dayText, inputClass } from '../../lib/reception';
import { EmptyState, Field, Notice, PageHeader, Panel, Stat } from '../../components/adminUi';

const SCHEMES = ['MJPJAY', 'Ayushman Bharat (PM-JAY)', 'Insurance / TPA', 'Other'];

interface FormState {
  name: string;
  phone: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  idNumber: string;
  scheme: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
}

const emptyForm: FormState = {
  name: '', phone: '', age: '', dateOfBirth: '', gender: '', address: '', idNumber: '', scheme: '',
  emergencyContactName: '', emergencyContactPhone: '', notes: '',
};

const fromPatient = (p: RegisteredPatient): FormState => ({
  name: p.name,
  phone: p.phone,
  age: p.age !== null && !p.dateOfBirth ? String(p.age) : '',
  dateOfBirth: p.dateOfBirth || '',
  gender: p.gender || '',
  address: p.address || '',
  idNumber: p.idNumber || '',
  scheme: p.scheme || '',
  emergencyContactName: p.emergencyContactName || '',
  emergencyContactPhone: p.emergencyContactPhone || '',
  notes: p.notes || '',
});

export const AdminRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [list, setList] = useState<RegisteredPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [mode, setMode] = useState<'closed' | 'new' | 'edit'>(params.get('new') === '1' ? 'new' : 'closed');
  const [editing, setEditing] = useState<RegisteredPatient | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [family, setFamily] = useState<RegisteredPatient[]>([]);
  const [saved, setSaved] = useState<RegisteredPatient | null>(null);

  const load = async (term = q) => {
    try {
      const res = await apiFetch<RegisteredPatient[]>(`/patients?limit=100&q=${encodeURIComponent(term.trim())}`);
      setList(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (e: any) {
      setError(e?.message || 'Could not load patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Warn when the mobile number is already used, so the same person is not entered twice
  useEffect(() => {
    if (mode !== 'new' || !/^[6-9]\d{9}$/.test(form.phone)) {
      setFamily([]);
      return;
    }
    let cancelled = false;
    apiFetch<RegisteredPatient[]>(`/patients/by-phone/${form.phone}`)
      .then((r) => !cancelled && setFamily(Array.isArray(r.data) ? r.data : []))
      .catch(() => !cancelled && setFamily([]));
    return () => {
      cancelled = true;
    };
  }, [form.phone, mode]);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const open = (p?: RegisteredPatient) => {
    setSaved(null);
    setFormError('');
    if (p) {
      setEditing(p);
      setForm(fromPatient(p));
      setMode('edit');
    } else {
      setEditing(null);
      setForm(emptyForm);
      setMode('new');
    }
    setTimeout(() => document.getElementById('p-name')?.focus(), 50);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (form.name.trim().length < 2) return setFormError('Enter the patient’s name.');
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setFormError('Enter a 10-digit mobile number.');
    if (!form.dateOfBirth && form.age === '') return setFormError('Enter the age or the date of birth.');
    if (form.emergencyContactPhone && !/^[6-9]\d{9}$/.test(form.emergencyContactPhone)) {
      return setFormError('The emergency contact number must be 10 digits.');
    }
    const body: Record<string, unknown> = {
      name: form.name.trim(),
      phone: form.phone,
      gender: form.gender || undefined,
      address: form.address,
      idNumber: form.idNumber,
      scheme: form.scheme,
      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone || undefined,
      notes: form.notes,
    };
    if (form.dateOfBirth) body.dateOfBirth = form.dateOfBirth;
    else if (form.age !== '') body.age = Number(form.age);

    setBusy(true);
    try {
      const res =
        mode === 'edit' && editing
          ? await apiFetch<RegisteredPatient>(`/patients/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) })
          : await apiFetch<RegisteredPatient>('/patients', { method: 'POST', body: JSON.stringify(body) });
      const then = params.get('then');
      if (mode === 'new' && (then === 'appointment' || then === 'receipt')) {
        navigate(then === 'appointment' ? `/admin/appointments/new?patientId=${res.data.id}` : `/admin/receipts/new?patientId=${res.data.id}`);
        return;
      }
      setSaved(res.data);
      setMode('closed');
      load();
    } catch (err: any) {
      setFormError(err?.message || 'Could not save the patient.');
    } finally {
      setBusy(false);
    }
  };

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return list.filter((p) => new Date(p.createdAt).toDateString() === today).length;
  }, [list]);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <PageHeader
        icon={Users}
        title="Patients"
        subtitle="Register new patients and find the ones already registered."
        actions={
          mode === 'closed' && (
            <button type="button" className="btn-primary" onClick={() => open()}>
              <UserPlus className="w-4 h-4" /> Register new patient
            </button>
          )
        }
      />

      {saved && (
        <div className="bg-white border border-emerald-300 rounded-lg p-4 sm:p-5">
          <p className="text-sm text-emerald-800 font-medium">Saved</p>
          <p className="mt-1 text-xl font-semibold">{saved.name}</p>
          <p className="text-stone-600">Registration number <span className="font-semibold text-[#1C2321]">{saved.regNo}</span></p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={`/admin/appointments/new?patientId=${saved.id}`} className="btn-primary"><CalendarPlus className="w-4 h-4" /> Book a visit</Link>
            <Link to={`/admin/receipts/new?patientId=${saved.id}`} className="btn-secondary"><Receipt className="w-4 h-4" /> Make a receipt</Link>
            <button type="button" className="btn-secondary" onClick={() => open()}>Register another</button>
          </div>
        </div>
      )}

      {mode !== 'closed' && (
        <form onSubmit={submit} className="bg-white border border-[#0F766E] rounded-lg p-4 sm:p-5 space-y-6" noValidate>
          <h2 className="text-lg">{mode === 'edit' ? `Edit ${editing?.name}` : 'New patient'}</h2>
          {formError && <Notice kind="error">{formError}</Notice>}

          <fieldset className="space-y-4">
            <legend className="font-medium mb-2">Basic details</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" htmlFor="p-name">
                <input id="p-name" className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="off" />
              </Field>
              <Field label="Mobile number" htmlFor="p-phone" hint="10 digits, without +91">
                <input id="p-phone" inputMode="numeric" maxLength={10} className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} autoComplete="off" />
              </Field>
              <Field label="Date of birth" htmlFor="p-dob" hint="If you don’t know it, type the age instead.">
                <input id="p-dob" type="date" max={new Date().toISOString().slice(0, 10)} className={inputClass} value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
              </Field>
              <Field label="Age (years)" htmlFor="p-age">
                <input id="p-age" inputMode="numeric" disabled={!!form.dateOfBirth} className={`${inputClass} disabled:bg-stone-50 disabled:text-stone-400`} value={form.dateOfBirth ? 'Worked out from date of birth' : form.age} onChange={(e) => set('age', e.target.value.replace(/\D/g, '').slice(0, 3))} />
              </Field>
              <Field label="Gender" htmlFor="p-gender">
                <select id="p-gender" className={inputClass} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Scheme or insurance (if any)" htmlFor="p-scheme">
                <select id="p-scheme" className={inputClass} value={form.scheme} onChange={(e) => set('scheme', e.target.value)}>
                  <option value="">None</option>
                  {SCHEMES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            {family.length > 0 && mode === 'new' && (
              <Notice kind="info">
                This number is already registered for {family.map((f) => `${f.name} (${f.regNo})`).join(', ')}. If this is a different family member, go ahead and register them.
              </Notice>
            )}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-medium mb-2">Address and ID <span className="text-stone-500 font-normal">(optional)</span></legend>
            <Field label="Address" htmlFor="p-address">
              <textarea id="p-address" rows={2} className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <Field label="Aadhaar or ABHA number" htmlFor="p-id">
              <input id="p-id" className={inputClass} value={form.idNumber} onChange={(e) => set('idNumber', e.target.value)} autoComplete="off" />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-medium mb-2">Someone to call in an emergency <span className="text-stone-500 font-normal">(optional)</span></legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" htmlFor="p-ecn">
                <input id="p-ecn" className={inputClass} value={form.emergencyContactName} onChange={(e) => set('emergencyContactName', e.target.value)} autoComplete="off" />
              </Field>
              <Field label="Mobile number" htmlFor="p-ecp">
                <input id="p-ecp" inputMode="numeric" maxLength={10} className={inputClass} value={form.emergencyContactPhone} onChange={(e) => set('emergencyContactPhone', e.target.value.replace(/\D/g, ''))} autoComplete="off" />
              </Field>
            </div>
            <Field label="Notes (allergies, anything staff should know)" htmlFor="p-notes">
              <textarea id="p-notes" rows={2} className={inputClass} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </Field>
          </fieldset>

          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
              {busy ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Register patient'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setMode('closed')}>Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Stat icon={Users} label="Patients found" value={list.length} hint={q.trim() ? 'matching your search' : 'most recent first'} />
        <Stat icon={UserPlus} label="Registered today" value={todayCount} tone="stone" />
      </div>

      <Panel>
        <div className="p-4 border-b border-[#E7E3DA]">
          <label className="relative block">
            <span className="sr-only">Search patients</span>
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, mobile number or registration number" className={`${inputClass} pl-9`} />
          </label>
        </div>
        {error && <div className="p-4"><Notice kind="error" action={{ label: 'Try again', onClick: () => load() }}>{error}</Notice></div>}
        {loading ? (
          <p className="px-5 py-8 text-stone-500">Loading…</p>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Users}
            title={q.trim() ? 'No patient matches your search' : 'No patients registered yet'}
            text={q.trim() ? 'Check the spelling or try the mobile number.' : 'Register the first patient to see them here.'}
            action={!q.trim() && <button type="button" className="btn-primary" onClick={() => open()}><UserPlus className="w-4 h-4" /> Register new patient</button>}
          />
        ) : (
          <ul className="divide-y divide-[#E7E3DA]">
            {list.map((p) => (
              <li key={p.id} className="px-4 sm:px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-10 h-10 rounded-full bg-[#E6F2F0] text-[#0F766E] flex items-center justify-center font-semibold shrink-0" aria-hidden>
                    {p.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-[#1C2321]">{p.name}</p>
                    <p className="text-sm text-stone-600">
                      {p.regNo} · +91 {p.phone}
                      {p.age !== null ? ` · ${p.age} yrs` : ''}
                      {p.gender ? ` · ${p.gender}` : ''}
                    </p>
                    <p className="text-sm text-stone-500">
                      Registered {dayText(p.createdAt.slice(0, 10))}
                      {p.scheme ? ` · ${p.scheme}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <Link to={`/admin/appointments/new?patientId=${p.id}`} className="inline-flex items-center gap-1.5 min-h-[44px] lg:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4"><CalendarPlus className="w-4 h-4" /> Book visit</Link>
                  <Link to={`/admin/receipts/new?patientId=${p.id}`} className="inline-flex items-center gap-1.5 min-h-[44px] lg:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4"><Receipt className="w-4 h-4" /> Receipt</Link>
                  <Link to={`/admin/patients?phone=${p.phone}`} className="inline-flex items-center gap-1.5 min-h-[44px] lg:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4"><ClipboardList className="w-4 h-4" /> Bills & medicines</Link>
                  <button type="button" onClick={() => open(p)} className="inline-flex items-center gap-1.5 min-h-[44px] lg:min-h-0 text-stone-700 font-semibold hover:underline underline-offset-4"><Pencil className="w-4 h-4" /> Edit</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};
