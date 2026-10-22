import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { RegisteredPatient } from '../lib/reception';
import { inputClass } from '../lib/reception';

interface Props {
  value: RegisteredPatient | null;
  onChange: (p: RegisteredPatient | null) => void;
  /** Where "Register a new patient" should return after saving */
  registerHint?: string;
}

/** Search registered patients by name, mobile number or registration number. */
export const PatientPicker: React.FC<Props> = ({ value, onChange, registerHint }) => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<RegisteredPatient[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (value) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const res = await apiFetch<RegisteredPatient[]>(`/patients?limit=8&q=${encodeURIComponent(q.trim())}`);
        if (!cancelled) {
          setResults(Array.isArray(res.data) ? res.data : []);
          setError('');
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Could not search patients.');
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, value]);

  if (value) {
    return (
      <div className="flex flex-wrap items-start justify-between gap-3 p-3 rounded-md border border-[#0F766E] bg-white">
        <div className="min-w-0">
          <p className="font-medium text-[#1C2321]">{value.name}</p>
          <p className="text-sm text-stone-600">
            {value.regNo} · +91 {value.phone}
            {value.age !== null ? ` · ${value.age} yrs` : ''}
            {value.gender ? ` · ${value.gender}` : ''}
          </p>
          {value.scheme && <p className="text-sm text-stone-500">Scheme: {value.scheme}</p>}
        </div>
        <button type="button" onClick={() => onChange(null)} className="text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4 min-h-[44px] sm:min-h-0">
          Change patient
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="relative block">
        <span className="sr-only">Search registered patients</span>
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, mobile number or registration number"
          className={`${inputClass} pl-9`}
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {busy && results.length === 0 ? (
        <p className="text-sm text-stone-500">Searching…</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-stone-600">
          {q.trim() ? 'No registered patient matches.' : 'No patients registered yet.'}{' '}
          <Link to={`/admin/registration?new=1${registerHint ? `&then=${registerHint}` : ''}`} className="text-[#0F766E] font-semibold hover:underline underline-offset-4">
            <UserPlus className="w-3.5 h-3.5 inline -mt-0.5 mr-1" aria-hidden />
            Register a new patient
          </Link>
        </p>
      ) : (
        <ul className="border border-[#E7E3DA] rounded-md divide-y divide-[#E7E3DA] bg-white">
          {results.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => onChange(p)} className="w-full text-left px-3 py-2.5 min-h-[44px] hover:bg-stone-50">
                <span className="font-medium text-[#1C2321]">{p.name}</span>
                <span className="block text-sm text-stone-600">
                  {p.regNo} · +91 {p.phone}
                  {p.age !== null ? ` · ${p.age} yrs` : ''}
                </span>
              </button>
            </li>
          ))}
          <li className="px-3 py-2.5 text-sm">
            <Link to={`/admin/registration?new=1${registerHint ? `&then=${registerHint}` : ''}`} className="text-[#0F766E] font-semibold hover:underline underline-offset-4">
              Register a new patient
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};
