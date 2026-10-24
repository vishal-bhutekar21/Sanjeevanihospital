/**
 * HOSPITAL DETAILS — the one place to change the hospital's name, phones,
 * email, address, hours and map for a new hospital.
 *
 * Every page, the header/footer, the admin panel and the PDF token slip read
 * from this object. See documentation/02-rebrand-checklist.md for the full
 * rebrand steps (doctors, photos, departments, backend config, index.html).
 *
 * Rules:
 *  - Keep both English and Marathi (`…Mr`) values filled in.
 *  - `tel` values are digits with country code and a leading "+", no spaces.
 *  - `whatsapp` is digits only with country code (used in https://wa.me/<digits>).
 */

/** A phone number as shown on the site and as dialled. */
export interface PhoneNumber {
  /** Shown with country code, e.g. "+91 75073 42222". */
  display: string;
  /** Used in tel: links, e.g. "+917507342222". */
  tel: string;
}

/** The main numbers also appear in a short form (no country code) in English and Marathi digits. */
export interface MainPhoneNumber extends PhoneNumber {
  /** e.g. "75073 42222" */
  short: string;
  /** Same number in Marathi (Devanagari) digits, e.g. "७५०७३ ४२२२२" */
  shortMr: string;
}

export interface Bilingual {
  en: string;
  mr: string;
}

export interface HospitalConfig {
  name: string;
  nameMr: string;
  shortName: string;
  shortNameMr: string;
  /** One word used in file names and short labels (admin sidebar, "OPD paper", PDF file name). */
  brand: string;
  brandMr: string;
  /** Kind of hospital, shown under the name in the header ("Multispeciality · Jalna"). */
  kind: Bilingual;
  tagline: string;
  city: string;
  cityMr: string;
  state: string;
  pincode: string;
  /** Area + city, used in the header strip and short sentences. */
  locality: Bilingual;
  address: {
    /** Contact page, first line. */
    line1: string;
    /** Contact page, second line. */
    line2: string;
    /** Full address in one line (footer, admin settings). */
    en: string;
    mr: string;
    /** Short address without state/pincode (home page photo caption, booking confirmation). */
    short: string;
    shortMr: string;
    /** Address under the hospital name on the PDF token slip. */
    letterhead: string;
    /** Address block (two lines) on the home page "Find us" card. */
    homeLines: [string, string];
  };
  phones: {
    /** 24-hour emergency line. Shown in the header, footer, contact page, slip. */
    emergency: MainPhoneNumber;
    /** Reception / OPD enquiries (and the default contact number for camps). */
    reception: MainPhoneNumber;
    /** WhatsApp number, digits only with country code (offline booking requests). */
    whatsapp: string;
    ambulance: PhoneNumber;
    /** MJPJAY / Arogya Mitra desk (contact page). */
    mjpjay: PhoneNumber;
    /** Cashless insurance / TPA desk (contact page). */
    tpa: PhoneNumber;
    /** Administration office (contact page). */
    admin: PhoneNumber;
  };
  emails: {
    /** Shown on the contact page. */
    main: string;
    /** Shown in the footer. For a new hospital, usually the same as `main`. */
    footer: string;
  };
  opdHours: {
    /** Header top strip. */
    en: string;
    mr: string;
    /** PDF token slip footer. */
    short: string;
    shortMr: string;
    /** Footer, three lines: days / morning / evening. */
    days: Bilingual;
    morning: Bilingual;
    evening: Bilingual;
    /** Contact page "Opening hours" table. */
    contactMorning: string;
    contactEvening: string;
    emergency: Bilingual;
  };
  /** "Get directions" link. */
  mapsUrl: string;
  /** Google Maps <iframe> src (Google Maps → Share → Embed a map → copy the src="…" value). */
  mapEmbedUrl: string;
  foundedYear: number;
  /** Government schemes / panels the hospital is empanelled with. */
  empanelments: { code: string; en: string; mr: string }[];
  /** Logo in /public. Also the browser tab icon (set in index.html). */
  logo: string;
  /** Website domain without https://, e.g. "sanjeevanihosp.in". */
  website: string;
  /** Booking server address used by the live site when VITE_API_URL is not set (must end in /api) */
  apiBaseUrl: string;
  /** GST number on PDFs (slips, case sheets). Keep in step with HOSPITAL_GSTIN in worker/wrangler.toml. */
  gstin: string;
  booking: {
    /**
     * Testing switch: every doctor can be booked every day between these hours,
     * even when the booking server can't be reached. Set to false before going
     * live (and BOOKING_OPEN_ALL_DOCTORS=false on the server).
     */
    openAllDoctors: boolean;
    openFrom: string; // "HH:mm", 24-hour
    openTo: string;
  };
}

export const HOSPITAL: HospitalConfig = {
  name: 'Sanjeevani Multispeciality Hospital',
  nameMr: 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल',
  shortName: 'Sanjeevani Hospital',
  shortNameMr: 'संजीवनी हॉस्पिटल',
  brand: 'Sanjeevani',
  brandMr: 'संजीवनी',
  kind: { en: 'Multispeciality', mr: 'मल्टिस्पेशालिटी' },
  tagline: 'Healing body, mind & spirit',
  city: 'Jalna',
  cityMr: 'जालना',
  state: 'Maharashtra',
  pincode: '431203',
  locality: { en: 'Ambad Choufuli, Jalna', mr: 'अंबड चौफुली, जालना' },

  address: {
    line1: 'Plot No. 17, Rishi Park, Ambad Choufuli',
    line2: 'Jalna, Maharashtra 431203',
    en: 'Plot No. 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra 431203',
    mr: 'प्लॉट नं. १७, ऋषी पार्क, अंबड चौफुली, जालना, महाराष्ट्र ४३१२०३',
    short: 'Plot 17, Rishi Park, Ambad Choufuli, Jalna',
    shortMr: 'प्लॉट १७, ऋषी पार्क, अंबड चौफुली, जालना',
    letterhead: 'Plot 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra 431203',
    homeLines: ['Plot No. 17, Rishi Park, Ambad Road', 'Ambad Choufuli, Jalna, Maharashtra 431203'],
  },

  phones: {
    emergency: { display: '+91 75073 42222', tel: '+917507342222', short: '75073 42222', shortMr: '७५०७३ ४२२२२' },
    reception: { display: '+91 75073 42222', tel: '+917507342222', short: '75073 42222', shortMr: '७५०७३ ४२२२२' },
    whatsapp: '917507342222',
    ambulance: { display: '+91 88305 18080', tel: '+918830518080' },
    mjpjay: { display: '+91 82089 65820', tel: '+918208965820' },
    tpa: { display: '+91 91460 22490', tel: '+919146022490' },
    admin: { display: '+91 96876 09046', tel: '+919687609046' },
  },

  // Note: the current site uses two addresses. Confirm with the hospital which is right.
  emails: {
    main: 'sanjeevanihospjalna@gmail.com',
    footer: 'sanjeevanijalna@gmail.com',
  },

  // Hospital-wide hours. Each doctor's own OPD hours live in data/doctorsData.ts
  // and in the backend (appointments/schedules.ts + admin "OPD timings").
  // Note: the contact page currently says morning OPD ends at 3 pm; the header,
  // footer and slip say 1 pm. Confirm with the hospital.
  opdHours: {
    en: 'OPD: 9 am – 1 pm, 5 – 8 pm',
    mr: 'ओपीडी: सकाळी ९–१, संध्या. ५–८',
    short: 'OPD 9 am–1 pm, 5–8 pm',
    shortMr: 'ओपीडी सकाळी ९–१, संध्या. ५–८',
    days: { en: 'Mon – Sat', mr: 'सोम–शनि' },
    morning: { en: '9 am – 1 pm', mr: 'सकाळी ९ ते १' },
    evening: { en: '5 pm – 8 pm', mr: 'संध्याकाळी ५ ते ८' },
    contactMorning: '9:00 am – 3:00 pm',
    contactEvening: '5:00 pm – 8:00 pm',
    emergency: { en: '24 hours, every day', mr: '२४ तास, दररोज' },
  },

  mapsUrl: 'https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.482025734346!2d75.87321277598858!3d19.83965932757277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bda574d6cfa92ff%3A0x6b30c144577884ff!2sAmbad%20Choufuli%2C%20Jalna%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',

  foundedYear: 2016,
  empanelments: [
    { code: 'MJPJAY', en: 'Mahatma Jyotirao Phule Jan Arogya Yojana', mr: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना' },
    { code: 'PMJAY', en: 'Ayushman Bharat (PM-JAY)', mr: 'आयुष्मान भारत (PM-JAY)' },
  ],
  logo: '/logo.png',
  website: 'sanjeevanihosp.in',
  // Hospital API on Cloudflare Workers (worker/). VITE_API_URL on Netlify overrides it.
  apiBaseUrl: 'https://sanjeevani-api.vishalbhutekar33772.workers.dev/api',
  // SAMPLE GSTIN in the standard format (27 = Maharashtra). Replace with the hospital's real one.
  gstin: '27AAAAA0000A1Z5',
  booking: {
    openAllDoctors: true,
    openFrom: '08:00',
    openTo: '22:00',
  },
};
