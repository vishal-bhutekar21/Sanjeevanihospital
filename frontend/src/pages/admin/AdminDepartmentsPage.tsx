import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Activity,
  Stethoscope,
  HeartPulse,
  Award,
  Users,
  X,
  Sparkles,
} from 'lucide-react';
import { DOCTORS_DATA } from '../../data/doctorsData';

interface DeptItem {
  id: string;
  slug: string;
  nameEn: string;
  nameMr: string;
  descriptionEn: string;
  descriptionMr: string;
  leadDoctor: string;
  doctorCount: number;
  isActive: boolean;
}

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DeptItem[]>([
    {
      id: 'dept-ortho',
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      descriptionEn: 'Advanced arthroplasty, trauma fixation, arthroscopy, and spine care with digital C-Arm.',
      descriptionMr: 'सांधे प्रत्यारोपण, फ्रॅक्चर उपचार, आणि मणक्याचे आधुनिक उपचार.',
      leadDoctor: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      doctorCount: 2,
      isActive: true,
    },
    {
      id: 'dept-peds',
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology (NICU)',
      nameMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
      descriptionEn: '24x7 Neonatal ICU (NICU), pediatric critical care, radiant warmers, and child health clinics.',
      descriptionMr: 'नवजात शिशु अतिदक्षता विभाग आणि लहान मुलांचे सर्व आजार व लसीकरण.',
      leadDoctor: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      doctorCount: 2,
      isActive: true,
    },
    {
      id: 'dept-icu',
      slug: 'icu-critical-care',
      nameEn: '21-Bed ICU & Critical Care Unit',
      nameMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      descriptionEn: 'Computerized multi-organ intensive care, mechanical ventilation, and 24x7 on-call intensivists.',
      descriptionMr: '२४ तास व्हेंटिलेटर, डायलिसिस सपोर्ट व भूलतज्ज्ञ डॉक्टर.',
      leadDoctor: 'Dr. Baliram Bagal (MBBS, DA, FICM, CCCS)',
      doctorCount: 3,
      isActive: true,
    },
    {
      id: 'dept-gyn',
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology (Maternity)',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      descriptionEn: 'Safe motherhood, painless normal deliveries, cesarean sections, and gynecological laparoscopy.',
      descriptionMr: 'सुरक्षित प्रसूती, सिझेरियन आणि दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      leadDoctor: 'Dr. Anshul Goyal (MBBS, DNB, DGO)',
      doctorCount: 2,
      isActive: true,
    },
    {
      id: 'dept-surg',
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
      descriptionEn: 'Karl Storz HD laparoscopic keyhole surgery for appendix, hernia, and laser anorectal care.',
      descriptionMr: 'हर्निया, अपेंडिक्स व पित्ताशयाची दुर्बिणीद्वारे शस्त्रक्रिया.',
      leadDoctor: 'Dr. Millind Katole (MBBS, MS General Surgery)',
      doctorCount: 2,
      isActive: true,
    },
    {
      id: 'dept-med',
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine & Physician',
      nameMr: 'इंटरनल मेडिसिन व फिजिशियन',
      descriptionEn: 'Management of chronic diabetes, hypertension, cardiovascular risks, and infectious ailments.',
      descriptionMr: 'मधुमेह, उच्च रक्तदाब व इतर सर्वसाधारण आजारांचे निदान व उपचार.',
      leadDoctor: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      doctorCount: 3,
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameMr: '',
    slug: '',
    leadDoctor: '',
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
      nameMr: formData.nameMr || formData.nameEn,
      descriptionEn: formData.descriptionEn,
      descriptionMr: formData.descriptionMr || formData.descriptionEn,
      leadDoctor: formData.leadDoctor || 'Senior Consultant',
      doctorCount: 1,
      isActive: true,
    };
    setDepartments([...departments, newDept]);
    setShowModal(false);
    setFormData({ nameEn: '', nameMr: '', slug: '', leadDoctor: '', descriptionEn: '', descriptionMr: '' });
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* ─── 1. PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge-teal text-[11px] py-0.5 px-2.5">
              Clinical Specializations
            </span>
            <span className="text-xs text-slate-400 font-mono">
              6 Active Major Departments
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Clinical Departments Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Configure clinical department profiles, bilingual Marathi/English content, and linked faculty rosters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary text-xs py-2 px-4 shadow-2xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* ─── 2. DEPARTMENTS GRID (SPACIOUS & MINIMAL) ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="card-clean bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      dept.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {dept.isActive ? 'Active on Portal' : 'Draft / Inactive'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleStatus(dept.id)}
                    className="text-xs text-slate-400 hover:text-slate-700 p-1"
                    title="Toggle Status"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${dept.isActive ? 'text-emerald-600' : 'text-slate-300'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {dept.nameEn}
                </h3>
                <p className="text-xs font-semibold text-[#0F766E]">
                  {dept.nameMr}
                </p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p>{dept.descriptionEn}</p>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
                  {dept.descriptionMr}
                </p>
              </div>

              <div className="space-y-1 pt-1 text-xs">
                <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                  Department In-Charge / Faculty
                </span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{dept.leadDoctor}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{dept.doctorCount} Doctors Linked</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                /departments/{dept.slug}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 3. ADD DEPARTMENT MODAL ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0F766E]" />
                <span>Add Clinical Department</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Department Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Cardiology & Cath Lab"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Department Name (Marathi) *</label>
                <input
                  type="text"
                  required
                  value={formData.nameMr}
                  onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                  placeholder="उदा. हृदयरोग व कॅथ लॅब विभाग"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Lead Specialist Doctor *</label>
                <input
                  type="text"
                  required
                  value={formData.leadDoctor}
                  onChange={(e) => setFormData({ ...formData, leadDoctor: e.target.value })}
                  placeholder="e.g. Dr. Kailash Rajguru (MD Medicine)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Short Description (English)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Clinical scope, diagnostic equipment, and surgical specialties..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Short Description (Marathi)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionMr}
                  onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                  placeholder="तपासणी सुविधा, निदान व विशेषोपचार..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
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
