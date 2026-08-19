import React, { useState } from 'react';
import { Clock, Calendar, Save, CheckCircle2, User, ChevronRight } from 'lucide-react';

export const AdminSchedulesPage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('doc-goyal');
  const [slotDuration, setSlotDuration] = useState(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [schedules, setSchedules] = useState([
    { day: 'Monday', active: true, start: '11:00', end: '16:00', breakStart: '13:00', breakEnd: '13:30' },
    { day: 'Tuesday', active: true, start: '11:00', end: '16:00', breakStart: '13:00', breakEnd: '13:30' },
    { day: 'Wednesday', active: true, start: '11:00', end: '16:00', breakStart: '13:00', breakEnd: '13:30' },
    { day: 'Thursday', active: true, start: '11:00', end: '16:00', breakStart: '13:00', breakEnd: '13:30' },
    { day: 'Friday', active: true, start: '11:00', end: '16:00', breakStart: '13:00', breakEnd: '13:30' },
    { day: 'Saturday', active: true, start: '11:00', end: '16:00', breakStart: '13:00', breakEnd: '13:30' },
    { day: 'Sunday', active: false, start: '10:00', end: '12:00', breakStart: '', breakEnd: '' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Doctor Shift & Slot Generation Rules
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define daily shift hours, slot durations, and break windows. The backend automatically generates bookable slots.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Shift rules saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Doctor Selector & Global Shift Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Select Specialist
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              >
                <option value="doc-goyal">Dr. Nishant Goyal (Orthopedics)</option>
                <option value="doc-mirkad">Dr. Shivdas Mirkad (Pediatrics)</option>
                <option value="doc-bagal">Dr. Baliram Bagal (ICU / Critical Care)</option>
                <option value="doc-rajguru">Dr. Kailash Rajguru (Medicine)</option>
                <option value="doc-anshul">Dr. Anshul Goyal (Obstetrics & Gyn)</option>
                <option value="doc-katole">Dr. Millind Katole (General Surgery)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Slot Duration
              </label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              >
                <option value={15}>15 Minutes per Slot</option>
                <option value={20}>20 Minutes per Slot</option>
                <option value={30}>30 Minutes per Slot (Standard)</option>
                <option value={45}>45 Minutes per Slot</option>
              </select>
            </div>

            <div className="p-3.5 bg-hospital-soft/80 rounded-xl border border-hospital-teal/20 text-xs text-hospital-teal space-y-1">
              <p className="font-bold">Dynamic Slot Engine:</p>
              <p className="text-[11px] leading-relaxed">
                Slots are dynamically partitioned according to shift hours minus break periods. Concurrency locks prevent simultaneous bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Day-by-Day Shift Planner */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Weekly Shift Timetable</h3>
            <span className="text-xs text-slate-500 font-medium">Auto-synced with online booking</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-3">
              {schedules.map((item, idx) => (
                <div
                  key={item.day}
                  className={`p-3 rounded-xl border transition flex flex-wrap items-center justify-between gap-3 ${
                    item.active ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 w-32">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].active = e.target.checked;
                        setSchedules(updated);
                      }}
                      className="w-4 h-4 text-hospital-teal rounded focus:ring-hospital-teal"
                    />
                    <span className="text-xs font-bold text-slate-900">{item.day}</span>
                  </div>

                  {item.active ? (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-500 font-medium">Shift:</span>
                        <input
                          type="time"
                          value={item.start}
                          onChange={(e) => {
                            const updated = [...schedules];
                            updated[idx].start = e.target.value;
                            setSchedules(updated);
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={item.end}
                          onChange={(e) => {
                            const updated = [...schedules];
                            updated[idx].end = e.target.value;
                            setSchedules(updated);
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-500 font-medium">Break:</span>
                        <input
                          type="time"
                          value={item.breakStart}
                          onChange={(e) => {
                            const updated = [...schedules];
                            updated[idx].breakStart = e.target.value;
                            setSchedules(updated);
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                          type="time"
                          value={item.breakEnd}
                          onChange={(e) => {
                            const updated = [...schedules];
                            updated[idx].breakEnd = e.target.value;
                            setSchedules(updated);
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Doctor Off Duty / On Call</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-hospital-teal text-white text-xs font-bold rounded-xl shadow-sm hover:bg-hospital-teal/90 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save & Generate Active Slots</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
