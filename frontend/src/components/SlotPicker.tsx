import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'HELD' | 'CONFIRMED';
}

interface Availability {
  bookable: boolean;
  dayOff?: boolean;
  totalSlots: number;
  availableSlots: number;
  slots: Slot[];
}

interface Props {
  doctorId: string;
  date: string; // YYYY-MM-DD
  value: string; // slot start time, "09:30 AM"
  onChange: (startTime: string) => void;
}

/** The times the booking engine offers for one doctor on one day. */
export const SlotPicker: React.FC<Props> = ({ doctorId, date, value, onChange }) => {
  const [data, setData] = useState<Availability | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || !date) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    apiFetch<Availability>(`/appointments/availability?doctorId=${encodeURIComponent(doctorId)}&date=${date}`)
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || 'Could not load the available times.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, date]);

  if (loading && !data) return <p className="text-sm text-stone-500">Loading times…</p>;
  if (error) return <p role="alert" className="text-sm text-red-700">{error}</p>;
  if (!data) return null;
  if (!data.bookable) return <p className="text-sm text-stone-600">Booking is not set up for this doctor. Add OPD timings first.</p>;
  if (data.dayOff) return <p className="text-sm text-stone-600">The doctor has no OPD on this day. Pick another date.</p>;
  if (data.slots.length === 0) return <p className="text-sm text-stone-600">No times left on this day. Pick another date.</p>;

  return (
    <div>
      <p className="text-sm text-stone-600 mb-2">
        {data.availableSlots} of {data.totalSlots} times free
      </p>
      <div role="radiogroup" aria-label="Appointment time" className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {data.slots.map((s) => {
          const free = s.status === 'AVAILABLE';
          const selected = value === s.startTime;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!free}
              title={free ? undefined : s.status === 'HELD' ? 'Held by an online booking' : 'Already booked'}
              onClick={() => onChange(s.startTime)}
              className={`min-h-[44px] px-2 rounded-md border text-sm ${
                selected
                  ? 'bg-[#0F766E] border-[#0F766E] text-white font-semibold'
                  : free
                  ? 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'
                  : 'bg-stone-100 border-stone-200 text-stone-400 line-through cursor-not-allowed'
              }`}
            >
              {s.startTime}
            </button>
          );
        })}
      </div>
    </div>
  );
};
