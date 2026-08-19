import React from 'react';
import { HeartPulse, Activity, ShieldAlert, Sparkles, Microscope, Clock } from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const facilities = [
    {
      title: '24x7 Intensive Care Unit (ICU)',
      icon: HeartPulse,
      desc: 'Multi-bed critical care monitoring unit with high-end mechanical ventilators, invasive arterial monitoring, central oxygen, and round-the-clock intensivist coverage.',
    },
    {
      title: 'Modular Operation Theatres',
      icon: Activity,
      desc: 'Advanced surgical suites with HEPA filtered laminar airflow, C-Arm image intensifiers, and high-definition laparoscopy towers for minimal access surgeries.',
    },
    {
      title: '24x7 Diagnostic Pathology Lab',
      icon: Microscope,
      desc: 'Automated hematology, biochemistry, clinical pathology, electrolyte analysis, and arterial blood gas (ABG) reporting with rapid STAT turnaround times.',
    },
    {
      title: 'Digital X-Ray & Ultrasonography',
      icon: Sparkles,
      desc: 'High-frequency digital radiography and ultrasound diagnostics with color Doppler for obstetrics, abdominal, and vascular assessments.',
    },
    {
      title: 'Emergency Resuscitation & Trauma Ward',
      icon: ShieldAlert,
      desc: 'Dedicated casualty unit equipped with defibrillators, crash carts, and multi-parameter monitors for acute trauma and medical emergencies.',
    },
    {
      title: '24x7 In-House Pharmacy',
      icon: Clock,
      desc: 'Round-the-clock availability of critical emergency medications, surgical disposables, intravenous fluids, and inpatient therapeutic lines.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Advanced Healthcare Infrastructure</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Hospital Facilities & Critical Infrastructure
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          State-of-the-art medical technology engineered for patient safety, sterile surgical outcomes, and 24x7 critical resuscitation in Jalna.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac, idx) => {
          const Icon = fac.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4 hover:shadow-card-hover transition"
            >
              <div className="w-12 h-12 rounded-xl bg-hospital-soft flex items-center justify-center text-hospital-teal">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{fac.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
