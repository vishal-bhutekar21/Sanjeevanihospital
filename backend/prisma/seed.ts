import { PrismaClient, AdminRole, SlotStatus, AppointmentStatus, ModerationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seed for Sanjeevani Multispeciality Hospital Platform...');

  // 1. Seed Hospital Entity
  const hospital = await prisma.hospital.upsert({
    where: { slug: 'sanjeevani-jalna' },
    update: {},
    create: {
      name: 'Sanjeevani Multispeciality Hospital',
      slug: 'sanjeevani-jalna',
      tagline: 'Comprehensive healthcare, closer to you.',
      address: 'Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli',
      city: 'Jalna',
      state: 'Maharashtra',
      pincode: '431203',
      phone: '+91-75073-42222',
      emergencyPhone: '+91-75073-42222',
      email: 'admin@sanjeevanihosp.in',
      establishedYear: 2016,
      latitude: 19.8295,
      longitude: 75.8752,
      isActive: true,
    },
  });
  console.log(`✅ Hospital registered: ${hospital.name} (${hospital.id})`);

  // 2. Seed Hospital Admin
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.hospitalAdmin.upsert({
    where: { email: 'admin@sanjeevanihosp.in' },
    update: {},
    create: {
      hospitalId: hospital.id,
      name: 'Hospital Administrator',
      email: 'admin@sanjeevanihosp.in',
      passwordHash: adminPasswordHash,
      role: AdminRole.HOSPITAL_ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Admin account created: ${admin.email} (Role: ${admin.role})`);

  // 3. Seed Clinical Departments
  const departmentsData = [
    {
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      descriptionEn: 'Advanced arthroplasty, trauma fixation, arthroscopy, and spine care.',
      descriptionMr: 'सांधे प्रत्यारोपण, फ्रॅक्चर उपचार, आणि मणक्याचे आजार.',
      icon: 'Activity',
    },
    {
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology',
      nameMr: 'बालरोग आणि नवजात शिशु काळजी',
      descriptionEn: '24x7 Neonatal ICU (NICU), pediatric critical care, and child health clinics.',
      descriptionMr: 'नवजात शिशु अतिदक्षता विभाग आणि लहान मुलांचे सर्व आजार.',
      icon: 'Stethoscope',
    },
    {
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      descriptionEn: 'High-risk pregnancy, normal deliveries, and laparoscopic gynecological surgery.',
      descriptionMr: 'सुरक्षित प्रसूती आणि दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      icon: 'Award',
    },
    {
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'सामान्य आणि दुर्बिणीद्वारे शस्त्रक्रिया',
      descriptionEn: 'Minimally invasive keyhole surgery for appendix, hernia, and gallbladder.',
      descriptionMr: 'हर्निया, अपेंडिक्स व पित्ताशयाची दुर्बिणीद्वारे शस्त्रक्रिया.',
      icon: 'Activity',
    },
    {
      slug: 'icu-critical-care',
      nameEn: 'ICU & Critical Care',
      nameMr: 'अतिदक्षता विभाग आणि क्रिटिकल केअर',
      descriptionEn: 'Multi-organ intensive care and advanced mechanical ventilation.',
      descriptionMr: '२४ तास व्हेंटिलेटर व अतिदक्षता विभाग.',
      icon: 'HeartPulse',
    },
    {
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine',
      nameMr: 'सामान्य औषधोपचार विभाग',
      descriptionEn: 'Management of diabetes, hypertension, fever, and infectious ailments.',
      descriptionMr: 'मधुमेह, रक्तदाब व इतर सर्वसाधारण आजारांचे निदान व उपचार.',
      icon: 'Stethoscope',
    },
    {
      slug: 'nephrology-dialysis',
      nameEn: 'Nephrology & Dialysis',
      nameMr: 'मूत्रपिंड विकार आणि डायलिसिस',
      descriptionEn: 'Modern hemodialysis unit and chronic kidney disease management.',
      descriptionMr: 'डायलिसिस युनिट आणि मूत्रपिंड विकार उपचार.',
      icon: 'Activity',
    },
    {
      slug: 'urology',
      nameEn: 'Urology & Andrology',
      nameMr: 'मूत्रमार्ग विकार विभाग',
      descriptionEn: 'Endourology, laser stone removal (PCNL/URS), and prostate disorders.',
      descriptionMr: 'मुतखडा आणि मूत्रमार्ग शस्त्रक्रिया.',
      icon: 'Activity',
    },
  ];

  const createdDepts: Record<string, string> = {};

  for (const d of departmentsData) {
    const dept = await prisma.department.upsert({
      where: {
        hospitalId_slug: {
          hospitalId: hospital.id,
          slug: d.slug,
        },
      },
      update: {},
      create: {
        hospitalId: hospital.id,
        nameEn: d.nameEn,
        nameMr: d.nameMr,
        slug: d.slug,
        descriptionEn: d.descriptionEn,
        descriptionMr: d.descriptionMr,
        icon: d.icon,
        isActive: true,
      },
    });
    createdDepts[d.slug] = dept.id;
  }
  console.log(`✅ Seeded ${departmentsData.length} clinical departments`);

  // 4. Seed Verified Doctors
  const doctorsData = [
    {
      deptSlug: 'icu-critical-care',
      name: 'Dr. Baliram Bagal',
      designation: 'Director & Senior Consultant',
      qualifications: 'MBBS, DA, FICM, CCCS',
      specialty: 'Critical Care Resuscitation & Family Medicine',
      experienceYears: 18,
      consultationFee: 400,
      schedules: [
        { day: 1, start: '09:00', end: '15:00', duration: 30 },
        { day: 2, start: '09:00', end: '15:00', duration: 30 },
        { day: 3, start: '09:00', end: '15:00', duration: 30 },
        { day: 4, start: '09:00', end: '15:00', duration: 30 },
        { day: 5, start: '09:00', end: '15:00', duration: 30 },
        { day: 6, start: '09:00', end: '15:00', duration: 30 },
      ],
    },
    {
      deptSlug: 'pediatrics',
      name: 'Dr. Shivdas Mirkad',
      designation: 'Director & Consultant Pediatrician',
      qualifications: 'MBBS, MD, DCH',
      specialty: 'Neonatal Intensive Care, Child Growth & Vaccinations',
      experienceYears: 16,
      consultationFee: 500,
      schedules: [
        { day: 1, start: '10:00', end: '14:00', duration: 30 },
        { day: 2, start: '10:00', end: '14:00', duration: 30 },
        { day: 3, start: '10:00', end: '14:00', duration: 30 },
        { day: 4, start: '10:00', end: '14:00', duration: 30 },
        { day: 5, start: '10:00', end: '14:00', duration: 30 },
        { day: 6, start: '10:00', end: '14:00', duration: 30 },
      ],
    },
    {
      deptSlug: 'orthopedics',
      name: 'Dr. Nishant Goyal',
      designation: 'Director & Consultant Orthopedic Surgeon',
      qualifications: 'MBBS, DNB, D. Ortho',
      specialty: 'Trauma Care, Knee/Hip Replacement, Arthroscopy',
      experienceYears: 15,
      consultationFee: 500,
      schedules: [
        { day: 1, start: '11:00', end: '16:00', duration: 30 },
        { day: 2, start: '11:00', end: '16:00', duration: 30 },
        { day: 3, start: '11:00', end: '16:00', duration: 30 },
        { day: 4, start: '11:00', end: '16:00', duration: 30 },
        { day: 5, start: '11:00', end: '16:00', duration: 30 },
        { day: 6, start: '11:00', end: '16:00', duration: 30 },
      ],
    },
    {
      deptSlug: 'internal-medicine',
      name: 'Dr. Kailash Rajguru',
      designation: 'Director & Consultant Physician',
      qualifications: 'MBBS, MD (Medicine)',
      specialty: 'Diabetes, Hypertension & Critical Illness',
      experienceYears: 17,
      consultationFee: 400,
      schedules: [
        { day: 1, start: '09:00', end: '14:00', duration: 30 },
        { day: 2, start: '09:00', end: '14:00', duration: 30 },
        { day: 3, start: '09:00', end: '14:00', duration: 30 },
        { day: 4, start: '09:00', end: '14:00', duration: 30 },
        { day: 5, start: '09:00', end: '14:00', duration: 30 },
        { day: 6, start: '09:00', end: '14:00', duration: 30 },
      ],
    },
    {
      deptSlug: 'obstetrics-gynecology',
      name: 'Dr. Anshul (Pahawa) Goyal',
      designation: 'Consultant Obstetrician & Gynecologist',
      qualifications: 'MBBS, DNB, DGO',
      specialty: 'High-Risk Pregnancy, Infertility & Laparoscopic Gyn Surgery',
      experienceYears: 12,
      consultationFee: 500,
      schedules: [
        { day: 1, start: '10:00', end: '15:00', duration: 30 },
        { day: 2, start: '10:00', end: '15:00', duration: 30 },
        { day: 3, start: '10:00', end: '15:00', duration: 30 },
        { day: 4, start: '10:00', end: '15:00', duration: 30 },
        { day: 5, start: '10:00', end: '15:00', duration: 30 },
        { day: 6, start: '10:00', end: '15:00', duration: 30 },
      ],
    },
    {
      deptSlug: 'general-surgery',
      name: 'Dr. Millind Katole',
      designation: 'Consultant General Surgeon',
      qualifications: 'MBBS, MS (General Surgery)',
      specialty: 'Hernia, Appendix, Gallbladder & Laparoscopic Surgeries',
      experienceYears: 14,
      consultationFee: 500,
      schedules: [
        { day: 1, start: '10:00', end: '14:00', duration: 30 },
        { day: 2, start: '10:00', end: '14:00', duration: 30 },
        { day: 3, start: '10:00', end: '14:00', duration: 30 },
        { day: 4, start: '10:00', end: '14:00', duration: 30 },
        { day: 5, start: '10:00', end: '14:00', duration: 30 },
        { day: 6, start: '10:00', end: '14:00', duration: 30 },
      ],
    },
  ];

  for (const docData of doctorsData) {
    const deptId = createdDepts[docData.deptSlug];
    if (!deptId) continue;

    const existing = await prisma.doctor.findFirst({
      where: { hospitalId: hospital.id, name: docData.name },
    });

    let doctorId = existing?.id;

    if (!existing) {
      const doc = await prisma.doctor.create({
        data: {
          hospitalId: hospital.id,
          departmentId: deptId,
          name: docData.name,
          designation: docData.designation,
          qualifications: docData.qualifications,
          specialty: docData.specialty,
          experienceYears: docData.experienceYears,
          consultationFee: docData.consultationFee,
          isActive: true,
        },
      });
      doctorId = doc.id;
    }

    if (doctorId) {
      for (const s of docData.schedules) {
        await prisma.doctorSchedule.upsert({
          where: {
            doctorId_dayOfWeek_startTime: {
              doctorId,
              dayOfWeek: s.day,
              startTime: s.start,
            },
          },
          update: {},
          create: {
            doctorId,
            dayOfWeek: s.day,
            startTime: s.start,
            endTime: s.end,
            slotDurationMins: s.duration,
            isActive: true,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${doctorsData.length} verified doctors with weekly schedule rules`);

  // 5. Seed Hospital Settings
  const settingsData = [
    { key: 'EMERGENCY_HOTLINE', value: '+91-75073-42222' },
    { key: 'RECEPTION_PHONE', value: '02482-223322' },
    { key: 'MJPJAY_ACTIVE', value: 'true' },
    { key: 'AMBULANCE_24X7', value: 'true' },
    { key: 'ONLINE_BOOKING_ENABLED', value: 'true' },
  ];

  for (const setting of settingsData) {
    await prisma.hospitalSetting.upsert({
      where: {
        hospitalId_key: {
          hospitalId: hospital.id,
          key: setting.key,
        },
      },
      update: { value: setting.value },
      create: {
        hospitalId: hospital.id,
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log(`✅ Seeded default hospital configuration parameters`);

  console.log('🎉 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
