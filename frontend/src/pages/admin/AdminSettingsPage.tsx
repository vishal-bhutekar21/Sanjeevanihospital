import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Phone, MapPin, Building2, Bell } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    hospitalName: 'Sanjeevani Multispeciality Hospital',
    tagline: 'Comprehensive healthcare, closer to you.',
    address: 'Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna – 431203',
    emergencyPhone: '+91-75073-42222',
    receptionPhone: '02482-223322',
    email: 'admin@sanjeevanihosp.in',
    mjpjayActive: true,
    ambulanceActive: true,
    announcement: '24x7 Emergency Resuscitation & Critical Care ICU fully operational in Jalna.',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Configuration</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public hospital contacts, emergency numbers, and patient portal notices.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Hospital settings updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-hospital-teal" />
            <span>General Hospital Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Name</label>
              <input
                type="text"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
            />
          </div>
        </div>

        {/* Helplines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-hospital-teal" />
            <span>Emergency & Reception Helplines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">24x7 Emergency Hotline</label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reception Landline</label>
              <input
                type="text"
                value={formData.receptionPhone}
                onChange={(e) => setFormData({ ...formData, receptionPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcements Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-hospital-teal" />
            <span>Patient Portal Announcement Notice</span>
          </h3>

          <div>
            <textarea
              rows={2}
              value={formData.announcement}
              onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-hospital-teal text-white text-xs font-bold rounded-xl shadow-sm hover:bg-hospital-teal/90 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Hospital Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
