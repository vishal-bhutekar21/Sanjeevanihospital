import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { HOSPITAL } from '../../config/hospital';

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

interface Review {
  id: string;
  patientName: string;
  patientLocation?: string;
  rating: number;
  reviewText: string;
  doctorName?: string;
  department?: string;
  treatmentType?: string;
  status: ReviewStatus;
  moderationNote?: string;
  isVerifiedPatient: boolean;
  helpfulCount: number;
  source: 'DIRECT' | 'GOOGLE' | 'PRACTO' | 'JUSTDIAL';
  createdAt: string;
  updatedAt: string;
}

interface HospitalEvent {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  category: string;
  organizer: string;
  featuredDoctor?: string;
  registrationRequired: boolean;
  registrationPhone?: string;
  isFree: boolean;
  status: EventStatus;
  attendeesCount: number;
}

interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingModeration: number;
  rejectedReviews: number;
  averageRating: number;
}

const REVIEW_LABEL: Record<ReviewStatus, string> = { PENDING: 'Waiting', APPROVED: 'Published', REJECTED: 'Rejected' };
const REVIEW_DOT: Record<ReviewStatus, string> = { PENDING: 'bg-amber-500', APPROVED: 'bg-[#0F766E]', REJECTED: 'bg-red-400' };

const EVENT_LABEL: Record<EventStatus, string> = { UPCOMING: 'Upcoming', ONGOING: 'On now', COMPLETED: 'Held', CANCELLED: 'Cancelled' };
const EVENT_DOT: Record<EventStatus, string> = { UPCOMING: 'bg-[#0F766E]', ONGOING: 'bg-amber-500', COMPLETED: 'bg-stone-400', CANCELLED: 'bg-red-400' };

const CATEGORY_LABEL: Record<string, string> = {
  HEALTH_CAMP: 'Health camp',
  AWARENESS_SEMINAR: 'Awareness talk',
  FREE_CHECKUP: 'Free check-up',
  VACCINATION_DRIVE: 'Vaccination drive',
  DIAGNOSTIC_CAMP: 'Diagnostic camp',
  CME: 'CME for doctors',
};

const SOURCE_LABEL: Record<string, string> = { DIRECT: 'Website', GOOGLE: 'Google', PRACTO: 'Practo', JUSTDIAL: 'Justdial' };

const inputClass =
  'w-full px-3 py-2.5 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

const emptyEvent = {
  title: '', titleMr: '', description: '', descriptionMr: '',
  eventDate: '', eventTime: '', venue: '',
  category: 'HEALTH_CAMP', organizer: HOSPITAL.shortName, featuredDoctor: '',
  registrationRequired: false, registrationPhone: HOSPITAL.phones.reception.display,
  isFree: true,
};

const shortDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Dot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="inline-flex items-center gap-1.5 text-sm text-stone-700 shrink-0">
    <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
    {label}
  </span>
);

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
    ))}
  </span>
);

type Msg = { kind: 'ok' | 'error'; text: string } | null;

const Message: React.FC<{ msg: Msg; onClose: () => void }> = ({ msg, onClose }) =>
  msg ? (
    <p
      role={msg.kind === 'error' ? 'alert' : 'status'}
      className={`text-sm p-3 rounded-md flex justify-between gap-3 ${msg.kind === 'ok' ? 'bg-[#E8F3F1] text-[#0B5D57]' : 'bg-red-50 text-red-800'}`}
    >
      <span>{msg.text}</span>
      <button type="button" className="shrink-0 underline" onClick={onClose}>
        Dismiss
      </button>
    </p>
  ) : null;

const ReviewBody: React.FC<{ rev: Review }> = ({ rev }) => (
  <>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium text-[#1C2321]">
          {rev.patientName}
          {rev.patientLocation && <span className="text-stone-500 font-normal"> · {rev.patientLocation}</span>}
        </p>
        <p className="text-sm text-stone-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <Stars rating={rev.rating} />
          <span>{rev.rating} of 5</span>
          <span>· {SOURCE_LABEL[rev.source] || 'Website'}</span>
          <span>· {shortDate(rev.createdAt)}</span>
          {rev.isVerifiedPatient && <span>· Verified patient</span>}
        </p>
      </div>
    </div>
    <p className="mt-2 text-[15px] text-stone-700 leading-relaxed">“{rev.reviewText}”</p>
    {(rev.doctorName || rev.treatmentType) && (
      <p className="mt-1.5 text-sm text-stone-500">
        {[rev.doctorName, rev.treatmentType].filter(Boolean).join(' · ')}
      </p>
    )}
  </>
);

export const AdminReviewsEventsPage: React.FC = () => {
  const [tab, setTab] = useState<'reviews' | 'events'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<HospitalEvent[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [msg, setMsg] = useState<Msg>(null);

  const [historyFilter, setHistoryFilter] = useState<'' | 'APPROVED' | 'REJECTED'>('');
  const [moderating, setModerating] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState(emptyEvent);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [updatingEvent, setUpdatingEvent] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [revRes, evtRes, statsRes] = await Promise.all([
        apiFetch<Review[]>('/reviews-events/admin/reviews'),
        apiFetch<HospitalEvent[]>('/reviews-events/events/all'),
        apiFetch<ReviewStats>('/reviews-events/reviews/stats'),
      ]);
      setReviews(Array.isArray(revRes.data) ? revRes.data : []);
      setEvents(Array.isArray(evtRes.data) ? evtRes.data : []);
      setReviewStats(statsRes.data || null);
    } catch (e: any) {
      setLoadError(e?.message || 'Could not load reviews and camps.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pending = useMemo(
    () => reviews.filter((r) => r.status === 'PENDING').sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [reviews],
  );
  const history = useMemo(
    () =>
      reviews
        .filter((r) => r.status !== 'PENDING' && (!historyFilter || r.status === historyFilter))
        .sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt)),
    [reviews, historyFilter],
  );

  const handleModerate = async (rev: Review, status: 'APPROVED' | 'REJECTED', note?: string) => {
    setModerating(rev.id);
    setMsg(null);
    try {
      await apiFetch(`/reviews-events/admin/reviews/${rev.id}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ status, moderationNote: note }),
      });
      setMsg({
        kind: 'ok',
        text: status === 'APPROVED' ? `${rev.patientName}’s review is now published on the website.` : `${rev.patientName}’s review was rejected. It will not be shown.`,
      });
      setRejectingId(null);
      setRejectNote('');
      await fetchData();
    } catch (e: any) {
      setMsg({ kind: 'error', text: e?.message || 'Could not save. Please try again.' });
    } finally {
      setModerating(null);
    }
  };

  const handleUpdateEventStatus = async (evt: HospitalEvent, status: string) => {
    setUpdatingEvent(evt.id);
    setMsg(null);
    try {
      await apiFetch(`/reviews-events/admin/events/${evt.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setMsg({ kind: 'ok', text: `“${evt.title}” marked as ${EVENT_LABEL[status as EventStatus]?.toLowerCase() || status}.` });
      await fetchData();
    } catch (e: any) {
      setMsg({ kind: 'error', text: e?.message || 'Could not change the camp status. Please try again.' });
    } finally {
      setUpdatingEvent(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEvent(true);
    setMsg(null);
    try {
      await apiFetch('/reviews-events/admin/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
      });
      setMsg({ kind: 'ok', text: `“${newEvent.title}” added. It now shows on the website’s camps page.` });
      setShowEventForm(false);
      setNewEvent(emptyEvent);
      await fetchData();
    } catch (err: any) {
      setMsg({ kind: 'error', text: err?.message || 'Could not add the camp. Please try again.' });
    } finally {
      setCreatingEvent(false);
    }
  };

  const set = (patch: Partial<typeof emptyEvent>) => setNewEvent((v) => ({ ...v, ...patch }));

  const tabClass = (on: boolean) =>
    `pb-2.5 -mb-px border-b-2 text-[15px] ${on ? 'border-[#0F766E] text-[#1C2321] font-semibold' : 'border-transparent text-stone-500 hover:text-[#1C2321]'}`;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Reviews & health camps</h1>
        <p className="mt-1 text-stone-600">Approve patient reviews before they appear on the website, and keep the camps list up to date.</p>
      </div>

      {loadError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between gap-3">
          <span>{loadError}</span>
          <button type="button" className="font-semibold underline shrink-0" onClick={fetchData}>
            Try again
          </button>
        </div>
      )}

      <div className="border-b border-[#E7E3DA] flex gap-6" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'reviews'} onClick={() => setTab('reviews')} className={tabClass(tab === 'reviews')}>
          Reviews{pending.length > 0 ? ` (${pending.length} waiting)` : ''}
        </button>
        <button type="button" role="tab" aria-selected={tab === 'events'} onClick={() => setTab('events')} className={tabClass(tab === 'events')}>
          Health camps
        </button>
      </div>

      <Message msg={msg} onClose={() => setMsg(null)} />

      {/* ───────── Reviews ───────── */}
      {tab === 'reviews' && (
        <div className="space-y-6">
          {reviewStats && (
            <p className="text-sm text-stone-600">
              Average rating on the website {reviewStats.averageRating} of 5 from {reviewStats.approvedReviews} published review
              {reviewStats.approvedReviews === 1 ? '' : 's'}. {reviewStats.pendingModeration} waiting, {reviewStats.rejectedReviews} rejected.
            </p>
          )}

          <section className="bg-white border border-[#E7E3DA] rounded-lg">
            <div className="px-5 py-4 border-b border-[#E7E3DA]">
              <h2 className="text-lg">Reviews waiting for approval</h2>
              <p className="text-sm text-stone-500">Oldest first. Nothing is shown to patients until you approve it.</p>
            </div>
            {loading && reviews.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-500">Loading reviews…</p>
            ) : pending.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-500">
                {loadError ? 'Reviews could not be shown.' : 'No reviews waiting. New reviews from the website appear here.'}
              </p>
            ) : (
              <ul className="divide-y divide-[#E7E3DA]">
                {pending.map((rev) => (
                  <li key={rev.id} className="px-5 py-4">
                    <ReviewBody rev={rev} />
                    {rejectingId === rev.id ? (
                      <div className="mt-3 space-y-2">
                        <label className="block text-sm">
                          <span className="block text-stone-600 mb-1">Reason for rejecting (optional, staff only)</span>
                          <textarea
                            rows={2}
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="e.g. Contains a phone number, not about our hospital"
                            className={inputClass}
                            autoFocus
                          />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={moderating === rev.id}
                            onClick={() => handleModerate(rev, 'REJECTED', rejectNote.trim() || undefined)}
                            className="btn-secondary text-sm text-red-700 disabled:opacity-50"
                          >
                            {moderating === rev.id ? 'Rejecting…' : 'Reject review'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectNote('');
                            }}
                            className="text-sm text-stone-600 underline underline-offset-4 px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={moderating === rev.id}
                          onClick={() => handleModerate(rev, 'APPROVED', 'Verified and approved by admin.')}
                          className="btn-primary text-sm disabled:opacity-50"
                        >
                          {moderating === rev.id ? 'Approving…' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          disabled={moderating === rev.id}
                          onClick={() => {
                            setRejectingId(rev.id);
                            setRejectNote('');
                          }}
                          className="btn-secondary text-sm disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white border border-[#E7E3DA] rounded-lg">
            <div className="px-5 py-4 border-b border-[#E7E3DA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg">Already reviewed</h2>
              <label className="text-sm flex items-center gap-2">
                <span className="text-stone-600">Show</span>
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value as '' | 'APPROVED' | 'REJECTED')}
                  className={`${inputClass} w-auto py-2`}
                >
                  <option value="">Published and rejected</option>
                  <option value="APPROVED">Published only</option>
                  <option value="REJECTED">Rejected only</option>
                </select>
              </label>
            </div>
            {loading && reviews.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-500">Loading…</p>
            ) : history.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-500">No reviews here yet.</p>
            ) : (
              <ul className="divide-y divide-[#E7E3DA]">
                {history.map((rev) => (
                  <li key={rev.id} className="px-5 py-4">
                    <div className="flex flex-col-reverse sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <ReviewBody rev={rev} />
                        {rev.moderationNote && <p className="mt-1.5 text-sm text-stone-500">Staff note: {rev.moderationNote}</p>}
                      </div>
                      <Dot color={REVIEW_DOT[rev.status]} label={REVIEW_LABEL[rev.status]} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* ───────── Health camps ───────── */}
      {tab === 'events' && (
        <div className="space-y-6">
          {showEventForm ? (
            <section className="bg-white border border-[#E7E3DA] rounded-lg">
              <div className="px-5 py-4 border-b border-[#E7E3DA]">
                <h2 className="text-lg">Add a camp or event</h2>
                <p className="text-sm text-stone-500">It appears on the website as soon as you save.</p>
              </div>
              <form onSubmit={handleCreateEvent} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="block text-stone-600 mb-1">Title in English</span>
                    <input required value={newEvent.title} onChange={(e) => set({ title: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <span className="block text-stone-600 mb-1">Title in Marathi (optional)</span>
                    <input value={newEvent.titleMr} onChange={(e) => set({ titleMr: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <span className="block text-stone-600 mb-1">Date</span>
                    <input required type="date" value={newEvent.eventDate} onChange={(e) => set({ eventDate: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <span className="block text-stone-600 mb-1">Time</span>
                    <input
                      required
                      value={newEvent.eventTime}
                      onChange={(e) => set({ eventTime: e.target.value })}
                      placeholder="09:00 AM – 01:00 PM"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="block text-stone-600 mb-1">Type</span>
                    <select value={newEvent.category} onChange={(e) => set({ category: e.target.value })} className={inputClass}>
                      {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="block text-stone-600 mb-1">Doctor attending (optional)</span>
                    <input
                      value={newEvent.featuredDoctor}
                      onChange={(e) => set({ featuredDoctor: e.target.value })}
                      placeholder="Dr. Name (Qualification)"
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="block text-stone-600 mb-1">Venue</span>
                  <input
                    required
                    value={newEvent.venue}
                    onChange={(e) => set({ venue: e.target.value })}
                    placeholder={`OPD Complex, ${HOSPITAL.shortName}`}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="block text-stone-600 mb-1">Description in English</span>
                  <textarea required rows={3} value={newEvent.description} onChange={(e) => set({ description: e.target.value })} className={inputClass} />
                </label>
                <label className="block text-sm">
                  <span className="block text-stone-600 mb-1">Description in Marathi (optional)</span>
                  <textarea rows={3} value={newEvent.descriptionMr} onChange={(e) => set({ descriptionMr: e.target.value })} className={inputClass} />
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <label className="flex items-center gap-2.5 text-[15px] text-[#1C2321] cursor-pointer">
                    <input type="checkbox" checked={newEvent.isFree} onChange={(e) => set({ isFree: e.target.checked })} className="w-4 h-4 accent-[#0F766E]" />
                    Free for patients
                  </label>
                  <label className="flex items-center gap-2.5 text-[15px] text-[#1C2321] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newEvent.registrationRequired}
                      onChange={(e) => set({ registrationRequired: e.target.checked })}
                      className="w-4 h-4 accent-[#0F766E]"
                    />
                    Patients must register first
                  </label>
                </div>
                {newEvent.registrationRequired && (
                  <label className="block text-sm sm:max-w-xs">
                    <span className="block text-stone-600 mb-1">Phone number for registration</span>
                    <input value={newEvent.registrationPhone} onChange={(e) => set({ registrationPhone: e.target.value })} className={inputClass} />
                  </label>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="submit" disabled={creatingEvent} className="btn-primary text-sm disabled:opacity-50">
                    {creatingEvent ? 'Saving…' : 'Add camp'}
                  </button>
                  <button type="button" onClick={() => setShowEventForm(false)} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="bg-white border border-[#E7E3DA] rounded-lg">
            <div className="px-5 py-4 border-b border-[#E7E3DA] flex items-center justify-between gap-3">
              <h2 className="text-lg">Camps and events</h2>
              {!showEventForm && (
                <button type="button" onClick={() => setShowEventForm(true)} className="btn-primary text-sm">
                  Add camp
                </button>
              )}
            </div>
            {loading && events.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-500">Loading camps…</p>
            ) : events.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-500">
                {loadError ? 'Camps could not be shown.' : 'No camps yet. Use “Add camp” to list one on the website.'}
              </p>
            ) : (
              <ul className="divide-y divide-[#E7E3DA]">
                {events.map((evt) => (
                  <li key={evt.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="sm:w-40 shrink-0 text-sm">
                      <p className="font-semibold text-[#1C2321]">{shortDate(evt.eventDate)}</p>
                      <p className="text-stone-500">{evt.eventTime}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1C2321]">{evt.title}</p>
                      {evt.titleMr && <p className="text-sm text-stone-600">{evt.titleMr}</p>}
                      <p className="text-sm text-stone-500 mt-0.5 break-words">
                        {[
                          CATEGORY_LABEL[evt.category] || 'Event',
                          evt.isFree ? 'Free' : 'Paid',
                          evt.venue,
                          evt.featuredDoctor,
                          evt.registrationRequired ? `Register on ${evt.registrationPhone || 'phone'}` : '',
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                      <Dot color={EVENT_DOT[evt.status] || 'bg-stone-300'} label={EVENT_LABEL[evt.status] || 'Unknown'} />
                      <label className="text-sm">
                        <span className="sr-only">Change status of {evt.title}</span>
                        <select
                          value={evt.status}
                          disabled={updatingEvent === evt.id}
                          onChange={(e) => handleUpdateEventStatus(evt, e.target.value)}
                          className={`${inputClass} w-auto py-2 text-sm disabled:opacity-50`}
                        >
                          {(Object.keys(EVENT_LABEL) as EventStatus[]).map((s) => (
                            <option key={s} value={s}>
                              {s === evt.status ? `Status: ${EVENT_LABEL[s]}` : `Mark as ${EVENT_LABEL[s].toLowerCase()}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
