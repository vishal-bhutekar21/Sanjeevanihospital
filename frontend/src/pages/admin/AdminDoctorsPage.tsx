import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Stethoscope,
  Building2,
  Calendar,
} from 'lucide-react';

interface DoctorItem {
  id: string;
  name: string;
  designation: string;
  qualifications: string;
  department: string;
  specialty: string;
  consultationFee: number;
  isActive: boolean;
}

export const AdminDoctorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<DoctorItem[]>([
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      designation: 'Director & Senior Consultant',
      qualifications: 'MBBS, DA, FICM, CCCS',
      department: 'Critical Care & Anesthesiology',
      specialty: 'Critical Care Resuscitation & Family Medicine',
      consultationFee: 400,
      isActive: true,
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      designation: 'Director & Consultant Pediatrician',
      qualifications: 'MBBS, MD, DCH',
      department: 'Pediatrics & Neonatology',
      specialty: 'Neonatal Intensive Care, Child Growth & Vaccinations',
      consultationFee: 500,
      isActive: true,
    },
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      designation: 'Director & Consultant Orthopedic Surgeon',
      qualifications: 'MBBS, DNB, D. Ortho',
      department: 'Orthopedics & Joint Replacement',
      specialty: 'Trauma Care, Knee/Hip Replacement, Arthroscopy',
      consultationFee: 500,
      isActive: true,
    },
    {
      id: 'doc-rajguru',
      name: 'Dr. Kailash Rajguru',
      designation: 'Director & Consultant Physician',
      qualifications: 'MBBS, MD (Medicine)',
      department: 'Internal Medicine',
      specialty: 'Diabetes, Hypertension & Critical Illness',
      consultationFee: 400,
      isActive: true,
    },
    {
      id: 'doc-anshul',
      name: 'Dr. Anshul (Pahawa) Goyal',
      designation: 'Consultant Obstetrician & Gynecologist',
      qualifications: 'MBBS, DNB, DGO',
      department: 'Obstetrics & Gynecology',
      specialty: 'High-Risk Pregnancy, Infertility & Laparoscopic Gyn Surgery',
      consultationFee: 500,
      isActive: true,
    },
    {
      id: 'doc-katole',
      name: 'Dr. Millind Katole',
      designation: 'Consultant General Surgeon',
      qualifications: 'MBBS, MS (General Surgery)',
      department: 'General & Laparoscopic Surgery',
      specialty: 'Hernia, Appendix, Gallbladder & Laparoscopic Surgeries',
      consultationFee: 500,
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Consultant Specialist',
    qualifications: '',
    department: 'Orthopedics & Joint Replacement',
    specialty: '',
    consultationFee: 500,
  });

  const toggleStatus = (id: string) => {
    setDoctors(doctors.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)));
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: DoctorItem = {
      id: `doc-${Date.now()}`,
      ...formData,
      isActive: true,
    };
    setDoctors([...doctors, newDoc]);
    setShowModal(false);
    setFormData({
      name: '',
      designation: 'Consultant Specialist',
      qualifications: '',
      department: 'Orthopedics & Joint Replacement',
      specialty: '',
      consultationFee: 500,
    });
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Faculty Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure specialist profiles, departments, fees, and active availability status.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hospital-teal text-white text-xs font-bold shadow-sm hover:bg-hospital-teal/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Specialist</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search doctor by name, specialty or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
          />
        </div>
        <span className="text-xs font-medium text-slate-500">
          Showing {filtered.length} of {doctors.length} Doctors
        </span>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Qualifications</th>
                <th className="py-3 px-4">OPD Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal shrink-0">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{doc.department}</td>
                  <td className="py-3.5 px-4 font-semibold text-hospital-teal">{doc.qualifications}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{doc.consultationFee}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {doc.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(doc.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        doc.isActive
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {doc.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Specialist Doctor</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Kulkarni"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MS, MCh"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                >
                  <option>Orthopedics & Joint Replacement</option>
                  <option>Pediatrics & Neonatology</option>
                  <option>Obstetrics & Gynecology</option>
                  <option>General & Laparoscopic Surgery</option>
                  <option>ICU & Critical Care</option>
                  <option>Internal Medicine</option>
                  <option>Nephrology & Dialysis</option>
                  <option>Urology & Andrology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trauma Care, Knee Replacement"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-hospital-teal hover:bg-hospital-teal/90 shadow-sm transition"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
