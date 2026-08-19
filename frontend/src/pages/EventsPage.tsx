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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <HeartPulse className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'मोफत आरोग्य शिबिरे व रुग्ण अभिप्राय' : 'Community Health Camps & Patient Reviews'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
          {isMr ? 'आरोग्य शिबिरे, उपक्रम आणि' : 'Health Camps, Events &'}<br />
          <span className="text-[#FDE047] font-black">
            {isMr ? 'रुग्णांचे खरे अनुभव व अभिप्राय' : 'Verified Patient Experiences'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
          {isMr
            ? 'संजीवनी हॉस्पिटल, जालना तर्फे नियमित आयोजित केली जाणारी मोफत तपासणी शिबिरे, जनजागृती उपक्रम आणि उपचार घेतलेल्या रुग्णांचे अनुभव.'
            : 'Community health initiatives, free specialist checkup camps, and verified patient feedback from Sanjeevani Multispeciality Hospital, Jalna.'}
        </p>
      </div>

      {/* ─── HIGH-CONTRAST TAB SWITCHER ─────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-2 bg-white/80 p-2 rounded-2xl border-2 border-[#FDE68A] shadow-md max-w-md">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3.5 rounded-xl text-sm font-black whitespace-nowrap transition flex-1 ${
            activeTab === 'events'
              ? 'bg-[#002B5B] text-amber-300 shadow-md border-2 border-amber-400'
              : 'text-slate-800 hover:bg-[#FEF3C7] font-bold'
          }`}
        >
          {isMr ? 'आरोग्य शिबिरे व कार्यक्रम' : 'Health Camps & Events'}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3.5 rounded-xl text-sm font-black whitespace-nowrap transition flex-1 ${
            activeTab === 'reviews'
              ? 'bg-[#002B5B] text-amber-300 shadow-md border-2 border-amber-400'
              : 'text-slate-800 hover:bg-[#FEF3C7] font-bold'
          }`}
        >
          {isMr ? 'रुग्णांचे अभिप्राय' : 'Patient Reviews'}
        </button>
      </div>

      {/* ─── TAB: EVENTS ────────────────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-16 text-slate-700 font-bold">Loading upcoming health camps...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-7 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-[#002B5B] text-amber-300 text-xs font-black border border-amber-400">
                        {event.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-black ${
                          event.isFree ? 'bg-emerald-600 text-white border border-emerald-400' : 'bg-amber-500 text-slate-950 font-black'
                        }`}
                      >
                        {event.isFree ? '100% FREE' : 'SPECIAL FEE'}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#002B5B] font-heading leading-snug">
                      {isMr ? event.titleMr || event.title : event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t-2 border-amber-200 text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#002B5B]" />
                      <span className="text-[#002B5B]">{event.eventDate}</span>
                      <span>·</span>
                      <Clock className="w-4 h-4 text-[#002B5B]" />
                      <span>{event.eventTime}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#007791] shrink-0 mt-0.5" />
                      <span>{event.venue}</span>
                    </div>
                    {event.featuredDoctor && (
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Stethoscope className="w-4 h-4" />
                        <span>{event.featuredDoctor}</span>
                      </div>
                    )}
                    {event.registrationPhone && (
                      <div className="flex items-center gap-2 text-rose-700 pt-1">
                        <Phone className="w-4 h-4" />
                        <span>Helpline: {event.registrationPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: REVIEWS ───────────────────────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="space-y-10">
          {/* Rating Summary Card */}
          {reviewStats && (
            <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center space-y-1">
                  <div className="text-4xl font-black text-[#002B5B] font-heading">{reviewStats.averageRating}</div>
                  <div className="flex justify-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-700 font-bold">Average Rating</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-black text-slate-900 font-heading">{reviewStats.approvedReviews}</div>
                  <div className="text-xs text-slate-700 font-bold">Published Reviews</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-black text-emerald-700 font-heading">{reviewStats.fiveStarCount}</div>
                  <div className="text-xs text-slate-700 font-bold">5-Star Ratings</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-black text-amber-600 font-heading">{reviewStats.pendingModeration}</div>
                  <div className="text-xs text-slate-700 font-bold">Awaiting Moderation</div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 shadow-xl flex flex-col justify-between space-y-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-black text-[#002B5B]">{rev.patientName}</p>
                    {rev.patientLocation && (
                      <p className="text-xs text-slate-600 font-bold">{rev.patientLocation}</p>
                    )}
                    <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  {rev.isVerifiedPatient && (
                    <div className="flex items-center gap-1 text-xs text-emerald-800 font-black bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Patient</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-800 leading-relaxed italic font-medium">{rev.reviewText}</p>
                </div>

                <div className="pt-4 border-t-2 border-amber-200 flex items-center justify-between">
                  <div className="text-xs text-slate-700 font-bold">
                    {rev.doctorName && <span className="text-[#002B5B]">{rev.doctorName} · </span>}
                    {rev.treatmentType && <span>{rev.treatmentType}</span>}
                  </div>
                  <button
                    onClick={() => handleMarkHelpful(rev.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#002B5B] transition font-bold"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 sm:p-10 shadow-xl">
            <h3 className="text-2xl font-black text-[#002B5B] font-heading border-b-2 border-amber-200 pb-4 mb-6">
              {isMr ? 'आपला अनुभव येथे शेअर करा' : 'Share Your Experience at Sanjeevani Hospital'}
            </h3>

            {submittedReview ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="text-xl font-black text-slate-900 font-heading">
                  {isMr ? 'अभिप्राय दिल्याबद्दल धन्यवाद!' : 'Thank you for your valuable feedback!'}
                </p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto font-bold">
                  Your review will be published after verification by our moderation team.
                </p>
                <button
                  onClick={() => setSubmittedReview(false)}
                  className="mt-3 px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#002B5B] shadow-md"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Your Name *</label>
                    <input
                      required
                      value={reviewForm.patientName}
                      onChange={(e) => setReviewForm({ ...reviewForm, patientName: e.target.value })}
                      placeholder="e.g. Ramesh Jadhav"
                      className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">City / Village</label>
                    <input
                      value={reviewForm.patientLocation}
                      onChange={(e) => setReviewForm({ ...reviewForm, patientLocation: e.target.value })}
                      placeholder="e.g. Jalna City, Ambad Taluka"
                      className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Doctor Consulted</label>
                    <select
                      value={reviewForm.doctorName}
                      onChange={(e) => setReviewForm({ ...reviewForm, doctorName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                    >
                      <option value="">Select Doctor (Optional)</option>
                      <option>Dr. Nishant Goyal (Orthopedics)</option>
                      <option>Dr. Shivdas Mirkad (Pediatrics)</option>
                      <option>Dr. Baliram Bagal (Critical Care / ICU)</option>
                      <option>Dr. Kailash Rajguru (Medicine)</option>
                      <option>Dr. Anshul Goyal (Gyn / Obs)</option>
                      <option>Dr. Millind Katole (General Surgery)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Treatment / Procedure</label>
                    <input
                      value={reviewForm.treatmentType}
                      onChange={(e) => setReviewForm({ ...reviewForm, treatmentType: e.target.value })}
                      placeholder="e.g. Knee Replacement, Delivery, ICU"
                      className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                        className="transition"
                      >
                        <Star
                          className={`w-7 h-7 ${s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-black text-slate-800 self-center ml-2">{reviewForm.rating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    minLength={20}
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    placeholder="Share your experience regarding doctor care, nursing staff, cleanliness, and overall treatment..."
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#002B5B] to-[#007791] text-white text-base font-black shadow-xl hover:opacity-95 transition disabled:bg-slate-300 border-2 border-amber-400"
                >
                  <Send className="w-5 h-5" />
                  <span>{submittingReview ? 'Submitting...' : 'Submit Patient Review'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
