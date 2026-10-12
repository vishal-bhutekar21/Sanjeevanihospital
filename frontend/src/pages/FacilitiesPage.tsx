import React from 'react';
import {
  HeartPulse,
  Activity,
  ShieldAlert,
  Sparkles,
  Microscope,
  Bed,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FacilitiesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const facilities = [
    {
      title: '21-Bed Intensive Care Unit (ICU)',
      titleMr: '२१ खाटांचा अद्ययावत अतिदक्षता विभाग (ICU)',
      icon: HeartPulse,
      desc: 'Multi-parameter patient monitoring, invasive & non-invasive mechanical ventilators, central oxygen, defibrillators, and 24x7 dedicated intensivist coverage.',
      descMr: '२४ तास तज्ज्ञ अतिदक्षतातज्ज्ञ, मेकॅनिकल व्हेंटिलेटर्स, मॉनिटर्स, डिफिब्रिलेटर व २४ तास जीवनरक्षक यंत्रणा.',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/WhatsApp-Image-2023-03-20-at-12.09.55-PM-1.webp',
      badge: '21 Beds Critical Care',
    },
    {
      title: 'Advanced Modular Operation Theatres',
      titleMr: 'अत्याधुनिक मॉड्युलर शस्त्रक्रिया गृह',
      icon: ShieldCheck,
      desc: 'Advanced surgical suites with HEPA filtered laminar airflow, C-Arm image intensifiers, and Karl Storz high-definition laparoscopy towers.',
      descMr: 'हेपा फिल्टर्स, निर्जंतुक हवा प्रणाली, कार्ल स्टॉर्झ HD लेप्रोस्कोपी टॉवर व डिजिटल सी-आर्म फ्लोरोस्कोपी.',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/WhatsApp-Image-2023-03-21-at-4.28.59-PM.webp',
      badge: 'Sterile Laminar Airflow',
    },
    {
      title: 'Central Reception & Patient Lounge',
      titleMr: 'मध्यवर्ती स्वागत कक्ष व प्रतीक्षालय',
      icon: Building2,
      desc: 'Spacious patient reception, computerized OPD registration, Arogya Mitra assistance desk, and comfortable waiting lounge.',
      descMr: 'प्रशस्त स्वागत कक्ष, संगणकीकृत ओपीडी नोंदणी, आरोग्य मित्र मदत कक्ष आणि रुग्णांसाठी बैठक व्यवस्था.',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/WhatsApp-Image-2023-03-20-at-12.09.54-PM-1.webp',
      badge: 'Computerized Front Desk',
    },
    {
      title: 'In-House 24x7 Pharmacy & Medical Store',
      titleMr: '२४ तास औषधालय व फार्मसी',
      icon: ShieldAlert,
      desc: 'Round-the-clock availability of critical emergency drugs, surgical implants, post-operative medications, and pediatric formulations.',
      descMr: 'तातडीचे उपचार, आपत्कालीन औषधे, शस्त्रक्रिया साहित्य व बालरोग औषधे २४ तास उपलब्ध.',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/Pharmacy.webp',
      badge: '24x7 In-House Store',
    },
    {
      title: '3D/4D Color Doppler Sonography & X-Ray',
      titleMr: '३२-चॅनेल कलर डॉपलर सोनोग्राफी व डिजिटल एक्स-रे',
      icon: Sparkles,
      desc: 'High-frequency digital radiography and ultrasound diagnostics with 3D/4D color Doppler for obstetrics, abdominal, and vascular assessments.',
      descMr: 'गर्भावस्थेतील बाळाची तपासणी, पोटाचे अवयव व रक्तवाहिन्यांचे उच्च-दर्जाचे रंगीत चित्रण.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      badge: 'High-Resolution Imaging',
    },
    {
      title: '24x7 Emergency Trauma & Ambulance Service',
      titleMr: '२४ तास आपत्कालीन ट्रॉमा व अ‍ॅम्ब्युलन्स सेवा',
      icon: ShieldAlert,
      desc: 'Dedicated casualty unit equipped with defibrillators, crash carts, and multi-parameter monitors for acute trauma and medical emergencies.',
      descMr: 'तातडीचे उपचार, ट्रॉमा केअर, डिफिब्रिलेटर आणि सर्व प्रकारची आपत्कालीन औषधे २४ तास उपलब्ध.',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/FrontPic.webp',
      badge: 'Immediate Trauma Care',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── HERO BANNER (CLEAN HEALTHCARE STYLING) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10  space-y-4">
        <div className="badge-teal text-xs">
          <Activity className="w-3.5 h-3.5" />
          <span>{isMr ? 'अत्याधुनिक वैद्यकीय पायाभूत सुविधा' : 'Advanced Healthcare Infrastructure'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl text-stone-900 font-heading">
          {isMr ? 'हॉस्पिटल सुविधा आणि २१ खाटांचा ICU' : 'Hospital Facilities & 21-Bed Critical Care'}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे रुग्णांच्या सुरक्षिततेसाठी आणि जलद उपचारांसाठी आंतरराष्ट्रीय दर्जाचे तंत्रज्ञान, २१ खाटांचा सुसज्ज ICU आणि मॉड्युलर शस्त्रक्रिया गृह सज्ज आहेत.'
            : 'The operation theatres, ICU, labs and imaging we use to look after patients every day.'}
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
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-teal-300 text-[11px] font-medium px-2.5 py-1 rounded">
                  {fac.badge}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base text-stone-900 font-heading">
                      {isMr ? fac.titleMr : fac.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
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
