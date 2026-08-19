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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Activity className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'अत्याधुनिक वैद्यकीय पायाभूत सुविधा' : 'Advanced Healthcare Infrastructure'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
          {isMr ? 'हॉस्पिटल सुविधा आणि' : 'Hospital Facilities &'}<br />
          <span className="text-[#FDE047] font-black">
            {isMr ? '२१ खाटांचा अतिदक्षता विभाग (ICU)' : '21-Bed Critical Care Infrastructure'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे रुग्णांच्या सुरक्षिततेसाठी आणि जलद उपचारांसाठी आंतरराष्ट्रीय दर्जाचे तंत्रज्ञान, २१ खाटांचा सुसज्ज ICU आणि मॉड्युलर शस्त्रक्रिया गृह सज्ज आहेत.'
            : 'State-of-the-art medical technology engineered for patient safety, sterile surgical outcomes, and 24x7 critical resuscitation in Jalna.'}
        </p>
      </div>

      {/* ─── FACILITIES GRID (50% Saturated Warm Amber-Ivory Cards) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((fac, idx) => {
          const Icon = fac.icon;
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-[#001529]/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow border border-amber-500">
                  {fac.badge}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#002B5B] text-amber-300 flex items-center justify-center font-bold shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-[#002B5B] font-heading">
                      {isMr ? fac.titleMr : fac.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-semibold">
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
