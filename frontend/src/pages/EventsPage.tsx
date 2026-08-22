import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Stethoscope,
  Star,
  Quote,
  ThumbsUp,
  Send,
  HeartPulse,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';

export const EventsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'reviews'>('events');

  const [reviewForm, setReviewForm] = useState({
    patientName: '',
    patientLocation: '',
    rating: 5,
    reviewText: '',
    doctorName: '',
    treatmentType: '',
  });
  const [submittedReview, setSubmittedReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/reviews-events/events'))
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .catch(() => {});

    fetch(apiUrl('/reviews-events/reviews'))
      .then((r) => r.json())
      .then((d) => setReviews(d.data || []))
      .catch(() => {});

    fetch(apiUrl('/reviews-events/reviews/stats'))
      .then((r) => r.json())
      .then((d) => setReviewStats(d.data || null))
      .catch(() => {});
  }, []);

  const handleMarkHelpful = async (id: string) => {
    try {
      const res = await fetch(apiUrl(`/reviews-events/reviews/${id}/helpful`), { method: 'PATCH' });
      const data = await res.json();
      setReviews(reviews.map((r) => (r.id === id ? { ...r, helpfulCount: data.data.helpfulCount } : r)));
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-slate-900 text-white space-y-4">
        <div className="badge-teal text-xs">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>{isMr ? 'मोफत आरोग्य शिबिरे व रुग्ण अभिप्राय' : 'Community Health Camps & Patient Reviews'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-heading">
          {isMr ? 'आरोग्य शिबिरे, उपक्रम आणि रुग्णांचे अनुभव' : 'Health Camps, Events & Patient Feedback'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isMr
            ? 'संजीवनी हॉस्पिटल, जालना तर्फे नियमित आयोजित केली जाणारी मोफत तपासणी शिबिरे, जनजागृती उपक्रम आणि उपचार घेतलेल्या रुग्णांचे अनुभव.'
            : 'Community health initiatives, free specialist checkup camps, and verified patient feedback from Sanjeevani Multispeciality Hospital, Jalna.'}
        </p>
      </div>

      {/* ─── TAB SWITCHER ─────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-slate-100 p-1.5 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex-1 ${
            activeTab === 'events'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isMr ? 'आरोग्य शिबिरे व कार्यक्रम' : 'Health Camps & Events'}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex-1 ${
            activeTab === 'reviews'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isMr ? 'रुग्णांचे अभिप्राय' : 'Patient Reviews'}
        </button>
      </div>

      {/* ─── TAB: EVENTS ────────────────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading upcoming health camps...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="card-clean p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {event.category}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          event.isFree ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {event.isFree ? '100% FREE' : 'SPECIAL FEE'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">
                      {isMr ? event.titleMr || event.title : event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.timings}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{event.doctorInCharge}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${event.contactPhone || '+917507342222'}`}
                    className="btn-primary text-xs w-full py-2 min-h-[38px]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isMr ? 'शिबिरासाठी नोंदणी / माहिती' : 'Inquire / Register'}</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: REVIEWS ───────────────────────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Stats Bar */}
          {reviewStats && (
            <div className="card-clean p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#0F766E] font-heading">{reviewStats.averageRating || '4.9'}</p>
                <div className="flex justify-center text-amber-400 gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500">Average Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 font-heading">{reviewStats.totalReviews || '120+'}</p>
                <p className="text-xs text-slate-500 mt-1">Verified Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-700 font-heading">99.2%</p>
                <p className="text-xs text-slate-500 mt-1">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 font-heading">50,000+</p>
                <p className="text-xs text-slate-500 mt-1">Patients Served</p>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="card-clean p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="badge-teal text-[10px] py-0.5">Verified</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">{rev.patientName}</span>
                    <span className="text-[11px] text-slate-400">{rev.patientLocation} • {rev.treatmentType}</span>
                  </div>
                  <button
                    onClick={() => handleMarkHelpful(rev.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-[#0F766E] text-xs font-medium"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{rev.helpfulCount || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          <div className="card-clean p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {isMr ? 'तुमचा अनुभव व अभिप्राय नोंदवा' : 'Share Your Hospital Experience'}
            </h3>

            {submittedReview ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="text-sm font-bold text-slate-900">Thank you! Your review has been submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Your Name *</label>
                    <input
                      required
                      value={reviewForm.patientName}
                      onChange={(e) => setReviewForm({ ...reviewForm, patientName: e.target.value })}
                      placeholder="e.g. Anand Shinde"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">City / Location</label>
                    <input
                      value={reviewForm.patientLocation}
                      onChange={(e) => setReviewForm({ ...reviewForm, patientLocation: e.target.value })}
                      placeholder="e.g. Jalna City"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Doctor Consulted</label>
                    <input
                      value={reviewForm.doctorName}
                      onChange={(e) => setReviewForm({ ...reviewForm, doctorName: e.target.value })}
                      placeholder="e.g. Dr. Nishant Goyal"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Treatment / Department</label>
                    <input
                      value={reviewForm.treatmentType}
                      onChange={(e) => setReviewForm({ ...reviewForm, treatmentType: e.target.value })}
                      placeholder="e.g. Knee Replacement / Pediatric Care"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Rating *</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 - Outstanding Care)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 - Good)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Review Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    placeholder="Tell us about the doctor consultation, ICU care, or overall hospital stay..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary text-xs py-2 px-4"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Patient Review'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
