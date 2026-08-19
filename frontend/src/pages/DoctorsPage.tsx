import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Search, ShieldCheck } from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const verifiedDoctors = [
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      designation: 'Director & Senior Consultant',
      qualifications: 'MBBS, DA, FICM, CCCS',
      department: 'Critical Care & Anesthesiology',
      specialty: 'Family Medicine, Intensive Care & Resuscitation',
      fee: 400,
      days: 'Mon – Sat (09:00 AM – 03:00 PM)',
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      designation: 'Director & Consultant Pediatrician',
      qualifications: 'MBBS, MD, DCH',
      department: 'Pediatrics & Neonatology',
      specialty: 'Neonatal Intensive Care, Child Growth & Vaccinations',
      fee: 500,
      days: 'Mon – Sat (10:00 AM – 02:00 PM & 05:00 PM – 08:00 PM)',
    },
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      designation: 'Director & Consultant Orthopedic Surgeon',
      qualifications: 'MBBS, DNB, D. Ortho',
      department: 'Orthopedics & Joint Replacement',
      specialty: 'Trauma Care, Knee/Hip Replacement, Arthroscopy',
      fee: 500,
      days: 'Mon – Sat (11:00 AM – 04:00 PM)',
    },
    {
      id: 'doc-rajguru',
      name: 'Dr. Kailash Rajguru',
      designation: 'Director & Consultant Physician',
      qualifications: 'MBBS, MD (Medicine)',
      department: 'Internal Medicine',
      specialty: 'Diabetes, Hypertension & Infectious Diseases',
      fee: 400,
      days: 'Mon – Sat (09:00 AM – 02:00 PM)',
    },
    {
      id: 'doc-anshul',
      name: 'Dr. Anshul (Pahawa) Goyal',
      designation: 'Consultant Obstetrician & Gynecologist',
      qualifications: 'MBBS, DNB, DGO',
      department: 'Obstetrics & Gynecology',
      specialty: 'High-Risk Pregnancy, Laparoscopy, Maternal Care',
      fee: 500,
      days: 'Mon – Sat (10:00 AM – 03:00 PM)',
    },
    {
      id: 'doc-katole',
      name: 'Dr. Millind Katole',
      designation: 'Consultant General & Laparoscopic Surgeon',
      qualifications: 'MBBS, MS (General Surgery)',
      department: 'General Surgery',
      specialty: 'Hernia, Appendix, Gallbladder & Laparoscopic Interventions',
      fee: 500,
      days: 'Mon – Sat (10:00 AM – 02:00 PM)',
    },
  ];

  const filtered = verifiedDoctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Hospital Medical Faculty</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Specialist Doctors & Medical Consultants
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Consult experienced physicians, surgeons, and specialists at Sanjeevani Multispeciality Hospital Jalna.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by doctor name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hospital-teal focus:border-hospital-teal shadow-sm"
        />
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle hover:shadow-card-hover transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-hospital-soft flex items-center justify-center text-hospital-teal shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  ₹{doc.fee} OPD Fee
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{doc.name}</h3>
                <p className="text-xs font-bold text-hospital-teal mt-0.5">{doc.qualifications}</p>
                <p className="text-xs text-slate-500 font-medium">{doc.designation}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700">Department:</span> {doc.department}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Clinical Focus:</span> {doc.specialty}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Schedule:</span> {doc.days}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                to={`/book?doctorId=${doc.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 shadow-sm transition"
              >
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
