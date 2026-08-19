import React, { useState } from 'react';
import { Building2, Plus, Edit2, CheckCircle2, XCircle, Activity, Stethoscope, HeartPulse, Award } from 'lucide-react';

interface DeptItem {
  id: string;
  slug: string;
  nameEn: string;
  nameMr: string;
  descriptionEn: string;
  descriptionMr: string;
  doctorsCount: number;
  isActive: boolean;
}

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DeptItem[]>([
    {
      id: 'dept-ortho',
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      descriptionEn: 'Advanced arthroplasty, trauma fixation, arthroscopy, and spine care.',
      descriptionMr: 'सांधे प्रत्यारोपण, फ्रॅक्चर उपचार, आणि मणक्याचे आजार.',
      doctorsCount: 1,
      isActive: true,
    },
    {
      id: 'dept-peds',
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology',
      nameMr: 'बालरोग आणि नवजात शिशु काळजी',
      descriptionEn: '24x7 Neonatal ICU (NICU), pediatric critical care, and child health clinics.',
      descriptionMr: 'नवजात शिशु अतिदक्षता विभाग आणि लहान मुलांचे सर्व आजार.',
      doctorsCount: 1,
      isActive: true,
    },
    {
      id: 'dept-gyn',
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      descriptionEn: 'High-risk pregnancy, normal deliveries, and laparoscopic gynecological surgery.',
      descriptionMr: 'सुरक्षित प्रसूती आणि दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      doctorsCount: 1,
      isActive: true,
    },
    {
      id: 'dept-surg',
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'सामान्य आणि दुर्बिणीद्वारे शस्त्रक्रिया',
      descriptionEn: 'Minimally invasive keyhole surgery for appendix, hernia, and gallbladder.',
      descriptionMr: 'हर्निया, अपेंडिक्स व पित्ताशयाची दुर्बिणीद्वारे शस्त्रक्रिया.',
      doctorsCount: 1,
      isActive: true,
    },
    {
      id: 'dept-icu',
      slug: 'icu-critical-care',
      nameEn: 'ICU & Critical Care',
      nameMr: 'अतिदक्षता विभाग आणि क्रिटिकल केअर',
      descriptionEn: 'Multi-organ intensive care and advanced mechanical ventilation.',
      descriptionMr: '२४ तास व्हेंटिलेटर व अतिदक्षता विभाग.',
      doctorsCount: 1,
      isActive: true,
    },
    {
      id: 'dept-med',
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine',
      nameMr: 'सामान्य औषधोपचार विभाग',
      descriptionEn: 'Management of diabetes, hypertension, fever, and infectious ailments.',
      descriptionMr: 'मधुमेह, रक्तदाब व इतर सर्वसाधारण आजारांचे निदान व उपचार.',
      doctorsCount: 1,
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameMr: '',
    slug: '',
    descriptionEn: '',
    descriptionMr: '',
  });

  const toggleStatus = (id: string) => {
    setDepartments(
      departments.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)),
    );
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept: DeptItem = {
      id: `dept-${Date.now()}`,
      slug: formData.slug || formData.nameEn.toLowerCase().replace(/\s+/g, '-'),
      nameEn: formData.nameEn,
      nameMr: formData.nameMr,
      descriptionEn: formData.descriptionEn,
      descriptionMr: formData.descriptionMr,
      doctorsCount: 0,
      isActive: true,
    };
    setDepartments([...departments, newDept]);
    setShowModal(false);
    setFormData({ nameEn: '', nameMr: '', slug: '', descriptionEn: '', descriptionMr: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Departments</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage bilingual clinical departments, descriptions, and linked medical staff.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hospital-teal text-white text-xs font-bold shadow-sm hover:bg-hospital-teal/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-hospital-soft flex items-center justify-center text-hospital-teal">
                  <Building2 className="w-5 h-5" />
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    dept.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {dept.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{dept.nameEn}</h3>
                <p className="text-xs font-semibold text-hospital-cyan mt-0.5">{dept.nameMr}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{dept.descriptionEn}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {dept.doctorsCount} Specialist Doctor(s)
              </span>
              <button
                onClick={() => toggleStatus(dept.id)}
                className={`text-xs font-semibold hover:underline ${
                  dept.isActive ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {dept.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Clinical Department</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology & CVTS"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name (मराठी)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. हृदयविकार विभाग"
                  value={formData.nameMr}
                  onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-hospital-teal hover:bg-hospital-teal/90 shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
