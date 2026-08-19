import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, Phone, CheckCircle2, Stethoscope, Award, ChevronRight, Star, Quote, ThumbsUp, Send } from 'lucide-react';
import { apiUrl } from '../lib/api';

const categoryColors: Record<string, string> = {
  HEALTH_CAMP: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  AWARENESS_SEMINAR: 'bg-blue-100 text-blue-800 border-blue-200',
  FREE_CHECKUP: 'bg-teal-100 text-teal-800 border-teal-200',
  VACCINATION_DRIVE: 'bg-purple-100 text-purple-800 border-purple-200',
  DIAGNOSTIC_CAMP: 'bg-amber-100 text-amber-800 border-amber-200',
  CME: 'bg-slate-100 text-slate-700 border-slate-200',
};

const categoryLabels: Record<string, string> = {
  HEALTH_CAMP: 'Health Camp',
  AWARENESS_SEMINAR: 'Awareness Seminar',
  FREE_CHECKUP: 'Free Check-Up',
  VACCINATION_DRIVE: 'Vaccination Drive',
  DIAGNOSTIC_CAMP: 'Diagnostic Camp',
  CME: 'CME Program',
};

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'reviews'>('events');

  // Review submission form
  const [reviewForm, setReviewForm] = useState({
    patientName: '', patientLocation: '', rating: 5, reviewText: '', doctorName: '', treatmentType: ''
  });
  const [submittedReview, setSubmittedReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/reviews-events/events'))
      .then(r => r.json()).then(d => setEvents(d.data || [])).catch(() => {});

    fetch(apiUrl('/reviews-events/reviews'))
      .then(r => r.json()).then(d => setReviews(d.data || [])).catch(() => {});

    fetch(apiUrl('/reviews-events/reviews/stats'))
      .then(r => r.json()).then(d => setReviewStats(d.data || null)).catch(() => {});
  }, []);

  const handleMarkHelpful = async (id: string) => {
    try {
      const res = await fetch(apiUrl(`/reviews-events/reviews/${id}/helpful`), { method: 'PATCH' });
      const data = await res.json();
      setReviews(reviews.map(r => r.id === id ? { ...r, helpfulCount: data.data.helpfulCount } : r));
    } catch {}
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await fetch(apiUrl('/reviews-events/reviews/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, source: 'DIRECT' }),
      });
      setSubmittedReview(true);
    } catch {
      setSubmittedReview(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Health Camps, Events & Patient Reviews
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Community health initiatives, free medical camps, and verified patient experiences from Sanjeevani Hospital, Jalna.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl max-w-sm">
        <button onClick={() => setActiveTab('events')}
          className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'events' ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
          Health Camps & Events
        </button>
        <button onClick={() => setActiveTab('reviews')}
          className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'reviews' ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
          Patient Reviews
        </button>
      </div>

      {/* ── Events Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading upcoming health camps...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle hover:shadow-card-hover transition flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryColors[event.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {categoryLabels[event.category] || event.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${event.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {event.isFree ? 'FREE' : 'PAID'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{event.title}</h3>
                    <p className="text-[11px] font-semibold text-hospital-cyan">{event.titleMr}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed flex-1">{event.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-hospital-teal" />
                      <span className="font-semibold">{event.eventDate}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-hospital-teal" />
                      <span>{event.eventTime}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-hospital-cyan shrink-0 mt-0.5" />
                      <span>{event.venue}</span>
                    </div>
                    {event.featuredDoctor && (
                      <div className="flex items-center gap-1.5 font-semibold text-hospital-teal">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{event.featuredDoctor}</span>
                      </div>
                    )}
                    {event.registrationRequired && (
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-hospital-cyan" />
                        <span>Register: {event.registrationPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Reviews Tab ────────────────────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Rating Summary Card */}
          {reviewStats && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-hospital-teal">{reviewStats.averageRating}</div>
                  <div className="flex justify-center mt-1 space-x-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviewStats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-slate-900">{reviewStats.approvedReviews}</div>
                  <div className="text-xs text-slate-500 mt-1">Published Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-emerald-600">{reviewStats.fiveStarCount}</div>
                  <div className="text-xs text-slate-500 mt-1">5-Star Ratings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-amber-500">{reviewStats.pendingModeration}</div>
                  <div className="text-xs text-slate-500 mt-1">Awaiting Moderation</div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle flex flex-col space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{rev.patientName}</p>
                    {rev.patientLocation && (
                      <p className="text-[11px] text-slate-400 font-medium">{rev.patientLocation}</p>
                    )}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border">{rev.source}</span>
                    {rev.isVerifiedPatient && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-slate-200 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed italic">{rev.reviewText}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    {rev.doctorName && <span className="font-semibold text-hospital-teal">{rev.doctorName} · </span>}
                    {rev.treatmentType && <span>{rev.treatmentType}</span>}
                  </div>
                  <button
                    onClick={() => handleMarkHelpful(rev.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-hospital-teal transition font-semibold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card-subtle">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
              Share Your Experience at Sanjeevani Hospital
            </h3>

            {submittedReview ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-900">Thank you for your feedback!</p>
                <p className="text-xs text-slate-500">Your review has been submitted and will be published after our moderation team verifies it.</p>
                <button onClick={() => setSubmittedReview(false)} className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                  Submit Another Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input required value={reviewForm.patientName} onChange={e => setReviewForm({...reviewForm, patientName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Village</label>
                    <input value={reviewForm.patientLocation} onChange={e => setReviewForm({...reviewForm, patientLocation: e.target.value})}
                      placeholder="e.g. Jalna City, Ambad Taluka"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Consulted</label>
                    <select value={reviewForm.doctorName} onChange={e => setReviewForm({...reviewForm, doctorName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none">
                      <option value="">Select Doctor (Optional)</option>
                      <option>Dr. Nishant Goyal</option>
                      <option>Dr. Shivdas Mirkad</option>
                      <option>Dr. Baliram Bagal</option>
                      <option>Dr. Kailash Rajguru</option>
                      <option>Dr. Anshul Goyal</option>
                      <option>Dr. Millind Katole</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Treatment / Procedure</label>
                    <input value={reviewForm.treatmentType} onChange={e => setReviewForm({...reviewForm, treatmentType: e.target.value})}
                      placeholder="e.g. Knee Replacement, Delivery, ICU"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                  </div>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Your Rating *</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})}
                        className="transition">
                        <Star className={`w-7 h-7 transition ${s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 self-center ml-2">{reviewForm.rating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Review (min. 20 characters) *</label>
                  <textarea required rows={4} minLength={20} value={reviewForm.reviewText} onChange={e => setReviewForm({...reviewForm, reviewText: e.target.value})}
                    placeholder="Tell us about your experience at Sanjeevani Hospital — care quality, doctor behavior, facility cleanliness, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                  Your review will be published after moderation by our team to ensure authenticity. Thank you for helping other patients make informed decisions.
                </div>

                <button type="submit" disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition shadow-sm disabled:bg-slate-300">
                  <Send className="w-4 h-4" />
                  <span>{submittingReview ? 'Submitting...' : 'Submit Review for Moderation'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
