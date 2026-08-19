import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface PatientReviewRecord {
  id: string;
  hospitalId: string;
  patientName: string;
  patientLocation?: string;
  rating: number;
  reviewText: string;
  doctorId?: string;
  doctorName?: string;
  department?: string;
  treatmentType?: string;
  status: ReviewStatus;
  moderationNote?: string;
  isVerifiedPatient: boolean;
  helpfulCount: number;
  source: 'DIRECT' | 'GOOGLE' | 'PRACTO' | 'JUSTDIAL';
  createdAt: string;
  updatedAt: string;
}

export interface HospitalEventRecord {
  id: string;
  hospitalId: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  category: 'HEALTH_CAMP' | 'AWARENESS_SEMINAR' | 'FREE_CHECKUP' | 'VACCINATION_DRIVE' | 'DIAGNOSTIC_CAMP' | 'CME';
  organizer: string;
  featuredDoctor?: string;
  registrationRequired: boolean;
  registrationPhone?: string;
  isFree: boolean;
  status: EventStatus;
  attendeesCount: number;
  imageUrl?: string;
  createdAt: string;
}

@Injectable()
export class ReviewsEventsService {
  private readonly logger = new Logger(ReviewsEventsService.name);

  // ─── Seed Data ────────────────────────────────────────────────────────────

  private reviews: PatientReviewRecord[] = [
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: 'Sunil Jadhav',
      patientLocation: 'Jalna City',
      rating: 5,
      reviewText: 'Dr. Nishant Goyal operated on my mother\'s knee fracture brilliantly. The post-operative ICU nursing and physiotherapy support was very attentive. The MJPJAY scheme support made it affordable. Highly recommend Sanjeevani Hospital.',
      doctorId: 'doc-goyal',
      doctorName: 'Dr. Nishant Goyal',
      department: 'Orthopedics & Joint Replacement',
      treatmentType: 'Total Knee Replacement',
      status: 'APPROVED',
      isVerifiedPatient: true,
      helpfulCount: 18,
      source: 'GOOGLE',
      createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: 'Pooja Kulkarni',
      patientLocation: 'Ambad Taluka',
      rating: 5,
      reviewText: 'Dr. Shivdas Mirkad is wonderful with children. He explained my daughter\'s asthma condition patiently and in Marathi so we could understand perfectly. Truly grateful to have such high-quality pediatric care in Jalna.',
      doctorId: 'doc-mirkad',
      doctorName: 'Dr. Shivdas Mirkad',
      department: 'Pediatrics & Neonatology',
      treatmentType: 'Pediatric Asthma Management',
      status: 'APPROVED',
      isVerifiedPatient: true,
      helpfulCount: 12,
      source: 'GOOGLE',
      createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 19 * 24 * 3600000).toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: 'Anand Shinde',
      patientLocation: 'Partur Taluka',
      rating: 5,
      reviewText: 'Prompt emergency response when my father had acute breathing distress at 2 AM. The 24×7 ICU facility and Dr. Bagal\'s resuscitation team saved his life. Billing was transparent, staff was supportive throughout.',
      doctorId: 'doc-bagal',
      doctorName: 'Dr. Baliram Bagal',
      department: 'ICU & Critical Care',
      treatmentType: 'Emergency ICU Resuscitation',
      status: 'APPROVED',
      isVerifiedPatient: true,
      helpfulCount: 24,
      source: 'PRACTO',
      createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 9 * 24 * 3600000).toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: 'Meena Patil',
      patientLocation: 'Jalna District',
      rating: 5,
      reviewText: 'Dr. Anshul Goyal helped me through my high-risk pregnancy with great care and expertise. I had a healthy baby boy here at Sanjeevani. The maternity ward nurses were very kind and supportive.',
      doctorId: 'doc-anshul',
      doctorName: 'Dr. Anshul Goyal',
      department: 'Obstetrics & Gynecology',
      treatmentType: 'High-Risk Pregnancy & Delivery',
      status: 'APPROVED',
      isVerifiedPatient: true,
      helpfulCount: 31,
      source: 'DIRECT',
      createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: 'Ramesh Pawar',
      patientLocation: 'Badnapur',
      rating: 4,
      reviewText: 'Good hospital with experienced doctors. Waiting time can be a bit long during rush hours but the quality of care is very good. The OT facility is modern and clean. Would recommend.',
      doctorId: 'doc-katole',
      doctorName: 'Dr. Millind Katole',
      department: 'General & Laparoscopic Surgery',
      treatmentType: 'Laparoscopic Hernia Repair',
      status: 'APPROVED',
      isVerifiedPatient: true,
      helpfulCount: 9,
      source: 'GOOGLE',
      createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 29 * 24 * 3600000).toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: 'Sanjay Deshmukh',
      patientLocation: 'Mantha Taluka',
      rating: 5,
      reviewText: 'MJPJAY scheme was handled very smoothly by the Arogya Mitra at Sanjeevani. I didn\'t have to pay anything for my father\'s surgery. Staff explained everything clearly. Amazing public service.',
      doctorId: undefined,
      doctorName: undefined,
      department: 'MJPJAY Scheme',
      treatmentType: 'Government Scheme Cashless Surgery',
      status: 'PENDING',
      isVerifiedPatient: false,
      helpfulCount: 0,
      source: 'DIRECT',
      createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    },
  ];

  private events: HospitalEventRecord[] = [
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: 'Free Orthopedic & Bone Mineral Density (BMD) Screening Camp',
      titleMr: 'मोफत हाडे व सांधे तपासणी शिबिर',
      description: 'Free clinical consultations with Dr. Nishant Goyal and complimentary digital BMD (Bone Mineral Density) testing for joint disorders and osteoporosis screening for Jalna residents.',
      descriptionMr: 'डॉ. निशांत गोयल यांच्याद्वारे सांधेदुखी व हाडांच्या घनतेची (BMD) मोफत तपासणी. जालना जिल्ह्यातील नागरिकांसाठी मोफत.',
      eventDate: '2026-08-30',
      eventTime: '09:00 AM – 01:00 PM',
      venue: 'OPD Complex, Sanjeevani Multispeciality Hospital, Jalna',
      category: 'HEALTH_CAMP',
      organizer: 'Sanjeevani Hospital Orthopedics Department',
      featuredDoctor: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      registrationRequired: false,
      registrationPhone: '+91-75073-42222',
      isFree: true,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: 'Pediatric Growth & Free Immunization Drive',
      titleMr: 'बालकांची वाढ व मोफत लसीकरण मोहीम',
      description: 'Comprehensive developmental screening, pediatric asthma consultation, and complete government-approved immunization schedule review by Dr. Shivdas Mirkad, Pediatrician & Neonatologist.',
      descriptionMr: 'डॉ. शिवदास मिरकड यांच्यासह मुलांची संपूर्ण शारीरिक वाढ तपासणी, दमा सल्ला व सरकारी लसीकरण मोहीम.',
      eventDate: '2026-09-05',
      eventTime: '08:30 AM – 12:30 PM',
      venue: 'Pediatrics OPD Ward, Sanjeevani Hospital',
      category: 'VACCINATION_DRIVE',
      organizer: 'Sanjeevani Hospital Pediatrics Department',
      featuredDoctor: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      registrationRequired: false,
      registrationPhone: '+91-75073-42222',
      isFree: true,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: "Women's Health & Safe Motherhood Awareness Seminar",
      titleMr: 'महिला आरोग्य व सुरक्षित मातृत्व जनजागृती शिबिर',
      description: 'Interactive educational workshop on high-risk pregnancy management, signs of complications, nutritional guidance, laparoscopic gynecological surgical advances and PCOD/PCOS awareness by Dr. Anshul Goyal.',
      descriptionMr: 'डॉ. अंशुल गोयल यांच्याद्वारे गर्भधारणा काळजी, PCOD, लेप्रोस्कोपिक उपचार व सुरक्षित बाळंतपणावर जनजागृती.',
      eventDate: '2026-09-12',
      eventTime: '10:00 AM – 01:00 PM',
      venue: 'Main Conference Hall, Sanjeevani Hospital Campus, Jalna',
      category: 'AWARENESS_SEMINAR',
      organizer: 'Sanjeevani Hospital Obstetrics & Gynecology Department',
      featuredDoctor: 'Dr. Anshul Goyal (MBBS, DNB, DGO)',
      registrationRequired: true,
      registrationPhone: '+91-75073-42222',
      isFree: true,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: 'Diabetes, Blood Pressure & Cardiac Risk Free Diagnostic Camp',
      titleMr: 'मधुमेह, रक्तदाब व हृदयविकार मोफत तपासणी शिबिर',
      description: 'Free blood glucose (HbA1c), blood pressure, BMI, and ECG screening for early detection of diabetes, hypertension, and cardiac risk factors. Conducted by Dr. Kailash Rajguru, Internal Medicine specialist.',
      descriptionMr: 'मधुमेह, रक्तदाब, लठ्ठपणा व हृदयविकाराची मोफत तपासणी. डॉ. कैलाश राजगुरु यांच्या नेतृत्वाखाली.',
      eventDate: '2026-09-20',
      eventTime: '08:00 AM – 12:00 PM',
      venue: 'Hospital Premises & Jalna Municipal Garden',
      category: 'DIAGNOSTIC_CAMP',
      organizer: 'Sanjeevani Hospital Internal Medicine Department & Jalna Municipal Corporation',
      featuredDoctor: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      registrationRequired: false,
      registrationPhone: '+91-75073-42222',
      isFree: true,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: 'MJPJAY Patient Awareness & Eligibility Registration Drive',
      titleMr: 'महात्मा फुले जन आरोग्य योजना जनजागृती व नोंदणी',
      description: 'Arogya Mitra team will assist eligible patients in verifying MJPJAY eligibility, registering yellow/orange ration card holders, and explaining covered procedures for cashless surgery at Sanjeevani Hospital.',
      descriptionMr: 'पिवळ्या व केशरी रेशन कार्डधारक रुग्णांसाठी MJPJAY योजनेची पात्रता तपासणी व मोफत नोंदणी.',
      eventDate: '2026-10-02',
      eventTime: '09:00 AM – 03:00 PM',
      venue: 'Hospital Main Reception Area, Sanjeevani Hospital Jalna',
      category: 'HEALTH_CAMP',
      organizer: 'Sanjeevani Hospital MJPJAY Arogya Mitra Cell',
      featuredDoctor: undefined,
      registrationRequired: false,
      registrationPhone: '+91-75073-42222',
      isFree: true,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: 'Neonatal Resuscitation & Safe Delivery CME Program',
      titleMr: 'नवजात शिशु पुनर्जीवन व सुरक्षित प्रसूती CME कार्यक्रम',
      description: 'Continuing Medical Education (CME) event for nursing staff, MBBS doctors, and paramedics on advanced neonatal resuscitation protocols, ventilator settings, and safe delivery techniques.',
      descriptionMr: 'नर्सिंग स्टाफ व डॉक्टरांसाठी नवजात शिशु CPR, व्हेंटिलेटर व सुरक्षित प्रसूती प्रशिक्षण.',
      eventDate: '2026-10-15',
      eventTime: '09:00 AM – 05:00 PM',
      venue: 'Medical Conference Room, Sanjeevani Hospital',
      category: 'CME',
      organizer: 'Sanjeevani Hospital Medical Education Committee',
      featuredDoctor: 'Dr. Shivdas Mirkad & Dr. Anshul Goyal',
      registrationRequired: true,
      registrationPhone: '+91-75073-42222',
      isFree: false,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // ─────────────────────── REVIEWS ──────────────────────────────────────────

  async getAllReviews(hospitalId?: string, status?: ReviewStatus) {
    let result = this.reviews;
    if (hospitalId) result = result.filter((r) => r.hospitalId === hospitalId);
    if (status) result = result.filter((r) => r.status === status);
    return result;
  }

  async getApprovedReviews() {
    return this.reviews.filter((r) => r.status === 'APPROVED');
  }

  async submitReview(dto: {
    patientName: string;
    patientLocation?: string;
    rating: number;
    reviewText: string;
    doctorId?: string;
    doctorName?: string;
    department?: string;
    treatmentType?: string;
    source?: 'DIRECT' | 'GOOGLE' | 'PRACTO' | 'JUSTDIAL';
  }) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }
    if (dto.reviewText.length < 20) {
      throw new BadRequestException('Review must be at least 20 characters to help other patients.');
    }

    const review: PatientReviewRecord = {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      patientName: dto.patientName,
      patientLocation: dto.patientLocation,
      rating: dto.rating,
      reviewText: dto.reviewText,
      doctorId: dto.doctorId,
      doctorName: dto.doctorName,
      department: dto.department,
      treatmentType: dto.treatmentType,
      status: 'PENDING',
      isVerifiedPatient: false,
      helpfulCount: 0,
      source: dto.source || 'DIRECT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reviews.unshift(review);
    this.logger.log(`New review submitted by ${dto.patientName} (${dto.rating}★) — PENDING moderation`);

    return {
      id: review.id,
      message: 'Thank you for your feedback. Your review has been submitted for moderation and will be published after verification.',
    };
  }

  async moderateReview(reviewId: string, status: ReviewStatus, moderationNote?: string) {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) throw new NotFoundException(`Review ${reviewId} not found`);

    review.status = status;
    review.moderationNote = moderationNote;
    review.updatedAt = new Date().toISOString();

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: `REVIEW_${status}`,
      entity: 'PATIENT_REVIEW',
      entityId: reviewId,
      metadata: { patientName: review.patientName, rating: review.rating, note: moderationNote },
    });

    return review;
  }

  async markHelpful(reviewId: string) {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review || review.status !== 'APPROVED') throw new NotFoundException('Review not found or not published.');
    review.helpfulCount += 1;
    return { helpfulCount: review.helpfulCount };
  }

  getReviewStats() {
    const approved = this.reviews.filter((r) => r.status === 'APPROVED');
    const avgRating = approved.length
      ? approved.reduce((s, r) => s + r.rating, 0) / approved.length
      : 0;
    return {
      totalReviews: this.reviews.length,
      approvedReviews: approved.length,
      pendingModeration: this.reviews.filter((r) => r.status === 'PENDING').length,
      rejectedReviews: this.reviews.filter((r) => r.status === 'REJECTED').length,
      averageRating: Math.round(avgRating * 10) / 10,
      fiveStarCount: approved.filter((r) => r.rating === 5).length,
      fourStarCount: approved.filter((r) => r.rating === 4).length,
      threeStarOrBelow: approved.filter((r) => r.rating <= 3).length,
    };
  }

  // ─────────────────────── EVENTS ───────────────────────────────────────────

  async getAllEvents(status?: EventStatus) {
    let result = [...this.events].sort(
      (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );
    if (status) result = result.filter((e) => e.status === status);
    return result;
  }

  async getUpcomingEvents() {
    return this.events
      .filter((e) => e.status === 'UPCOMING' || e.status === 'ONGOING')
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  async createEvent(dto: Partial<HospitalEventRecord>) {
    const event: HospitalEventRecord = {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      title: dto.title || '',
      titleMr: dto.titleMr || '',
      description: dto.description || '',
      descriptionMr: dto.descriptionMr || '',
      eventDate: dto.eventDate || '',
      eventTime: dto.eventTime || '',
      venue: dto.venue || '',
      category: dto.category || 'HEALTH_CAMP',
      organizer: dto.organizer || 'Sanjeevani Hospital',
      featuredDoctor: dto.featuredDoctor,
      registrationRequired: dto.registrationRequired ?? false,
      registrationPhone: dto.registrationPhone || '+91-75073-42222',
      isFree: dto.isFree ?? true,
      status: 'UPCOMING',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);
    this.logger.log(`New hospital event created: ${event.title} on ${event.eventDate}`);

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: 'EVENT_CREATED',
      entity: 'HOSPITAL_EVENT',
      entityId: event.id,
      metadata: { title: event.title, eventDate: event.eventDate, category: event.category },
    });

    return event;
  }

  async updateEventStatus(eventId: string, status: EventStatus) {
    const event = this.events.find((e) => e.id === eventId);
    if (!event) throw new NotFoundException(`Event ${eventId} not found`);
    event.status = status;
    return event;
  }
}
