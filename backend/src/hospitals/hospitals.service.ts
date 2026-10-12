import { Injectable } from '@nestjs/common';
import { HOSPITAL } from '../config/hospital.config';

@Injectable()
export class HospitalsService {
  getHospitalProfile() {
    return {
      id: HOSPITAL.id,
      name: HOSPITAL.name,
      slug: HOSPITAL.slug,
      tagline: HOSPITAL.tagline,
      establishedYear: HOSPITAL.establishedYear,
      address: {
        line: HOSPITAL.addressLine,
        city: HOSPITAL.city,
        state: HOSPITAL.state,
        pincode: HOSPITAL.pincode,
        country: 'India',
        coordinates: {
          latitude: 19.8295,
          longitude: 75.8752,
        },
      },
      contacts: {
        reception: HOSPITAL.helpline,
        landline: HOSPITAL.landline,
        emergency: HOSPITAL.helpline,
        email: HOSPITAL.email,
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
