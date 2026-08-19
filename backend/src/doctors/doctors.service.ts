import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorsService {
  private readonly doctors = [
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      designation: 'Director & Senior Consultant',
      qualifications: 'MBBS, DA, FICM, CCCS',
      departmentId: 'dept-icu',
      departmentName: 'Critical Care & Anesthesiology',
      specialty: 'Critical Care Resuscitation & Family Medicine',
      experienceYears: 18,
      consultationFee: 400,
      isActive: true,
      availableDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
      timings: '09:00 AM – 03:00 PM',
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      designation: 'Director & Consultant Pediatrician',
      qualifications: 'MBBS, MD, DCH',
      departmentId: 'dept-peds',
      departmentName: 'Pediatrics & Neonatology',
      specialty: 'Neonatal Intensive Care, Child Growth & Vaccinations',
      experienceYears: 16,
      consultationFee: 500,
      isActive: true,
      availableDays: [1, 2, 3, 4, 5, 6],
      timings: '10:00 AM – 02:00 PM & 05:00 PM – 08:00 PM',
    },
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      designation: 'Director & Consultant Orthopedic Surgeon',
      qualifications: 'MBBS, DNB, D. Ortho',
      departmentId: 'dept-ortho',
      departmentName: 'Orthopedics & Joint Replacement',
      specialty: 'Trauma Care, Knee/Hip Replacement, Arthroscopy',
      experienceYears: 15,
      consultationFee: 500,
      isActive: true,
      availableDays: [1, 2, 3, 4, 5, 6],
      timings: '11:00 AM – 04:00 PM',
    },
    {
      id: 'doc-rajguru',
      name: 'Dr. Kailash Rajguru',
      designation: 'Director & Consultant Physician',
      qualifications: 'MBBS, MD (Medicine)',
      departmentId: 'dept-med',
      departmentName: 'Internal Medicine',
      specialty: 'Diabetes, Hypertension & Critical Illness',
      experienceYears: 17,
      consultationFee: 400,
      isActive: true,
      availableDays: [1, 2, 3, 4, 5, 6],
      timings: '09:00 AM – 02:00 PM',
    },
    {
      id: 'doc-anshul',
      name: 'Dr. Anshul (Pahawa) Goyal',
      designation: 'Consultant Obstetrician & Gynecologist',
      qualifications: 'MBBS, DNB, DGO',
      departmentId: 'dept-gyn',
      departmentName: 'Obstetrics & Gynecology',
      specialty: 'High-Risk Pregnancy, Infertility & Laparoscopic Gyn Surgery',
      experienceYears: 12,
      consultationFee: 500,
      isActive: true,
      availableDays: [1, 2, 3, 4, 5, 6],
      timings: '10:00 AM – 03:00 PM',
    },
    {
      id: 'doc-katole',
      name: 'Dr. Millind Katole',
      designation: 'Consultant General Surgeon',
      qualifications: 'MBBS, MS (General Surgery)',
      departmentId: 'dept-surg',
      departmentName: 'General & Laparoscopic Surgery',
      specialty: 'Hernia, Appendix, Gallbladder & Laparoscopic Surgeries',
      experienceYears: 14,
      consultationFee: 500,
      isActive: true,
      availableDays: [1, 2, 3, 4, 5, 6],
      timings: '10:00 AM – 02:00 PM',
    },
  ];

  findAll(query?: { departmentId?: string; search?: string }) {
    let result = this.doctors;
    if (query?.departmentId) {
      result = result.filter((d) => d.departmentId === query.departmentId);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.departmentName.toLowerCase().includes(q),
      );
    }
    return result;
  }

  findById(id: string) {
    return this.doctors.find((d) => d.id === id);
  }

  getDoctorAvailability(id: string, dateStr: string) {
    const doc = this.findById(id);
    if (!doc) return null;

    // Generate standard 30-min slots for the requested date
    return {
      doctorId: doc.id,
      doctorName: doc.name,
      date: dateStr,
      consultationFee: doc.consultationFee,
      slots: [
        { slotId: `${id}-${dateStr}-1000`, time: '10:00 AM', status: 'AVAILABLE' },
        { slotId: `${id}-${dateStr}-1030`, time: '10:30 AM', status: 'AVAILABLE' },
        { slotId: `${id}-${dateStr}-1100`, time: '11:00 AM', status: 'HELD' },
        { slotId: `${id}-${dateStr}-1130`, time: '11:30 AM', status: 'AVAILABLE' },
        { slotId: `${id}-${dateStr}-1200`, time: '12:00 PM', status: 'AVAILABLE' },
        { slotId: `${id}-${dateStr}-1230`, time: '12:30 PM', status: 'AVAILABLE' },
      ],
    };
  }
}
