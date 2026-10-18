import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Download, Plus, Search } from 'lucide-react';
import { alertsPermission, enableAlerts } from '../../lib/staffNotify';
import {
  EMPLOYMENT_TYPES,
  PAYMENT_MODES,
  PAYMENT_TYPES,
  REPEAT_OPTIONS,
  STAFF_ROLES,
  STAFF_STATUSES,
  STAFF_STORAGE_KEY,
  addDays,
  addOneMonth,
  computeDues,
  dateLabel,
  downloadCsv,
  loadStaffData,
  monthLabel,
  newId,
  remindersDueSoon,
  rupees,
  saveStaffData,
  thisMonth,
  todayIso,
  type Employee,
  type EmploymentType,
  type PaymentMode,
  type PaymentType,
  type Repeat,
  type StaffData,
  type StaffPayment,
  type StaffReminder,
  type StaffRole,
  type StaffStatus,
} from '../../lib/staffStore';

type Tab = 'employees' | 'payments' | 'dues' | 'reminders';
const TABS: { key: Tab; label: string }[] = [
  { key: 'employees', label: 'Employees' },
  { key: 'payments', label: 'Payments' },
  { key: 'dues', label: 'Dues' },
  { key: 'reminders', label: 'Reminders' },
];

const inputClass =
  'w-full px-2.5 py-2 min-h-[44px] bg-white border border-[#D8D3C8] rounded-md text-sm focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';
const labelClass = 'block text-sm text-stone-600 mb-1';
const errorClass = 'mt-1 text-xs text-red-700';
const linkButton = 'text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4 min-h-[44px] px-1';
const dangerLinkButton = 'text-sm text-red-700 font-semibold hover:underline underline-offset-4 min-h-[44px] px-1';
const thClass = 'py-3 px-4 font-semibold';
const tdClass = 'py-3 px-4 align-top';

const filterButton = (active: boolean) =>
  `px-3.5 py-2 min-h-[44px] rounded-md border text-sm ${
    active ? 'bg-[#0F766E] border-[#0F766E] text-white font-semibold' : 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'
  }`;

interface PaymentPrefill {
  employeeId: string;
  month: string;
  amount: number;
  type: PaymentType;
  nonce: number;
}

export const AdminStaffPage: React.FC = () => {
  const [data, setData] = useState<StaffData>(() => loadStaffData());
  const [tab, setTab] = useState<Tab>('employees');
  const [storageError, setStorageError] = useState('');
  const [prefill, setPrefill] = useState<PaymentPrefill | null>(null);

  // Keep two open tabs of the admin panel in step
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STAFF_STORAGE_KEY) setData(loadStaffData());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /** Saves to the browser; returns false (and shows why) if the browser refused. */
  const commit = (next: StaffData): boolean => {
    if (!saveStaffData(next)) {
      setStorageError(
        'This browser did not allow saving (private window, storage full or blocked). The last change was not saved.',
      );
      return false;
    }
    setStorageError('');
    setData(next);
    return true;
  };

  const today = todayIso();
  const dueSoon = useMemo(() => remindersDueSoon(data, today), [data, today]);

  const exportEmployees = () => {
    const ok = downloadCsv(
      `staff-employees-${today}.csv`,
      ['Name', 'Role', 'Department', 'Mobile', 'Joining date', 'Monthly salary (Rs)', 'Employment type', 'Status', 'Notes'],
      data.employees.map((e) => [e.name, e.role, e.department, e.mobile, e.joiningDate, e.salary, e.employmentType, e.status, e.notes]),
    );
    if (!ok) setStorageError('Could not create the CSV file in this browser.');
  };

  const exportPayments = () => {
    const ok = downloadCsv(
      `staff-payments-${today}.csv`,
      ['Date', 'For month', 'Employee', 'Type', 'Amount (Rs)', 'Mode', 'Reference', 'Note'],
      [...data.payments]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((p) => [p.date, p.month, nameOf(data, p.employeeId, p.employeeName), p.type, p.amount, p.mode, p.reference, p.note]),
    );
    if (!ok) setStorageError('Could not create the CSV file in this browser.');
  };

  const recordFromDues = (employeeId: string, month: string, amount: number) => {
    setPrefill({ employeeId, month, amount, type: 'Salary', nonce: Date.now() });
    setTab('payments');
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Staff</h1>
          <p className="mt-1 text-stone-600">Hospital employees, salary payments, what is still due, and reminders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportEmployees} disabled={data.employees.length === 0} className="btn-secondary text-sm disabled:opacity-50">
            <Download className="w-4 h-4" /> Export employees
          </button>
          <button type="button" onClick={exportPayments} disabled={data.payments.length === 0} className="btn-secondary text-sm disabled:opacity-50">
            <Download className="w-4 h-4" /> Export payments
          </button>
        </div>
      </div>

      <div className="card-notice-amber text-sm">
        Saved in this browser only. Staff records will move to the hospital server in a later update; until then, use Export to keep a copy.
      </div>

      <AlertsSetting />

      {storageError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
          {storageError}
        </div>
      )}

      {dueSoon.length > 0 && (
        <section className="bg-white border border-[#E7E3DA] rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg">Due soon</h2>
            <button type="button" onClick={() => setTab('reminders')} className={linkButton}>
              All reminders
            </button>
          </div>
          <ul className="mt-2 divide-y divide-[#E7E3DA]">
            {dueSoon.map((r) => (
              <li key={r.id} className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1 text-[15px]">
                <span className="min-w-0">
                  {r.title}
                  {r.employeeId && <span className="text-stone-500"> · {nameOf(data, r.employeeId, r.employeeName)}</span>}
                </span>
                <DueText date={r.dueDate} today={today} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="bg-white border border-[#E7E3DA] rounded-lg p-4">
        <div role="tablist" aria-label="Staff sections" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={filterButton(tab === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'employees' && <EmployeesTab data={data} commit={commit} />}
      {tab === 'payments' && <PaymentsTab data={data} commit={commit} prefill={prefill} />}
      {tab === 'dues' && <DuesTab data={data} onRecord={recordFromDues} />}
      {tab === 'reminders' && <RemindersTab data={data} commit={commit} today={today} />}
    </div>
  );
};

// ---------- helpers ----------

const nameOf = (data: StaffData, id: string, fallback: string) => {
  const e = data.employees.find((x) => x.id === id);
  return e ? e.name : fallback ? `${fallback} (removed)` : '';
};

const DueText: React.FC<{ date: string; today: string }> = ({ date, today }) => {
  if (date < today) return <span className="text-red-700 font-medium shrink-0">Overdue · {dateLabel(date)}</span>;
  if (date === today) return <span className="text-amber-700 font-medium shrink-0">Today</span>;
  if (date <= addDays(today, 7)) return <span className="text-amber-700 font-medium shrink-0">{dateLabel(date)}</span>;
  return <span className="text-stone-600 shrink-0">{dateLabel(date)}</span>;
};

const parseAmount = (s: string) => {
  const n = Number(String(s).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : NaN;
};

const EmptyCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="bg-white border border-[#E7E3DA] rounded-lg px-5 py-10 text-center text-stone-500">{children}</p>
);

type Commit = (next: StaffData) => boolean;

// ---------- Employees ----------

interface EmployeeForm {
  name: string;
  role: StaffRole;
  department: string;
  mobile: string;
  joiningDate: string;
  salary: string;
  employmentType: EmploymentType;
  status: StaffStatus;
  notes: string;
}

const blankEmployee = (): EmployeeForm => ({
  name: '',
  role: 'Nurse',
  department: '',
  mobile: '',
  joiningDate: '',
  salary: '',
  employmentType: 'Full-time',
  status: 'Active',
  notes: '',
});

const EmployeesTab: React.FC<{ data: StaffData; commit: Commit }> = ({ data, commit }) => {
  const [editingId, setEditingId] = useState<string | null>(null); // 'new' for a new employee
  const [form, setForm] = useState<EmployeeForm>(blankEmployee);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeForm, string>>>({});
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | StaffRole>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | StaffStatus>('All');
  const [message, setMessage] = useState('');

  const active = data.employees.filter((e) => e.status === 'Active');
  const payroll = data.employees.filter((e) => e.status !== 'Left').reduce((s, e) => s + e.salary, 0);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.employees
      .filter((e) => roleFilter === 'All' || e.role === roleFilter)
      .filter((e) => statusFilter === 'All' || e.status === statusFilter)
      .filter((e) => !q || [e.name, e.department, e.mobile, e.role].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data.employees, query, roleFilter, statusFilter]);

  const set = <K extends keyof EmployeeForm>(k: K, v: EmployeeForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const startAdd = () => {
    setForm(blankEmployee());
    setErrors({});
    setMessage('');
    setEditingId('new');
  };

  const startEdit = (e: Employee) => {
    setForm({
      name: e.name,
      role: e.role,
      department: e.department,
      mobile: e.mobile,
      joiningDate: e.joiningDate,
      salary: String(e.salary),
      employmentType: e.employmentType,
      status: e.status,
      notes: e.notes,
    });
    setErrors({});
    setMessage('');
    setEditingId(e.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    const err: typeof errors = {};
    const salary = parseAmount(form.salary);
    const mobile = form.mobile.replace(/\D/g, '');
    if (!form.name.trim()) err.name = 'Enter the full name.';
    if (form.mobile.trim() && !/^\d{10}$/.test(mobile)) err.mobile = 'Enter a 10-digit mobile number.';
    if (!form.salary.trim() || Number.isNaN(salary) || salary < 0) err.salary = 'Enter the monthly salary in rupees (0 if none).';
    setErrors(err);
    if (Object.keys(err).length) return;

    const employee: Employee = {
      id: editingId && editingId !== 'new' ? editingId : newId(),
      name: form.name.trim(),
      role: form.role,
      department: form.department.trim(),
      mobile,
      joiningDate: form.joiningDate,
      salary: Math.round(salary),
      employmentType: form.employmentType,
      status: form.status,
      notes: form.notes.trim(),
    };
    const employees =
      editingId === 'new' ? [...data.employees, employee] : data.employees.map((e) => (e.id === employee.id ? employee : e));
    if (commit({ ...data, employees })) {
      setMessage(editingId === 'new' ? `${employee.name} added.` : `Changes to ${employee.name} saved.`);
      setEditingId(null);
    }
  };

  const remove = (e: Employee) => {
    const n = data.payments.filter((p) => p.employeeId === e.id).length;
    const extra = n
      ? ` Their ${n} payment record${n === 1 ? '' : 's'} will stay in the Payments list. If they have only stopped working here, set status to Left instead.`
      : '';
    if (!window.confirm(`Remove ${e.name} from staff?${extra}`)) return;
    if (commit({ ...data, employees: data.employees.filter((x) => x.id !== e.id) })) {
      setMessage(`${e.name} removed.`);
      if (editingId === e.id) setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-600 space-y-0.5">
          <p>
            Active staff: <span className="font-semibold text-[#1C2321]">{active.length}</span>
            {data.employees.length > active.length && <> of {data.employees.length} on the list</>}
          </p>
          <p>
            Monthly payroll (active and on leave): <span className="font-semibold text-[#1C2321]">{rupees(payroll)}</span>
          </p>
        </div>
        {editingId === null && (
          <button type="button" onClick={startAdd} className="btn-primary text-sm self-start">
            <Plus className="w-4 h-4" /> Add employee
          </button>
        )}
      </div>

      {message && (
        <p role="status" className="text-sm p-3 rounded-md bg-[#E8F3F1] text-[#0B5D57]">
          {message}
        </p>
      )}

      {editingId !== null && (
        <form onSubmit={save} noValidate className="bg-white border border-[#E7E3DA] rounded-lg">
          <div className="p-5 border-b border-[#E7E3DA]">
            <h2 className="text-xl">{editingId === 'new' ? 'Add employee' : `Edit ${form.name || 'employee'}`}</h2>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelClass}>Full name</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} autoComplete="off" />
              {errors.name && <span className={errorClass}>{errors.name}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Role</span>
              <select value={form.role} onChange={(e) => set('role', e.target.value as StaffRole)} className={inputClass}>
                {STAFF_ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Department</span>
              <input value={form.department} onChange={(e) => set('department', e.target.value)} className={inputClass} placeholder="e.g. ICU, OPD, Pharmacy" />
            </label>
            <label className="block">
              <span className={labelClass}>Mobile</span>
              <input
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value)}
                className={inputClass}
                inputMode="numeric"
                maxLength={14}
                placeholder="10 digits"
              />
              {errors.mobile && <span className={errorClass}>{errors.mobile}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Joining date</span>
              <input type="date" value={form.joiningDate} onChange={(e) => set('joiningDate', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Monthly salary (₹)</span>
              <input value={form.salary} onChange={(e) => set('salary', e.target.value)} className={inputClass} inputMode="numeric" />
              {errors.salary && <span className={errorClass}>{errors.salary}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Employment type</span>
              <select value={form.employmentType} onChange={(e) => set('employmentType', e.target.value as EmploymentType)} className={inputClass}>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select value={form.status} onChange={(e) => set('status', e.target.value as StaffStatus)} className={inputClass}>
                {STAFF_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Notes (optional)</span>
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} className={inputClass} />
            </label>
          </div>
          <div className="p-5 border-t border-[#E7E3DA] flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setEditingId(null)} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm">
              {editingId === 'new' ? 'Add employee' : 'Save changes'}
            </button>
          </div>
        </form>
      )}

      {data.employees.length === 0 ? (
        editingId === null && <EmptyCard>No staff added yet. Use Add employee to start the list.</EmptyCard>
      ) : (
        <section className="bg-white border border-[#E7E3DA] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#E7E3DA] grid sm:grid-cols-3 gap-3">
            <label className="relative block">
              <span className="sr-only">Search staff</span>
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, department, mobile"
                className={`${inputClass} pl-9`}
              />
            </label>
            <label className="block">
              <span className="sr-only">Filter by role</span>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'All' | StaffRole)} className={inputClass}>
                <option value="All">All roles</option>
                {STAFF_ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'All' | StaffStatus)} className={inputClass}>
                <option value="All">All statuses</option>
                {STAFF_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          {list.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-stone-500">No one matches this search.</p>
          ) : (
            <ul className="divide-y divide-[#E7E3DA]">
              {list.map((e) => (
                <li key={e.id} className="px-5 py-4 flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1C2321]">{e.name}</p>
                    <p className="text-sm text-stone-600">
                      {e.role}
                      {e.department && ` · ${e.department}`} · {e.employmentType}
                    </p>
                    <p className="text-sm text-stone-500">
                      {e.mobile && (
                        <a href={`tel:${e.mobile}`} className="text-[#0F766E] hover:underline underline-offset-4">
                          {e.mobile}
                        </a>
                      )}
                      {e.mobile && e.joiningDate && ' · '}
                      {e.joiningDate && `Joined ${dateLabel(e.joiningDate)}`}
                    </p>
                    {e.notes && <p className="text-sm text-stone-500 mt-1 break-words">{e.notes}</p>}
                  </div>
                  <div className="md:text-right shrink-0">
                    <p className="font-semibold text-[#1C2321]">{rupees(e.salary)} a month</p>
                    <p
                      className={`text-sm ${
                        e.status === 'Active' ? 'text-[#0F766E]' : e.status === 'On leave' ? 'text-amber-700' : 'text-stone-500'
                      }`}
                    >
                      {e.status}
                    </p>
                    <div className="flex gap-3 md:justify-end">
                      <button type="button" onClick={() => startEdit(e)} className={linkButton}>
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(e)} className={dangerLinkButton}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

// ---------- Payments ----------

interface PaymentForm {
  employeeId: string;
  date: string;
  month: string;
  amount: string;
  type: PaymentType;
  mode: PaymentMode;
  reference: string;
  note: string;
}

const blankPayment = (): PaymentForm => ({
  employeeId: '',
  date: todayIso(),
  month: thisMonth(),
  amount: '',
  type: 'Salary',
  mode: 'Cash',
  reference: '',
  note: '',
});

const PaymentsTab: React.FC<{ data: StaffData; commit: Commit; prefill: PaymentPrefill | null }> = ({ data, commit, prefill }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm>(blankPayment);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentForm, string>>>({});
  const [message, setMessage] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  useEffect(() => {
    if (!prefill) return;
    setForm({ ...blankPayment(), employeeId: prefill.employeeId, month: prefill.month, amount: String(prefill.amount), type: prefill.type });
    setErrors({});
    setMessage('');
    setOpen(true);
  }, [prefill]);

  const set = <K extends keyof PaymentForm>(k: K, v: PaymentForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const selectable = [...data.employees].sort((a, b) => a.name.localeCompare(b.name));

  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    const err: typeof errors = {};
    const amount = parseAmount(form.amount);
    const emp = data.employees.find((e) => e.id === form.employeeId);
    if (!emp) err.employeeId = 'Choose the employee.';
    if (!form.date) err.date = 'Enter the payment date.';
    if (!/^\d{4}-\d{2}$/.test(form.month)) err.month = 'Choose the month this payment is for.';
    if (!form.amount.trim() || Number.isNaN(amount) || amount <= 0) err.amount = 'Enter an amount above ₹0.';
    setErrors(err);
    if (Object.keys(err).length || !emp) return;

    const payment: StaffPayment = {
      id: newId(),
      employeeId: emp.id,
      employeeName: emp.name,
      date: form.date,
      month: form.month,
      amount: Math.round(amount),
      type: form.type,
      mode: form.mode,
      reference: form.reference.trim(),
      note: form.note.trim(),
    };
    if (commit({ ...data, payments: [...data.payments, payment] })) {
      setMessage(`${payment.type} of ${rupees(payment.amount)} for ${emp.name} (${monthLabel(payment.month)}) recorded.`);
      setForm(blankPayment());
      setOpen(false);
    }
  };

  const remove = (p: StaffPayment) => {
    if (!window.confirm(`Delete this ${p.type.toLowerCase()} of ${rupees(p.amount)} for ${nameOf(data, p.employeeId, p.employeeName)}?`)) return;
    if (commit({ ...data, payments: data.payments.filter((x) => x.id !== p.id) })) setMessage('Payment deleted.');
  };

  const filtered = useMemo(
    () =>
      data.payments
        .filter((p) => !monthFilter || p.month === monthFilter)
        .filter((p) => !employeeFilter || p.employeeId === employeeFilter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.payments, monthFilter, employeeFilter],
  );
  const paidOut = filtered.filter((p) => p.type !== 'Deduction').reduce((s, p) => s + p.amount, 0);
  const deducted = filtered.filter((p) => p.type === 'Deduction').reduce((s, p) => s + p.amount, 0);

  // Employees who appear in payments, including removed ones
  const employeeOptions = useMemo(() => {
    const m = new Map<string, string>();
    data.payments.forEach((p) => m.set(p.employeeId, nameOf(data, p.employeeId, p.employeeName)));
    return Array.from(m.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [data]);

  return (
    <div className="space-y-6">
      {data.employees.length === 0 ? (
        <EmptyCard>Add employees first; payments are recorded against an employee.</EmptyCard>
      ) : (
        !open && (
          <button type="button" onClick={() => { setForm(blankPayment()); setErrors({}); setMessage(''); setOpen(true); }} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Record payment
          </button>
        )
      )}

      {message && (
        <p role="status" className="text-sm p-3 rounded-md bg-[#E8F3F1] text-[#0B5D57]">
          {message}
        </p>
      )}

      {open && (
        <form onSubmit={save} noValidate className="bg-white border border-[#E7E3DA] rounded-lg">
          <div className="p-5 border-b border-[#E7E3DA]">
            <h2 className="text-xl">Record payment</h2>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className={labelClass}>Employee</span>
              <select value={form.employeeId} onChange={(e) => set('employeeId', e.target.value)} className={inputClass}>
                <option value="">Choose…</option>
                {selectable.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} · {e.role}
                    {e.status !== 'Active' ? ` (${e.status.toLowerCase()})` : ''}
                  </option>
                ))}
              </select>
              {errors.employeeId && <span className={errorClass}>{errors.employeeId}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Payment date</span>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass} />
              {errors.date && <span className={errorClass}>{errors.date}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>For month</span>
              <input type="month" value={form.month} onChange={(e) => set('month', e.target.value)} className={inputClass} />
              {errors.month && <span className={errorClass}>{errors.month}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Amount (₹)</span>
              <input value={form.amount} onChange={(e) => set('amount', e.target.value)} className={inputClass} inputMode="numeric" />
              {errors.amount && <span className={errorClass}>{errors.amount}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Type</span>
              <select value={form.type} onChange={(e) => set('type', e.target.value as PaymentType)} className={inputClass}>
                {PAYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {form.type === 'Deduction' && <span className="mt-1 block text-xs text-stone-500">A deduction lowers the salary owed for that month.</span>}
              {form.type === 'Advance' && <span className="mt-1 block text-xs text-stone-500">An advance counts as paid for the month it is for.</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Mode</span>
              <select value={form.mode} onChange={(e) => set('mode', e.target.value as PaymentMode)} className={inputClass}>
                {PAYMENT_MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Reference (optional)</span>
              <input value={form.reference} onChange={(e) => set('reference', e.target.value)} className={inputClass} placeholder="UPI ref, cheque no." />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Note (optional)</span>
              <input value={form.note} onChange={(e) => set('note', e.target.value)} className={inputClass} />
            </label>
          </div>
          <div className="p-5 border-t border-[#E7E3DA] flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm">
              Save payment
            </button>
          </div>
        </form>
      )}

      {data.payments.length === 0 ? (
        data.employees.length > 0 && <EmptyCard>No payments recorded yet.</EmptyCard>
      ) : (
        <section className="bg-white border border-[#E7E3DA] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#E7E3DA] grid sm:grid-cols-3 gap-3 items-end">
            <label className="block">
              <span className={labelClass}>Month</span>
              <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Employee</span>
              <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} className={inputClass}>
                <option value="">Everyone</option>
                {employeeOptions.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            {(monthFilter || employeeFilter) && (
              <button type="button" onClick={() => { setMonthFilter(''); setEmployeeFilter(''); }} className={`${linkButton} justify-self-start`}>
                Clear filters
              </button>
            )}
          </div>
          <div className="px-4 py-3 border-b border-[#E7E3DA] text-sm text-stone-600">
            {filtered.length} payment{filtered.length === 1 ? '' : 's'}
            {monthFilter && ` for ${monthLabel(monthFilter)}`} · Paid out{' '}
            <span className="font-semibold text-[#1C2321]">{rupees(paidOut)}</span>
            {deducted > 0 && (
              <>
                {' '}
                · Deductions <span className="font-semibold text-[#1C2321]">{rupees(deducted)}</span>
              </>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-stone-50/80 border-b border-[#E7E3DA] text-stone-500">
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Employee</th>
                  <th className={thClass}>For month</th>
                  <th className={thClass}>Type</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Mode</th>
                  <th className={thClass}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No payments match these filters.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className={`${tdClass} whitespace-nowrap`}>{dateLabel(p.date)}</td>
                    <td className={tdClass}>
                      <span className="block font-medium text-[#1C2321]">{nameOf(data, p.employeeId, p.employeeName)}</span>
                      {p.note && <span className="block text-xs text-stone-500">{p.note}</span>}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>{monthLabel(p.month)}</td>
                    <td className={tdClass}>{p.type}</td>
                    <td className={`${tdClass} text-right whitespace-nowrap font-semibold ${p.type === 'Deduction' ? 'text-stone-500' : 'text-[#1C2321]'}`}>
                      {p.type === 'Deduction' ? '−' : ''}
                      {rupees(p.amount)}
                    </td>
                    <td className={tdClass}>
                      <span className="block">{p.mode}</span>
                      {p.reference && <span className="block text-xs text-stone-500 break-all">{p.reference}</span>}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <button type="button" onClick={() => remove(p)} className={dangerLinkButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

// ---------- Dues ----------

const DuesTab: React.FC<{ data: StaffData; onRecord: (employeeId: string, month: string, amount: number) => void }> = ({ data, onRecord }) => {
  const [month, setMonth] = useState(thisMonth());
  const rows = useMemo(() => (month ? computeDues(data, month) : []), [data, month]);
  const total = rows.reduce(
    (t, r) => ({ owed: t.owed + r.owed, paid: t.paid + r.paid, balance: t.balance + r.balance }),
    { owed: 0, paid: 0, balance: 0 },
  );
  const unpaid = rows.filter((r) => r.balance > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <label className="block sm:w-60">
          <span className={labelClass}>Month</span>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputClass} />
        </label>
        {rows.length > 0 && (
          <p className="text-sm text-stone-600 sm:pb-3">
            {unpaid === 0 ? 'Everyone is paid for this month.' : `${unpaid} of ${rows.length} not fully paid · ${rupees(total.balance)} due`}
          </p>
        )}
      </div>

      <p className="text-sm text-stone-500">
        Salary, bonus and advance payments recorded for the month count as paid. A deduction lowers what is owed. Staff marked Left, or who joined after the month, are not listed.
      </p>

      {rows.length === 0 ? (
        <EmptyCard>{data.employees.length === 0 ? 'Add employees to see salary dues.' : 'No active staff for this month.'}</EmptyCard>
      ) : (
        <section className="bg-white border border-[#E7E3DA] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-stone-50/80 border-b border-[#E7E3DA] text-stone-500">
                  <th className={thClass}>Employee</th>
                  <th className={`${thClass} text-right`}>Salary</th>
                  <th className={`${thClass} text-right`}>Owed</th>
                  <th className={`${thClass} text-right`}>Paid</th>
                  <th className={`${thClass} text-right`}>Balance due</th>
                  <th className={thClass}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rows.map((r) => {
                  const due = r.balance > 0;
                  return (
                    <tr key={r.employee.id} className={due ? 'bg-amber-50/60' : ''}>
                      <td className={tdClass}>
                        <span className="block font-medium text-[#1C2321]">{r.employee.name}</span>
                        <span className="block text-xs text-stone-500">
                          {r.employee.role}
                          {r.employee.status !== 'Active' && ` · ${r.employee.status}`}
                        </span>
                      </td>
                      <td className={`${tdClass} text-right whitespace-nowrap`}>{rupees(r.salary)}</td>
                      <td className={`${tdClass} text-right whitespace-nowrap`}>
                        {rupees(r.owed)}
                        {r.deductions > 0 && <span className="block text-xs text-stone-500">after {rupees(r.deductions)} deducted</span>}
                      </td>
                      <td className={`${tdClass} text-right whitespace-nowrap`}>{rupees(r.paid)}</td>
                      <td className={`${tdClass} text-right whitespace-nowrap font-semibold ${due ? 'text-amber-800' : 'text-[#0F766E]'}`}>
                        {due ? rupees(r.balance) : r.overpaid > 0 ? `Paid (${rupees(r.overpaid)} extra)` : 'Paid'}
                      </td>
                      <td className={`${tdClass} text-right`}>
                        {due && (
                          <button type="button" onClick={() => onRecord(r.employee.id, month, r.balance)} className={`${linkButton} whitespace-nowrap`}>
                            Record payment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#E7E3DA] font-semibold text-[#1C2321]">
                  <td className={tdClass}>Total for {monthLabel(month)}</td>
                  <td className={`${tdClass} text-right whitespace-nowrap`}>{rupees(rows.reduce((s, r) => s + r.salary, 0))}</td>
                  <td className={`${tdClass} text-right whitespace-nowrap`}>{rupees(total.owed)}</td>
                  <td className={`${tdClass} text-right whitespace-nowrap`}>{rupees(total.paid)}</td>
                  <td className={`${tdClass} text-right whitespace-nowrap ${total.balance > 0 ? 'text-amber-800' : ''}`}>{rupees(total.balance)}</td>
                  <td className={tdClass} />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

// ---------- Reminders ----------

interface ReminderForm {
  title: string;
  employeeId: string;
  dueDate: string;
  repeat: Repeat;
  note: string;
}

const blankReminder = (): ReminderForm => ({ title: '', employeeId: '', dueDate: todayIso(), repeat: 'None', note: '' });

const RemindersTab: React.FC<{ data: StaffData; commit: Commit; today: string }> = ({ data, commit, today }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReminderForm>(blankReminder);
  const [errors, setErrors] = useState<Partial<Record<keyof ReminderForm, string>>>({});
  const [message, setMessage] = useState('');
  const [showDone, setShowDone] = useState(false);

  const set = <K extends keyof ReminderForm>(k: K, v: ReminderForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    const err: typeof errors = {};
    if (!form.title.trim()) err.title = 'Enter what the reminder is for.';
    if (!form.dueDate) err.dueDate = 'Choose the due date.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const emp = data.employees.find((e) => e.id === form.employeeId);
    const reminder: StaffReminder = {
      id: newId(),
      title: form.title.trim(),
      employeeId: emp ? emp.id : '',
      employeeName: emp ? emp.name : '',
      dueDate: form.dueDate,
      repeat: form.repeat,
      note: form.note.trim(),
      done: false,
      doneOn: '',
    };
    if (commit({ ...data, reminders: [...data.reminders, reminder] })) {
      setMessage(`Reminder added for ${dateLabel(reminder.dueDate)}.`);
      setForm(blankReminder());
      setOpen(false);
    }
  };

  const markDone = (r: StaffReminder) => {
    const next: StaffReminder =
      r.repeat === 'Monthly' ? { ...r, dueDate: addOneMonth(r.dueDate), doneOn: today } : { ...r, done: true, doneOn: today };
    if (commit({ ...data, reminders: data.reminders.map((x) => (x.id === r.id ? next : x)) })) {
      setMessage(r.repeat === 'Monthly' ? `Done. Next due ${dateLabel(next.dueDate)}.` : 'Marked as done.');
    }
  };

  const undo = (r: StaffReminder) => {
    if (commit({ ...data, reminders: data.reminders.map((x) => (x.id === r.id ? { ...x, done: false, doneOn: '' } : x)) })) {
      setMessage('Reminder is open again.');
    }
  };

  const remove = (r: StaffReminder) => {
    if (!window.confirm(`Delete the reminder "${r.title}"?`)) return;
    if (commit({ ...data, reminders: data.reminders.filter((x) => x.id !== r.id) })) setMessage('Reminder deleted.');
  };

  const pending = data.reminders.filter((r) => !r.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const done = data.reminders.filter((r) => r.done).sort((a, b) => b.doneOn.localeCompare(a.doneOn));

  return (
    <div className="space-y-6">
      {!open && (
        <button type="button" onClick={() => { setForm(blankReminder()); setErrors({}); setMessage(''); setOpen(true); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add reminder
        </button>
      )}

      {message && (
        <p role="status" className="text-sm p-3 rounded-md bg-[#E8F3F1] text-[#0B5D57]">
          {message}
        </p>
      )}

      {open && (
        <form onSubmit={save} noValidate className="bg-white border border-[#E7E3DA] rounded-lg">
          <div className="p-5 border-b border-[#E7E3DA]">
            <h2 className="text-xl">Add reminder</h2>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className={labelClass}>Title</span>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="e.g. Pay salaries, renew nursing registration" />
              {errors.title && <span className={errorClass}>{errors.title}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Employee (optional)</span>
              <select value={form.employeeId} onChange={(e) => set('employeeId', e.target.value)} className={inputClass}>
                <option value="">Not linked</option>
                {[...data.employees]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Due date</span>
              <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className={inputClass} />
              {errors.dueDate && <span className={errorClass}>{errors.dueDate}</span>}
            </label>
            <label className="block">
              <span className={labelClass}>Repeat</span>
              <select value={form.repeat} onChange={(e) => set('repeat', e.target.value as Repeat)} className={inputClass}>
                {REPEAT_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === 'None' ? 'Does not repeat' : 'Every month'}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Note (optional)</span>
              <input value={form.note} onChange={(e) => set('note', e.target.value)} className={inputClass} />
            </label>
          </div>
          <div className="p-5 border-t border-[#E7E3DA] flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm">
              Save reminder
            </button>
          </div>
        </form>
      )}

      {data.reminders.length === 0 ? (
        !open && <EmptyCard>No reminders yet. Add one for salary day, contract renewals or document checks.</EmptyCard>
      ) : (
        <section className="bg-white border border-[#E7E3DA] rounded-lg">
          <div className="px-5 py-4 border-b border-[#E7E3DA]">
            <h2 className="text-lg">Open reminders</h2>
          </div>
          {pending.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-stone-500">Nothing pending.</p>
          ) : (
            <ul className="divide-y divide-[#E7E3DA]">
              {pending.map((r) => (
                <li key={r.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1C2321] break-words">{r.title}</p>
                    <p className="text-sm text-stone-500">
                      {[r.employeeId && nameOf(data, r.employeeId, r.employeeName), r.repeat === 'Monthly' && 'Every month', r.note]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-sm">
                      <DueText date={r.dueDate} today={today} />
                    </p>
                    <div className="flex gap-3 sm:justify-end">
                      <button type="button" onClick={() => markDone(r)} className={linkButton}>
                        Mark done
                      </button>
                      <button type="button" onClick={() => remove(r)} className={dangerLinkButton}>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {done.length > 0 && (
            <div className="px-5 py-3 border-t border-[#E7E3DA]">
              <button type="button" onClick={() => setShowDone((v) => !v)} aria-expanded={showDone} className={linkButton}>
                {showDone ? 'Hide' : 'Show'} done ({done.length})
              </button>
              {showDone && (
                <ul className="mt-1 divide-y divide-[#E7E3DA]">
                  {done.map((r) => (
                    <li key={r.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                      <span className="text-stone-500 min-w-0 break-words">
                        {r.title}
                        {r.doneOn && ` · done ${dateLabel(r.doneOn)}`}
                      </span>
                      <span className="flex gap-3 shrink-0">
                        <button type="button" onClick={() => undo(r)} className={linkButton}>
                          Reopen
                        </button>
                        <button type="button" onClick={() => remove(r)} className={dangerLinkButton}>
                          Delete
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

/** Turn on desktop alerts for due reminders (this browser only). */
const AlertsSetting: React.FC = () => {
  const [perm, setPerm] = useState(alertsPermission());
  if (perm === 'unsupported') return null;
  return (
    <div className="bg-white border border-[#E7E3DA] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[15px]">
      <div className="flex gap-3">
        <Bell className="w-5 h-5 mt-0.5 shrink-0 text-[#0F766E]" />
        <div>
          <p className="font-semibold">
            Reminder alerts: {perm === 'granted' ? 'on' : perm === 'denied' ? 'blocked' : 'off'}
          </p>
          <p className="text-sm text-stone-600">
            {perm === 'denied'
              ? 'Alerts are blocked for this site. Allow notifications in the browser’s site settings to turn them on.'
              : 'Salary days and other reminders pop up on this computer when they are due, while the admin panel is open in a tab.'}
          </p>
        </div>
      </div>
      {perm === 'default' && (
        <button type="button" className="btn-secondary shrink-0" onClick={async () => setPerm(await enableAlerts())}>
          Turn on alerts
        </button>
      )}
    </div>
  );
};
