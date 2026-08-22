import React from 'react';
import {
  HeartPulse,
  Activity,
  ShieldAlert,
  Sparkles,
  Microscope,
  Bed,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FacilitiesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const facilities = [
    {
      title: '21-Bed Intensive Care Unit (ICU)',
      titleMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      icon: HeartPulse,
      desc: 'Multi-bed critical care monitoring unit with high-end mechanical ventilators, invasive arterial monitoring, central oxygen, and round-the-clock intensivist coverage.',
      descMr: 'आधुनिक मेकॅनिकल व्हेंटिलेटर्स, संगणकीकृत ७-चॅनेल मॉनिटर्स, केंद्रीय ऑक्सिजन व २४ तास निष्णात भूलतज्ज्ञ डॉक्टर.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      badge: '24x7 Intensivist on Duty',
    },
    {
      title: 'Modular Operation Theatres',
      titleMr: 'अत्याधुनिक मॉड्युलर शस्त्रक्रिया गृह',
      icon: Activity,
      desc: 'Advanced surgical suites with HEPA filtered laminar airflow, C-Arm image intensifiers, and Karl Storz high-definition laparoscopy towers.',
      descMr: 'हेपा फिल्टर्स, निर्जंतुक हवा प्रणाली, कार्ल स्टॉर्झ HD लेप्रोस्कोपी टॉवर व डिजिटल सी-आर्म फ्लोरोस्कोपी.',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
      badge: 'Sterile Laminar Airflow',
    },
    {
      title: 'Neonatal NICU & Phototherapy',
      titleMr: 'नवजात शिशु अतिदक्षता (NICU)',
      icon: Bed,
      desc: 'Microprocessor-controlled infant warmers, phototherapy units, and pediatric resuscitation equipment for premature and newborn babies.',
      descMr: 'अकाली जन्मलेल्या बाळांसाठी उबदार वॉर्मर्स, कावीळ फोटोथेरपी आणि बालरोग तज्ज्ञांची २४ तास देखरेख.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      badge: 'Advanced Baby Warmers',
    },
    {
      title: '3D/4D Color Doppler Sonography',
      titleMr: '३२-चॅनेल कलर डॉपलर सोनोग्राफी',
      icon: Sparkles,
      desc: 'High-frequency digital radiography and ultrasound diagnostics with 3D/4D color Doppler for obstetrics, abdominal, and vascular assessments.',
      descMr: 'गर्भावस्थेतील बाळाची तपासणी, पोटाचे अवयव व रक्तवाहिन्यांचे उच्च-दर्जाचे रंगीत चित्रण.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      badge: 'High-Resolution Imaging',
    },
    {
      title: '24x7 Diagnostic Pathology Lab',
      titleMr: '२४ तास स्वयंचलित पॅथॉलॉजी लॅब',
      icon: Microscope,
      desc: 'Automated hematology, biochemistry, clinical pathology, electrolyte analysis, and arterial blood gas (ABG) reporting with rapid STAT turnaround times.',
      descMr: 'रक्त, लघवी, बायोकेमिस्ट्री, इलेक्ट्रोलाइट्स व एबीजी तपासणीचे त्वरित आणि अचूक संगणकीकृत रिपोर्ट्स.',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      badge: 'Rapid STAT Testing',
    },
    {
      title: '24x7 Emergency Casualty & Pharmacy',
      titleMr: '२४ तास आपत्कालीन व फार्मसी',
      icon: ShieldAlert,
      desc: 'Dedicated casualty unit equipped with defibrillators, crash carts, and multi-parameter monitors for acute trauma and medical emergencies.',
      descMr: 'तातडीचे उपचार, ट्रॉमा केअर, डिफिब्रिलेटर आणि सर्व प्रकारची आपत्कालीन औषधे २४ तास उपलब्ध.',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      badge: 'Immediate Trauma Care',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── HERO BANNER (CLEAN HEALTHCARE STYLING) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-slate-50 border border-teal-200 shadow-xs space-y-4">
        <div className="badge-teal text-xs">
          <Activity className="w-3.5 h-3.5" />
          <span>{isMr ? 'अत्याधुनिक वैद्यकीय पायाभूत सुविधा' : 'Advanced Healthcare Infrastructure'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
          {isMr ? 'हॉस्पिटल सुविधा आणि २१ खाटांचा ICU' : 'Hospital Facilities & 21-Bed Critical Care'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे रुग्णांच्या सुरक्षिततेसाठी आणि जलद उपचारांसाठी आंतरराष्ट्रीय दर्जाचे तंत्रज्ञान, २१ खाटांचा सुसज्ज ICU आणि मॉड्युलर शस्त्रक्रिया गृह सज्ज आहेत.'
            : 'State-of-the-art medical technology engineered for patient safety, sterile surgical outcomes, and 24x7 critical resuscitation in Jalna.'}
        </p>
      </div>

      {/* ─── FACILITIES GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac, idx) => {
          const Icon = fac.icon;
          return (
            <div
              key={idx}
              className="card-clean overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-teal-300 text-[11px] font-medium px-2.5 py-1 rounded">
                  {fac.badge}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      {isMr ? fac.titleMr : fac.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isMr ? fac.descMr : fac.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
