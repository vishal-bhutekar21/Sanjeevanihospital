import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';
import { toDateKey } from './DateCalendar';
import { HOSPITAL } from '../config/hospital';

interface Session {
  start: string;
  end: string;
}

const DAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_MR = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

const fmt = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, '0')} ${p}` : `${hh} ${p}`;
};

/** Next calendar date (from today) that falls on the given weekday. */
const nextDateFor = (weekday: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7));
  return d;
};

/**
 * Weekly OPD timetable for one doctor, from the timings staff set in the admin.
 * Each working day links straight to booking on the next such date.
 * Falls back to the published text if the server can't be reached.
 */
export const OpdWeek: React.FC<{ doctorId: string; fallback: string; isMr: boolean }> = ({ doctorId, fallback, isMr }) => {
  const [days, setDays] = useState<Session[][] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setDays(null);
    setFailed(false);
    fetch(apiUrl(`/appointments/schedules/${encodeURIComponent(doctorId)}`))
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setDays(j?.data?.schedule?.days || null))
      .catch(() => setFailed(true));
  }, [doctorId]);

  if (failed || (days && days.every((d) => d.length === 0))) {
    return (
      <div className="text-[15px] text-stone-700">
        <p>{fallback}</p>
        {!/reception|रिसेप्शन/i.test(fallback) && (
        <p className="mt-2 text-sm text-stone-600">
          {isMr ? 'वेळ ठरवण्यासाठी रिसेप्शनला कॉल करा: ' : 'Call reception to fix a time: '}
          <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] underline underline-offset-4">
            {HOSPITAL.phones.reception.short}
          </a>
        </p>
        )}
      </div>
    );
  }

  if (!days) {
    return <div className="h-48 rounded-md bg-stone-100 animate-pulse" aria-busy="true" />;
  }

  return (
    <table className="w-full text-[15px]">
      <caption className="sr-only">{isMr ? 'साप्ताहिक ओपीडी वेळ' : 'Weekly OPD timings'}</caption>
      <tbody className="divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
        {ORDER.map((d) => {
          const sessions = days[d] || [];
          const isToday = new Date().getDay() === d;
          return (
            <tr key={d} className={isToday ? 'bg-[#F4FAF9]' : ''}>
              <th scope="row" className="py-3 pr-3 text-left font-normal text-stone-600 whitespace-nowrap align-top">
                {(isMr ? DAY_MR : DAY_EN)[d]}
                {isToday && <span className="block text-xs text-[#0F766E]">{isMr ? 'आज' : 'Today'}</span>}
              </th>
              <td className="py-3 text-[#1C2321] align-top">
                {sessions.length === 0 ? (
                  <span className="text-stone-400">{isMr ? 'ओपीडी नाही' : 'No OPD'}</span>
                ) : (
                  sessions.map((s) => `${fmt(s.start)} – ${fmt(s.end)}`).join(', ')
                )}
              </td>
              <td className="py-3 pl-3 text-right align-top">
                {sessions.length > 0 && (
                  <Link
                    to={`/book?doctorId=${encodeURIComponent(doctorId)}&date=${toDateKey(nextDateFor(d))}`}
                    className="inline-block py-3 -my-3 text-sm font-semibold text-[#0F766E] hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    {isMr ? 'बुक करा' : 'Book'}
                  </Link>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
