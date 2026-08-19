import { Injectable } from '@nestjs/common';

@Injectable()
export class HospitalsService {
  getHospitalProfile() {
    return {
      id: 'hosp-sanjeevani-jalna',
      name: 'Sanjeevani Multispeciality Hospital',
      slug: 'sanjeevani-jalna',
      tagline: 'Comprehensive healthcare, closer to you.',
      establishedYear: 2016,
      address: {
        line: 'Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli',
        city: 'Jalna',
        state: 'Maharashtra',
        pincode: '431203',
        country: 'India',
        coordinates: {
          latitude: 19.8295,
          longitude: 75.8752,
        },
      },
      contacts: {
        reception: '+91-75073-42222',
        landline: '02482-223322',
        emergency: '+91-75073-42222',
        email: 'admin@sanjeevanihosp.in',
      },
      timings: {
        opdMorning: '09:00 AM – 03:00 PM',
        opdEvening: '05:00 PM – 08:00 PM',
        emergency: '24 Hours / 7 Days a Week',
      },
      verificationStatus: 'VERIFIED_RESEARCH_BASELINE',
    };
  }
}
