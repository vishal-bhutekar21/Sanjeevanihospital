import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, Activity } from 'lucide-react';

export const DepartmentDetailPage: React.FC = () => {
  const { slug } = useParams();

  const deptData: Record<string, any> = {
    orthopedics: {
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण विभाग',
      doctor: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      doctorId: 'doc-goyal',
      about:
        'The Department of Orthopedics at Sanjeevani Hospital provides cutting-edge surgical and non-surgical treatments for joint disorders, poly-trauma, sports injuries, and spinal deformities.',
      treatments: [
        'Total Knee Replacement (TKR) & Total Hip Replacement (THR)',
        'Minimally Invasive Arthroscopic Ligament Repair',
        'Complex Fracture & Pelvic Trauma Fixation',
        'Spinal Disc Decompression & Sciatica Interventions',
        'Pediatric Bone Deformity & Fracture Management',
        'Osteoarthritis & Bone Mineral Density Screening',
      ],
      facilities: [
        'Modular Clean-Air Orthopedic Operation Theatre with Laminar Flow',
        'High-Resolution C-Arm Fluoroscopy Imaging',
        'Dedicated Post-Operative Physiotherapy & Rehabilitation Center',
        '24x7 Fracture Trauma Casualty Unit',
      ],
    },
    pediatrics: {
      nameEn: 'Pediatrics & Neonatology',
      nameMr: 'बालरोग आणि नवजात शिशु काळजी विभाग',
      doctor: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      doctorId: 'doc-mirkad',
      about:
        'Our pediatric department offers warm, comprehensive, and specialized medical care for newborns, infants, and adolescents, backed by advanced neonatal intensive care.',
      treatments: [
        'Neonatal Intensive Care for Low Birth Weight & Preterm Infants',
        'Pediatric Asthma, Bronchitis & Allergy Clinics',
        'Complete National Immunization & Vaccination Schedules',
        'Childhood Nutrition & Developmental Delay Assessments',
        'Emergency Pediatric Infection Resuscitation',
      ],
      facilities: [
        'Multi-Bed Neonatal Intensive Care Unit (NICU)',
        'Phototherapy & Radiant Warmers',
        'Child-Friendly Observation Ward',
        '24x7 Pediatric Emergency Triage',
      ],
    },
  };

  const currentDept = deptData[slug || 'orthopedics'] || deptData['orthopedics'];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/departments"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0F766E] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Departments</span>
      </Link>

      {/* Hero Header */}
      <div className="card-clean p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F766E] uppercase tracking-wider block">
              {currentDept.nameMr}
            </span>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              {currentDept.nameEn}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Lead Specialist: <span className="text-slate-900 font-semibold">{currentDept.doctor}</span>
            </p>
          </div>

          <Link
            to={`/book?doctorId=${currentDept.doctorId}`}
            className="btn-primary text-xs py-2.5 px-4"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Department Consultation</span>
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
          {currentDept.about}
        </p>
      </div>

      {/* Treatments & Ward Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-clean p-6 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">Clinical Procedures & Scope</h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentDept.treatments.map((t: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-clean p-6 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">Specialized Infrastructure</h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentDept.facilities.map((f: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <Activity className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
