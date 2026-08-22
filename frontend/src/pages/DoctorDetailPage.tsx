import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Stethoscope, Calendar, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DoctorDetailPage: React.FC = () => {
  const { doctorId } = useParams();

  const doctorData: Record<string, any> = {
    'doc-bagal': {
      name: 'Dr. Baliram Bagal',
      designation: 'Director & Senior Consultant',
      qualifications: 'MBBS, DA, FICM, CCCS',
      department: 'Critical Care & Anesthesiology',
      specialty: 'Family Medicine, Intensive Care & Critical Resuscitation',
      experienceYears: 18,
      consultationFee: 400,
      languages: ['English', 'Marathi (मराठी)', 'Hindi (हिंदी)'],
      timings: 'Monday – Saturday: 09:00 AM – 03:00 PM',
      about:
        'Dr. Baliram Bagal is a founding Director at Sanjeevani Multispeciality Hospital with over 18 years of clinical expertise in emergency airway management, ICU hemodynamic stabilization, and holistic family healthcare.',
      procedures: [
        'Advanced Mechanical Ventilation',
        'Invasive Central Line & Arterial Line Insertion',
        'Critical Sepsis & Multi-Organ Failure Management',
        'Surgical Anesthesia & Post-Operative Pain Relief',
      ],
    },
    'doc-mirkad': {
      name: 'Dr. Shivdas Mirkad',
      designation: 'Director & Consultant Pediatrician',
      qualifications: 'MBBS, MD, DCH',
      department: 'Pediatrics & Neonatology',
      specialty: 'Neonatal Intensive Care, Child Growth & Vaccinations',
      experienceYears: 16,
      consultationFee: 500,
      languages: ['English', 'Marathi (मराठी)', 'Hindi (हिंदी)'],
      timings: 'Monday – Saturday: 10:00 AM – 02:00 PM & 05:00 PM – 08:00 PM',
      about:
        'Dr. Shivdas Mirkad leads the Neonatal and Pediatric Department at Sanjeevani Hospital, specializing in low-birth-weight neonatal care, pediatric asthma, developmental screening, and comprehensive childhood immunization.',
      procedures: [
        'Neonatal Resuscitation & NICU Care',
        'Childhood Asthma & Respiratory Allergy Clinics',
        'Pediatric Infectious Disease Management',
        'Comprehensive Pediatric Growth Monitoring',
      ],
    },
    'doc-goyal': {
      name: 'Dr. Nishant Goyal',
      designation: 'Director & Consultant Orthopedic Surgeon',
      qualifications: 'MBBS, DNB, D. Ortho',
      department: 'Orthopedics & Joint Replacement',
      specialty: 'Trauma Care, Knee/Hip Replacement, Arthroscopy',
      experienceYears: 15,
      consultationFee: 500,
      languages: ['English', 'Marathi (मराठी)', 'Hindi (हिंदी)'],
      timings: 'Monday – Saturday: 11:00 AM – 04:00 PM',
      about:
        'Dr. Nishant Goyal is a premier orthopedic and joint replacement surgeon in Jalna, known for complex fracture trauma fixation, minimally invasive arthroscopic knee ligament repairs, and advanced total joint arthroplasty.',
      procedures: [
        'Total Knee & Total Hip Replacement',
        'Arthroscopic ACL/PCL Ligament Reconstruction',
        'Complex Pelvic & Long-Bone Trauma Fixation',
        'Spine Stabilization & Sciatica Care',
      ],
    },
  };

  const doc = doctorData[doctorId || 'doc-goyal'] || doctorData['doc-goyal'];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0F766E] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Doctors Directory</span>
      </Link>

      {/* Main Profile Header */}
      <div className="card-clean p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center">
            <Stethoscope className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">{doc.name}</h1>
            <p className="text-xs font-semibold text-[#0F766E] mt-0.5">{doc.qualifications}</p>
            <p className="text-xs text-slate-500">{doc.designation}</p>
          </div>
          <div className="badge-teal text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Medical Specialist</span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5 lg:border-l lg:border-slate-100 lg:pl-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Department</span>
              <span className="font-semibold text-slate-900 mt-0.5 block truncate">{doc.department}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Experience</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{doc.experienceYears}+ Years</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-slate-500 block">Consultation Fee</span>
              <span className="font-bold text-[#0F766E] text-sm mt-0.5 block">₹{doc.consultationFee}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 font-heading">Clinical Focus & Background</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{doc.about}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Weekly Consultation Timings
              </span>
              <p className="text-xs font-semibold text-slate-800">{doc.timings}</p>
            </div>

            <Link
              to={`/book?doctorId=${doctorId}`}
              className="btn-primary text-xs py-2 px-4"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Slot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Procedures & Clinical Services */}
      <div className="card-clean p-6 sm:p-8 space-y-3">
        <h3 className="text-base font-bold text-slate-900 font-heading">Specialized Procedures & Interventions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {doc.procedures.map((proc: string, idx: number) => (
            <div key={idx} className="flex items-center space-x-2.5 p-3 rounded-lg bg-slate-50 text-xs font-medium text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{proc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
