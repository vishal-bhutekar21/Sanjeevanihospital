import React, { useEffect, useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCcw,
  Calendar,
  Plus,
  Eye,
  Filter,
  ThumbsUp,
  Trash2,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import { apiUrl } from '../../lib/api';

const statusMeta = {
  PENDING:  { label: 'Pending',   color: 'bg-amber-100 text-amber-800 border-amber-200',   icon: Clock        },
  APPROVED: { label: 'Approved',  color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected',  color: 'bg-rose-100 text-rose-800 border-rose-200',      icon: XCircle      },
};

const eventStatusMeta = {
  UPCOMING:  { label: 'Upcoming',   color: 'bg-blue-100 text-blue-800 border-blue-200'     },
  ONGOING:   { label: 'Ongoing',    color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  COMPLETED: { label: 'Completed',  color: 'bg-slate-100 text-slate-700 border-slate-200'  },
  CANCELLED: { label: 'Cancelled',  color: 'bg-rose-100 text-rose-800 border-rose-200'     },
};

export const AdminReviewsEventsPage: React.FC = () => {
  const [tab, setTab] = useState<'reviews' | 'events'>('reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [filterReviewStatus, setFilterReviewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', titleMr: '', description: '', descriptionMr: '',
    eventDate: '', eventTime: '', venue: '',
    category: 'HEALTH_CAMP', organizer: 'Sanjeevani Hospital', featuredDoctor: '',
    registrationRequired: false, registrationPhone: '+91-75073-42222',
    isFree: true,
  });
  const [creatingEvent, setCreatingEvent] = useState(false);

  const token = () => localStorage.getItem('token');
  const authHeaders = () => ({ Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revRes, evtRes, statsRes] = await Promise.all([
        fetch(apiUrl(`/reviews-events/admin/reviews${filterReviewStatus ? `?status=${filterReviewStatus}` : ''}`), { headers: authHeaders() }),
        fetch(apiUrl('/reviews-events/events/all'), { headers: authHeaders() }),
        fetch(apiUrl('/reviews-events/reviews/stats')),
      ]);
      const [revData, evtData, statsData] = await Promise.all([revRes.json(), evtRes.json(), statsRes.json()]);
      setReviews(revData.data || []);
      setEvents(evtData.data || []);
      setReviewStats(statsData.data || null);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filterReviewStatus]);

  const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED', note?: string) => {
    setModerating(id);
    try {
      await fetch(apiUrl(`/reviews-events/admin/reviews/${id}/moderate`), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, moderationNote: note }),
      });
      await fetchData();
    } catch {}
    setModerating(null);
  };

  const handleUpdateEventStatus = async (id: string, status: string) => {
    try {
      await fetch(apiUrl(`/reviews-events/admin/events/${id}/status`), {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch {}
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEvent(true);
    try {
      await fetch(apiUrl('/reviews-events/admin/events'), {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(newEvent),
      });
      setShowEventForm(false);
      await fetchData();
    } catch {}
    setCreatingEvent(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Reviews & Events Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">Moderate patient reviews · Manage hospital health camps & events</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">
          <RefreshCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Review Stats */}
      {reviewStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Avg Rating', value: `${reviewStats.averageRating}★`, color: 'text-amber-500' },
            { label: 'Approved', value: reviewStats.approvedReviews, color: 'text-emerald-600' },
            { label: 'Pending', value: reviewStats.pendingModeration, color: 'text-amber-600' },
            { label: 'Rejected', value: reviewStats.rejectedReviews, color: 'text-rose-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-card-subtle">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl max-w-sm">
        <button onClick={() => setTab('reviews')}
          className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${tab === 'reviews' ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
          Patient Reviews ({reviews.length})
        </button>
        <button onClick={() => setTab('events')}
          className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${tab === 'events' ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
          Events ({events.length})
        </button>
      </div>

      {/* ──── REVIEWS TAB ─────────────────────────────────────────────────── */}
      {tab === 'reviews' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {['', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
              <button key={s} onClick={() => setFilterReviewStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  filterReviewStatus === s ? 'bg-hospital-teal text-white border-hospital-teal' : 'bg-white text-slate-600 border-slate-200'
                }`}>
                {s || 'All'} {statusMeta[s as keyof typeof statusMeta] ? '' : ''}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading reviews...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviews.map((rev) => {
                const sm = statusMeta[rev.status as keyof typeof statusMeta];
                const Icon = sm?.icon || Clock;
                return (
                  <div key={rev.id} className={`bg-white rounded-2xl border p-5 shadow-card-subtle space-y-3 ${
                    rev.status === 'PENDING' ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{rev.patientName}</p>
                        <p className="text-[11px] text-slate-400">{rev.patientLocation} · {rev.source}</p>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                          <span className="text-[11px] text-slate-500 ml-1">{rev.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sm?.color}`}>
                          <Icon className="w-3 h-3" />{sm?.label}
                        </span>
                        {rev.isVerifiedPatient && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 italic">
                      "{rev.reviewText}"
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div>
                        {rev.doctorName && <span className="font-semibold text-hospital-teal">{rev.doctorName} · </span>}
                        {rev.treatmentType && <span>{rev.treatmentType}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{rev.helpfulCount} helpful</span>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    {rev.status === 'PENDING' && (
                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <button onClick={() => handleModerate(rev.id, 'APPROVED', 'Verified and approved by admin.')}
                          disabled={moderating === rev.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition border border-emerald-200 disabled:opacity-50">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {moderating === rev.id ? 'Approving...' : 'Approve & Publish'}
                        </button>
                        <button onClick={() => handleModerate(rev.id, 'REJECTED', 'Review rejected — does not meet guidelines.')}
                          disabled={moderating === rev.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition border border-rose-200 disabled:opacity-50">
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    )}
                    {rev.status !== 'PENDING' && rev.moderationNote && (
                      <p className="text-[11px] text-slate-400 bg-slate-50 rounded-lg px-3 py-1.5">
                        Note: {rev.moderationNote}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──── EVENTS TAB ──────────────────────────────────────────────────── */}
      {tab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowEventForm(!showEventForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition shadow-sm">
              <Plus className="w-4 h-4" />
              {showEventForm ? 'Cancel' : 'Create New Event'}
            </button>
          </div>

          {/* Create Event Form */}
          {showEventForm && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">New Hospital Event / Health Camp</h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Title (English) *</label>
                    <input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title (Marathi)</label>
                    <input value={newEvent.titleMr} onChange={e => setNewEvent({...newEvent, titleMr: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Date *</label>
                    <input required type="date" value={newEvent.eventDate} onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Time *</label>
                    <input required value={newEvent.eventTime} onChange={e => setNewEvent({...newEvent, eventTime: e.target.value})}
                      placeholder="09:00 AM – 01:00 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                    <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none">
                      <option value="HEALTH_CAMP">Health Camp</option>
                      <option value="AWARENESS_SEMINAR">Awareness Seminar</option>
                      <option value="FREE_CHECKUP">Free Check-Up</option>
                      <option value="VACCINATION_DRIVE">Vaccination Drive</option>
                      <option value="DIAGNOSTIC_CAMP">Diagnostic Camp</option>
                      <option value="CME">CME Program</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Featured Doctor</label>
                    <input value={newEvent.featuredDoctor} onChange={e => setNewEvent({...newEvent, featuredDoctor: e.target.value})}
                      placeholder="Dr. Name (Qualification)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Venue *</label>
                  <input required value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})}
                    placeholder="OPD Complex, Sanjeevani Hospital..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description (English) *</label>
                  <textarea required rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <input type="checkbox" checked={newEvent.isFree} onChange={e => setNewEvent({...newEvent, isFree: e.target.checked})}
                      className="rounded" />
                    Free Event
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <input type="checkbox" checked={newEvent.registrationRequired} onChange={e => setNewEvent({...newEvent, registrationRequired: e.target.checked})}
                      className="rounded" />
                    Registration Required
                  </label>
                </div>

                <button type="submit" disabled={creatingEvent}
                  className="w-full py-3 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition disabled:bg-slate-300">
                  {creatingEvent ? 'Creating Event...' : 'Create Event'}
                </button>
              </form>
            </div>
          )}

          {/* Events Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card-subtle overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">Loading events...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Event', 'Date & Time', 'Category', 'Doctor', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-bold text-slate-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((evt) => {
                      const sm = eventStatusMeta[evt.status as keyof typeof eventStatusMeta];
                      return (
                        <tr key={evt.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3 max-w-[200px]">
                            <p className="font-bold text-slate-900 leading-snug">{evt.title}</p>
                            <p className="text-[10px] text-hospital-cyan font-semibold mt-0.5">{evt.titleMr}</p>
                            <p className="text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{evt.venue?.substring(0, 40)}...
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900">{evt.eventDate}</p>
                            <p className="text-slate-500">{evt.eventTime}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {evt.category}
                            </span>
                            <div className="mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${evt.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {evt.isFree ? 'FREE' : 'PAID'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {evt.featuredDoctor ? (
                              <span className="text-hospital-teal font-semibold flex items-center gap-1">
                                <Stethoscope className="w-3 h-3" />{evt.featuredDoctor?.substring(0, 30)}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sm?.color}`}>
                              {sm?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select onChange={e => handleUpdateEventStatus(evt.id, e.target.value)}
                              value={evt.status}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:ring-1 focus:ring-hospital-teal focus:outline-none">
                              <option value="UPCOMING">Upcoming</option>
                              <option value="ONGOING">Ongoing</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
