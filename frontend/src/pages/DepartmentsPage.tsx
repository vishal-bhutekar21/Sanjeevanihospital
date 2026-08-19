import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Activity } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const departments = [
    {
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      desc: 'Advanced arthroplasty, robotic-assisted joint replacement, fracture trauma care, and arthroscopy.',
      faculty: 'Dr. Nishant Goyal',
    },
    {
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology',
      nameMr: 'बालरोग आणि नवजात शिशु काळजी',
      desc: '24x7 Neonatal ICU (NICU), pediatric critical care, vaccinations, and growth assessments.',
      faculty: 'Dr. Shivdas Mirkad',
    },
    {
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      desc: 'Normal & high-risk deliveries, laparoscopic hysterectomy, antenatal monitoring, and infertility guidance.',
      faculty: 'Dr. Anshul Goyal, Dr. Shashikala Kale',
    },
    {
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'सामान्य आणि दुर्बिणीद्वारे शस्त्रक्रिया',
      desc: 'Minimally invasive keyhole surgeries for appendix, hernia, gallbladder, and gastrointestinal conditions.',
      faculty: 'Dr. Millind Katole',
    },
    {
      slug: 'icu-critical-care',
      nameEn: 'ICU & Critical Care',
      nameMr: 'अतिदक्षता विभाग आणि क्रिटिकल केअर',
      desc: 'Multi-organ intensive care, 24x7 intensivist monitoring, mechanical ventilation, and resuscitation.',
      faculty: 'Dr. Baliram Bagal',
    },
    {
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine',
      nameMr: 'सामान्य औषधोपचार विभाग',
      desc: 'Holistic diagnosis and management of chronic diabetes, hypertension, cardiovascular risks, and infectious diseases.',
      faculty: 'Dr. Kailash Rajguru, Dr. Tushar Agrawal',
    },
    {
      slug: 'nephrology-dialysis',
      nameEn: 'Nephrology & Dialysis',
      nameMr: 'मूत्रपिंड विकार आणि डायलिसिस',
      desc: 'Modern hemodialysis unit, kidney disease management, and acute renal failure triage.',
      faculty: 'Dr. Pranav Vanjari (Visiting)',
    },
    {
      slug: 'urology',
      nameEn: 'Urology & Andrology',
      nameMr: 'मूत्रमार्ग विकार विभाग',
      desc: 'Endourology, laser stone removal (PCNL/URS), and prostate disorder treatments.',
      faculty: 'Dr. Kalyansing Rajput (Visiting)',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hospital-soft text-hospital-teal text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Multispeciality Clinical Infrastructure</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Clinical Departments & Specialties
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Comprehensive specialized departments equipped with modern surgical, diagnostic, and intensive care infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.slug}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle hover:shadow-card-hover transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-hospital-teal/10 flex items-center justify-center text-hospital-teal">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  OPD & IPD
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{dept.nameEn}</h3>
                <p className="text-xs font-medium text-hospital-cyan mt-0.5">{dept.nameMr}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{dept.desc}</p>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Specialist:</span> {dept.faculty}
              </div>
            </div>

            <div className="pt-4 mt-4 flex items-center justify-between">
              <Link
                to={`/book`}
                className="text-xs font-bold text-hospital-teal hover:underline flex items-center gap-1"
              >
                <span>Book Consultation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
