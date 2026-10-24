import React, { useEffect, useState } from 'react';
import { KeyRound, UserPlus, UserCheck, UserX, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { inputClass } from '../../lib/reception';
import { EmptyState, Field, Notice, PageHeader, Panel } from '../../components/adminUi';

interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Owner',
  HOSPITAL_ADMIN: 'Administrator',
  RECEPTIONIST: 'Receptionist',
  DOCTOR: 'Doctor',
};

const ROLE_HELP: Record<string, string> = {
  RECEPTIONIST: 'Registers patients, books visits and makes receipts. Cannot see staff salaries or settings.',
  DOCTOR: 'Can see appointments, patients and their medicines. Cannot make receipts.',
  HOSPITAL_ADMIN: 'Can do everything, including adding other logins.',
};

const makePassword = () => {
  const letters = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  const word = Array.from({ length: 6 }, () => pick(letters)).join('');
  return `${word}${Math.floor(1000 + Math.random() * 9000)}`;
};

export const AdminStaffLoginsPage: React.FC = () => {
  const { admin } = useAdminAuth();
  const [list, setList] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: makePassword(), role: 'RECEPTIONIST' });
  const [showPw, setShowPw] = useState(true);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const [resetId, setResetId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const load = async () => {
    try {
      const res = await apiFetch<Account[]>('/auth/admin/users');
      setList(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (e: any) {
      setError(e?.message || 'Could not load the logins.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (form.name.trim().length < 3) return setFormError('Enter the full name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setFormError('Enter a valid email address. It is used to sign in.');
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return setFormError('The password needs at least 8 characters, with letters and numbers.');
    }
    setBusy(true);
    try {
      await apiFetch('/auth/admin/register', {
        method: 'POST',
        body: JSON.stringify({ ...form, name: form.name.trim(), hospitalId: admin?.hospitalId }),
      });
      setMessage(`Login created for ${form.name.trim()}. Share the email and password with them privately.`);
      setAdding(false);
      setForm({ name: '', email: '', password: makePassword(), role: 'RECEPTIONIST' });
      load();
    } catch (err: any) {
      setFormError(err?.message || 'Could not create the login.');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (a: Account) => {
    setMessage('');
    try {
      await apiFetch(`/auth/admin/users/${a.id}/active`, { method: 'PATCH', body: JSON.stringify({ isActive: !a.isActive }) });
      setMessage(a.isActive ? `${a.name} can no longer sign in.` : `${a.name} can sign in again.`);
      load();
    } catch (err: any) {
      setError(err?.message || 'Could not change this login.');
    }
  };

  const reset = async (a: Account) => {
    setError('');
    try {
      await apiFetch(`/auth/admin/users/${a.id}/reset-password`, { method: 'POST', body: JSON.stringify({ password: newPassword }) });
      setMessage(`Password changed for ${a.name}.`);
      setResetId(null);
      setNewPassword('');
    } catch (err: any) {
      setError(err?.message || 'Could not change the password.');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <PageHeader
        icon={KeyRound}
        title="Team logins"
        subtitle="Give reception staff their own login. Everything they do is recorded with their name."
        actions={
          !adding && (
            <button type="button" className="btn-primary" onClick={() => setAdding(true)}>
              <UserPlus className="w-4 h-4" /> Add a login
            </button>
          )
        }
      />

      {message && <Notice kind="ok">{message}</Notice>}
      {error && <Notice kind="error" action={{ label: 'Try again', onClick: load }}>{error}</Notice>}

      {adding && (
        <form onSubmit={create} className="bg-white border border-[#0F766E] rounded-lg p-4 sm:p-5 space-y-4">
          <h2 className="text-lg">New login</h2>
          {formError && <Notice kind="error">{formError}</Notice>}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" htmlFor="l-name">
              <input id="l-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="off" />
            </Field>
            <Field label="Email (used to sign in)" htmlFor="l-email">
              <input id="l-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="off" />
            </Field>
            <Field label="Role" htmlFor="l-role" hint={ROLE_HELP[form.role]}>
              <select id="l-role" className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="DOCTOR">Doctor</option>
                <option value="HOSPITAL_ADMIN">Administrator</option>
              </select>
            </Field>
            <Field label="Password" htmlFor="l-pass" hint="A password has been suggested. You can type your own.">
              <div className="flex gap-2">
                <input
                  id="l-pass"
                  type={showPw ? 'text' : 'password'}
                  className={`${inputClass} font-mono`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'} className="btn-secondary px-3">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
              {busy ? 'Creating…' : 'Create login'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <Panel title="Everyone who can sign in" icon={UserCheck}>
        {loading ? (
          <p className="px-5 py-8 text-stone-500">Loading…</p>
        ) : list.length === 0 ? (
          <EmptyState icon={UserPlus} title="No logins yet" text="Add a login for each receptionist so their work is recorded under their own name." />
        ) : (
          <ul className="divide-y divide-[#E7E3DA]">
            {list.map((a) => (
              <li key={a.id} className="px-4 sm:px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold ${
                        a.isActive ? 'bg-[#E6F2F0] text-[#0F766E]' : 'bg-stone-100 text-stone-400'
                      }`}
                      aria-hidden
                    >
                      {a.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className={`font-medium ${a.isActive ? 'text-[#1C2321]' : 'text-stone-500'}`}>
                        {a.name}
                        {a.id === admin?.id && <span className="text-stone-500 font-normal"> (you)</span>}
                      </p>
                      <p className="text-sm text-stone-600 truncate">
                        {ROLE_LABEL[a.role] || a.role} · {a.email}
                      </p>
                      {!a.isActive && <p className="text-sm text-red-700">Cannot sign in</p>}
                    </div>
                  </div>
                  {a.id !== admin?.id && (a.role !== 'SUPER_ADMIN' || admin?.role === 'SUPER_ADMIN') && (
                    <div className="flex flex-wrap gap-x-5 text-sm">
                      <button type="button" onClick={() => { setResetId(resetId === a.id ? null : a.id); setNewPassword(makePassword()); }} className="min-h-[44px] sm:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4">
                        Change password
                      </button>
                      <button type="button" onClick={() => toggle(a)} className={`min-h-[44px] sm:min-h-0 font-semibold hover:underline underline-offset-4 inline-flex items-center gap-1.5 ${a.isActive ? 'text-red-700' : 'text-[#0F766E]'}`}>
                        {a.isActive ? <><UserX className="w-4 h-4" /> Stop access</> : <><UserCheck className="w-4 h-4" /> Allow access</>}
                      </button>
                    </div>
                  )}
                </div>
                {resetId === a.id && (
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-end">
                    <Field label={`New password for ${a.name}`} htmlFor={`pw-${a.id}`} className="flex-1">
                      <input id={`pw-${a.id}`} className={`${inputClass} font-mono`} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </Field>
                    <button type="button" className="btn-primary" onClick={() => reset(a)}>Save password</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <p className="text-sm text-stone-600">
        “Stop access” blocks the next sign-in. Someone who is already signed in stays signed in until they sign out or their session ends.
      </p>
    </div>
  );
};
