import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Local date as YYYY-MM-DD (not UTC). */
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fromDateKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (key: string) => void;
  minDate: string;
  maxDate: string;
  /** Extra rule, e.g. the doctor has no OPD that weekday */
  isUnavailable?: (date: Date) => boolean;
  isMr?: boolean;
  /** Line under the calendar; pass null to hide */
  note?: string | null;
}

const WEEK_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_MR = ['सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];

/**
 * Month calendar for picking an appointment date.
 * Weeks start on Monday. Days outside the range or without OPD are disabled.
 */
export const DateCalendar: React.FC<Props> = ({ value, onChange, minDate, maxDate, isUnavailable, isMr, note }) => {
  const min = fromDateKey(minDate);
  const max = fromDateKey(maxDate);
  const selected = fromDateKey(value);
  const [view, setView] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));

  // Keep the visible month in step when the selected date jumps to another month
  React.useEffect(() => {
    if (selected.getMonth() !== view.getMonth() || selected.getFullYear() !== view.getFullYear()) {
      setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7; // Monday-first offset
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(view.getFullYear(), view.getMonth(), d));
    while (out.length % 7) out.push(null);
    return out;
  }, [view]);

  const canPrev = new Date(view.getFullYear(), view.getMonth(), 0) >= new Date(min.getFullYear(), min.getMonth(), 1);
  const canNext = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= max;
  const todayKey = toDateKey(new Date());
  const monthLabel = view.toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white border border-[#E7E3DA] rounded-lg p-4 sm:p-5 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          disabled={!canPrev}
          className="p-2 rounded-md hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label={isMr ? 'मागील महिना' : 'Previous month'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="font-heading text-lg" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          disabled={!canNext}
          className="p-2 rounded-md hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label={isMr ? 'पुढील महिना' : 'Next month'}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-stone-500 mb-1">
        {(isMr ? WEEK_MR : WEEK_EN).map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid">
        {cells.map((d, i) => {
          if (!d) return <span key={`x${i}`} />;
          const key = toDateKey(d);
          const disabled = d < min || d > max || !!isUnavailable?.(d);
          const isSel = key === value;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={isSel}
              aria-label={d.toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              onClick={() => onChange(key)}
              className={`h-11 rounded-md text-[15px] transition-colors ${
                isSel
                  ? 'bg-[#0F766E] text-white font-semibold'
                  : disabled
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'text-[#1C2321] hover:bg-[#E8F3F1]'
              } ${isToday && !isSel ? 'ring-1 ring-inset ring-[#0F766E]' : ''}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {note !== null && (
        <p className="mt-3 text-xs text-stone-500">
          {note ??
            (isMr ? 'फिकट तारखांना OPD नाही. पुढील २ महिन्यांपर्यंत बुकिंग करता येते.' : 'Faded dates have no OPD. You can book up to 2 months ahead.')}
        </p>
      )}
    </div>
  );
};
