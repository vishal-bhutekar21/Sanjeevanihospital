import React from 'react';
import { MapPin, Phone, Navigation } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hospital-soft text-hospital-teal text-xs font-semibold mb-2">
          <Phone className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact & Hospital Location
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Visit Sanjeevani Multispeciality Hospital in Jalna, Maharashtra or reach out directly to our 24x7 reception desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Official Hospital Address
            </h3>
            <div className="flex items-start space-x-3 text-sm text-slate-600">
              <MapPin className="w-5 h-5 text-hospital-teal shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Sanjeevani Multispeciality Hospital</p>
                <p>Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli,</p>
                <p>Jalna, Maharashtra 431203, India.</p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Sanjeevani+Multispeciality+Hospital+Jalna+Rishi+Park"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition shadow-sm w-full justify-center"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps / Directions</span>
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              24x7 Direct Helplines
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Reception & Casualty:</span>
                <a href="tel:+917507342222" className="font-bold text-hospital-teal hover:underline">
                  +91-75073-42222
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Alternate Landline:</span>
                <span className="font-bold text-slate-900">02482-223322</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Email:</span>
                <span className="font-medium text-slate-900">admin@sanjeevanihosp.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Map View */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
          <h3 className="text-base font-bold text-slate-900">Location Map & Directions</h3>
          <div className="w-full h-80 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
            <iframe
              title="Sanjeevani Hospital Jalna Location"
              src="https://maps.google.com/maps?q=Sanjeevani+Multispeciality+Hospital+Jalna+Rishi+Park&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
