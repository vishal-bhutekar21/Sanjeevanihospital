import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartmentsService {
  private readonly departments = [
    {
      id: 'dept-ortho',
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      descriptionEn: 'Advanced arthroplasty, trauma fixation, arthroscopy, and spine care.',
      descriptionMr: 'सांधे प्रत्यारोपण, फ्रॅक्चर उपचार, आणि मणक्याचे आजार.',
      isActive: true,
    },
    {
      id: 'dept-peds',
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology',
      nameMr: 'बालरोग आणि नवजात शिशु काळजी',
      descriptionEn: '24x7 Neonatal ICU (NICU), pediatric critical care, and growth clinic.',
      descriptionMr: 'नवजात शिशु अतिदक्षता विभाग आणि लहान मुलांचे सर्व आजार.',
      isActive: true,
    },
    {
      id: 'dept-gyn',
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      descriptionEn: 'High-risk pregnancy, normal deliveries, and laparoscopic gynecological surgery.',
      descriptionMr: 'सुरक्षित प्रसूती आणि दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      isActive: true,
    },
    {
      id: 'dept-surg',
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'सामान्य आणि दुर्बिणीद्वारे शस्त्रक्रिया',
      descriptionEn: 'Minimally invasive keyhole surgery for appendix, hernia, and gallbladder.',
      descriptionMr: 'हर्निया, अपेंडिक्स व पित्ताशयाची दुर्बिणीद्वारे शस्त्रक्रिया.',
      isActive: true,
    },
    {
      id: 'dept-icu',
      slug: 'icu-critical-care',
      nameEn: 'ICU & Critical Care',
      nameMr: 'अतिदक्षता विभाग आणि क्रिटिकल केअर',
      descriptionEn: 'Multi-organ intensive care and advanced mechanical ventilation.',
      descriptionMr: '२४ तास व्हेंटिलेटर व अतिदक्षता विभाग.',
      isActive: true,
    },
    {
      id: 'dept-med',
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine',
      nameMr: 'सामान्य औषधोपचार विभाग',
      descriptionEn: 'Management of diabetes, hypertension, fever, and infectious ailments.',
      descriptionMr: 'मधुमेह, रक्तदाब व इतर सर्वसाधारण आजारांचे निदान व उपचार.',
      isActive: true,
    },
  ];

  findAll() {
    return this.departments;
  }

  findBySlug(slug: string) {
    return this.departments.find((d) => d.slug === slug);
  }
}
