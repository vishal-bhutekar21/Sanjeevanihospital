// Real photos of Sanjeevani Hospital, stored in /public/images/hospital
// so they keep working even if the old website changes.
const p = (name: string) => `/images/hospital/${name}.webp`;

export const PHOTOS = {
  building: p('jalna-building-exterior'),
  banner: p('banner'),
  reception: p('reception-desk'),
  staffTeam: p('staff-team-photo'),
  casualty: p('casualty-emergency-ward'),
  cardiacUnit: p('cardiac-care-unit'),
  cathLabTeam: p('cath-lab-cardiac-team'),
  cardiacSurgery: p('cardiac-surgery-in-progress'),
  operationTheatre: p('operation-theatre'),
  otTeam: p('operation-theatre-surgical-team'),
  surgery: p('surgery-procedure-in-progress'),
  nicu: p('nicu-neonatal-intensive-care'),
  picu: p('picu-pediatric-intensive-care'),
  pathologyLab: p('pathology-lab'),
  pharmacy: p('pharmacy-counter'),
  billing: p('billing-cash-counter'),
} as const;

export type PhotoKey = keyof typeof PHOTOS;

// Captions for gallery use
export const GALLERY: { key: PhotoKey; en: string; mr: string }[] = [
  { key: 'building', en: 'Hospital building, Ambad Choufuli', mr: 'हॉस्पिटल इमारत, अंबड चौफुली' },
  { key: 'reception', en: 'Main reception', mr: 'मुख्य स्वागत कक्ष' },
  { key: 'casualty', en: 'Casualty and emergency ward', mr: 'आपत्कालीन विभाग' },
  { key: 'cardiacUnit', en: 'Cardiac care unit', mr: 'हृदयरोग अतिदक्षता विभाग' },
  { key: 'nicu', en: 'Neonatal ICU (NICU)', mr: 'नवजात शिशु अतिदक्षता (NICU)' },
  { key: 'picu', en: 'Paediatric ICU (PICU)', mr: 'बालरोग अतिदक्षता (PICU)' },
  { key: 'operationTheatre', en: 'Modular operation theatre', mr: 'मॉड्युलर शस्त्रक्रिया गृह' },
  { key: 'otTeam', en: 'Surgical team in the OT', mr: 'शस्त्रक्रिया पथक' },
  { key: 'cathLabTeam', en: 'Cath lab team', mr: 'कॅथ लॅब पथक' },
  { key: 'pathologyLab', en: 'Pathology laboratory', mr: 'पॅथॉलॉजी प्रयोगशाळा' },
  { key: 'pharmacy', en: 'Sanjeevani Pharma, in-house pharmacy', mr: 'संजीवनी फार्मा, औषध विभाग' },
  { key: 'staffTeam', en: 'Our staff', mr: 'आमचा कर्मचारी वर्ग' },
];
