import React, { useEffect, useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Session {
  start: string;
  end: string;
}
interface WeeklySchedule {
  slotMinutes: number;
  days: Session[][]; // 0 = Sunday ... 6 = Saturday
}
interface DoctorSchedule {
  doctorId: string;
  name: string;
  department: string;
  savedInDatabase: boolean;
  schedule: WeeklySchedule;
}

// Show Monday first, Sunday last
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_OPTIONS = [10, 15, 20, 30, 45, 60];

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, '0')} ${p}` : `${hh} ${p}`;
};

const countSlots = (s: WeeklySchedule) =>
  s.days.reduce(
    (sum, sessions) =>
      sum + sessions.reduce((n, x) => n + Math.max(0, Math.floor((toMin(x.end) - toMin(x.start)) / s.slotMinutes)), 0),
    0,
  );

const summary = (s: WeeklySchedule) => {
  const active = DAY_ORDER.filter((d) => s.days[d].length > 0);
  if (active.length === 0) return 'No online OPD. Patients are asked to call.';
  const same = active.every((d) => JSON.stringify(s.days[d]) === JSON.stringify(s.days[active[0]]));
  const hours = (d: number) => s.days[d].map((x) => `${fmt(x.start)}–${fmt(x.end)}`).join(', ');
  if (same) {
    const names = active.map((d) => DAY_NAMES[d].slice(0, 3));
    const range = active.length > 2 && active.join() === DAY_ORDER.slice(0, active.length).join() ? `${names[0]}–${names[names.length - 1]}` : names.join(', ');
    return `${range}: ${hours(active[0])}`;
  }
  return `${active.length} days a week, hours vary`;
};

const inputClass =
  'px-2.5 py-2 bg-white border border-[#D8D3C8] rounded-md text-sm focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

export const AdminSchedulesPage: React.FC = () => {
  const [all, setAll] = useState<DoctorSchedule[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState<WeeklySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'warn' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoadError('');
    try {
      const res = await apiFetch<DoctorSchedule[]>('/appointments/schedules');
      const list = Array.isArray(res.data) ? res.data : [];
      setAll(list);
      if (list.length && !selectedId) {
        setSelectedId(list[0].doctorId);
        setDraft(JSON.parse(JSON.stringify(list[0].schedule)));
      }
    } catch (e: any) {
      setLoadError(e?.message || 'Could not load OPD timings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = all.find((d) => d.doctorId === selectedId);
  const dirty = useMemo(() => !!selected && !!draft && JSON.stringify(selected.schedule) !== JSON.stringify(draft), [selected, draft]);

  const pick = (id: string) => {
    if (dirty && !window.confirm('You have unsaved changes. Discard them?')) return;
    const doc = all.find((d) => d.doctorId === id);
    setSelectedId(id);
    setDraft(doc ? JSON.parse(JSON.stringify(doc.schedule)) : null);
    setMessage(null);
  };

  const update = (fn: (s: WeeklySchedule) => void) => {
    if (!draft) return;
    const next: WeeklySchedule = JSON.parse(JSON.stringify(draft));
    fn(next);
    setDraft(next);
    setMessage(null);
  };

  const copyMondayToWeekdays = () =>
    update((s) => {
      [2, 3, 4, 5, 6].forEach((d) => (s.days[d] = JSON.parse(JSON.stringify(s.days[1]))));
    });

  const save = async () => {
    if (!draft || !selected) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiFetch<{ savedInDatabase: boolean; schedule: WeeklySchedule }>(
        `/appointments/schedules/${selected.doctorId}`,
        { method: 'PUT', body: JSON.stringify(draft) },
      );
      setAll((list) =>
        list.map((d) => (d.doctorId === selected.doctorId ? { ...d, schedule: res.data.schedule } : d)),
      );
      setDraft(JSON.parse(JSON.stringify(res.data.schedule)));
      setMessage(
        res.data.savedInDatabase
          ? { kind: 'ok', text: `Saved. Patients now see ${selected.name}’s new timings when booking.` }
          : {
              kind: 'warn',
              text: `Saved for now, but ${selected.name} isn’t in the doctors database yet, so these timings will reset if the server restarts. Add the doctor under Doctors to keep them.`,
            },
      );
    } catch (e: any) {
      setMessage({ kind: 'error', text: e?.message || 'Could not save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">OPD timings</h1>
        <p className="mt-1 text-stone-600">
          Set the days and hours each doctor sees patients. The booking page offers appointments only inside these hours.
        </p>
      </div>

      {loadError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between gap-3">
          <span>{loadError}</span>
          <button type="button" className="font-semibold underline" onClick={load}>
            Try again
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Doctor list */}
        <nav className="lg:col-span-4 bg-white border border-[#E7E3DA] rounded-lg overflow-hidden" aria-label="Doctors">
          {loading && <p className="p-5 text-sm text-stone-500">Loading…</p>}
          <ul className="divide-y divide-[#E7E3DA] max-h-[70vh] overflow-y-auto">
            {all.map((d) => (
              <li key={d.doctorId}>
                <button
                  type="button"
                  onClick={() => pick(d.doctorId)}
                  aria-current={d.doctorId === selectedId ? 'true' : undefined}
                  className={`w-full text-left px-4 py-3 ${d.doctorId === selectedId ? 'bg-[#E8F3F1]' : 'hover:bg-stone-50'}`}
                >
                  <span className="block font-medium text-[#1C2321]">{d.name}</span>
                  <span className="block text-xs text-stone-500 mt-0.5">{summary(d.schedule)}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Editor */}
        {selected && draft && (
          <section className="lg:col-span-8 bg-white border border-[#E7E3DA] rounded-lg">
            <div className="p-5 border-b border-[#E7E3DA] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-xl">{selected.name}</h2>
                <p className="text-sm text-stone-500">{selected.department}</p>
              </div>
              <label className="text-sm">
                <span className="block text-stone-600 mb-1">Time per appointment</span>
                <select
                  value={draft.slotMinutes}
                  onChange={(e) => update((s) => (s.slotMinutes = Number(e.target.value)))}
                  className={inputClass}
                >
                  {SLOT_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} minutes
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ul className="divide-y divide-[#E7E3DA]">
              {DAY_ORDER.map((day) => {
                const sessions = draft.days[day];
                const on = sessions.length > 0;
                return (
                  <li key={day} className="px-5 py-4 flex flex-col sm:flex-row gap-3 sm:items-start">
                    <label className="flex items-center gap-2.5 w-40 shrink-0 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) =>
                          update((s) => {
                            s.days[day] = e.target.checked ? [{ start: '10:00', end: '14:00' }] : [];
                          })
                        }
                        className="w-4 h-4 accent-[#0F766E]"
                      />
                      <span className={`font-medium ${on ? 'text-[#1C2321]' : 'text-stone-400'}`}>{DAY_NAMES[day]}</span>
                    </label>

                    <div className="flex-1 space-y-2">
                      {!on && <p className="pt-2 text-sm text-stone-400">No OPD</p>}
                      {sessions.map((sess, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2">
                          <input
                            type="time"
                            value={sess.start}
                            step={300}
                            aria-label={`${DAY_NAMES[day]} session ${i + 1} start`}
                            onChange={(e) => update((s) => (s.days[day][i].start = e.target.value))}
                            className={inputClass}
                          />
                          <span className="text-stone-500">to</span>
                          <input
                            type="time"
                            value={sess.end}
                            step={300}
                            aria-label={`${DAY_NAMES[day]} session ${i + 1} end`}
                            onChange={(e) => update((s) => (s.days[day][i].end = e.target.value))}
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => update((s) => s.days[day].splice(i, 1))}
                            className="p-2 rounded-md text-stone-500 hover:bg-stone-100 hover:text-[#1C2321]"
                            aria-label={`Remove ${DAY_NAMES[day]} session ${i + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {on && sessions.length < 3 && (
                        <button
                          type="button"
                          onClick={() =>
                            update((s) => {
                              const last = s.days[day][s.days[day].length - 1];
                              const startH = Math.min(22, Math.floor(toMin(last.end) / 60) + 2);
                              s.days[day].push({
                                start: `${String(startH).padStart(2, '0')}:00`,
                                end: `${String(Math.min(23, startH + 3)).padStart(2, '0')}:00`,
                              });
                            })
                          }
                          className="inline-flex items-center gap-1 text-sm text-[#0F766E] font-medium hover:underline underline-offset-4"
                        >
                          <Plus className="w-4 h-4" /> Add evening session
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="p-5 border-t border-[#E7E3DA] space-y-3">
              {message && (
                <p
                  role="status"
                  className={`text-sm p-3 rounded-md ${
                    message.kind === 'ok'
                      ? 'bg-[#E8F3F1] text-[#0B5D57]'
                      : message.kind === 'warn'
                      ? 'bg-amber-50 text-amber-900'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {message.text}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-stone-500">
                  {countSlots(draft)} appointments a week · {summary(draft)}
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={copyMondayToWeekdays} className="btn-secondary text-sm" disabled={draft.days[1].length === 0}>
                    Copy Monday to Tue–Sat
                  </button>
                  <button type="button" onClick={save} disabled={!dirty || saving} className="btn-primary text-sm disabled:opacity-50">
                    {saving ? 'Saving…' : dirty ? 'Save timings' : 'Saved'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
