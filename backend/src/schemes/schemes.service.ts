import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export type SchemeType = 'MJPJAY' | 'AYUSHMAN_BHARAT' | 'EMPLOYEE_STATE_INSURANCE' | 'CASHLESS_TPA';
export type ClaimStatus = 'PENDING' | 'PRE_AUTHORIZED' | 'IN_TREATMENT' | 'SUBMITTED' | 'SETTLED' | 'REJECTED';

export interface SchemeClaimRecord {
  id: string;
  hospitalId: string;
  schemeType: SchemeType;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  aadhaarLast4: string;
  rationCardNumber?: string;
  ayushmanCardNumber?: string;
  insurerName?: string;
  tpaName?: string;
  diagnosisDescription: string;
  estimatedAmount: number;
  status: ClaimStatus;
  arogyaMitraId?: string;
  preAuthorizationId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class SchemesService {
  private readonly logger = new Logger(SchemesService.name);

  private claims: SchemeClaimRecord[] = [
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      schemeType: 'MJPJAY',
      patientName: 'Ramabai Shinde',
      patientPhone: '9823001122',
      patientAge: 54,
      aadhaarLast4: '7823',
      rationCardNumber: 'MH/JLN/2019/0042831',
      ayushmanCardNumber: undefined,
      insurerName: undefined,
      tpaName: undefined,
      diagnosisDescription: 'Total Knee Replacement — Right Knee Severe Osteoarthritis',
      estimatedAmount: 45000,
      status: 'PRE_AUTHORIZED',
      arogyaMitraId: 'ARMT/JLN/0291',
      preAuthorizationId: 'MJPJAY/PREAUTH/2026/08/00821',
      remarks: 'Pre-authorization approved by NIC. Procedure scheduled in OT-2.',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      schemeType: 'AYUSHMAN_BHARAT',
      patientName: 'Pandurang Jadhav',
      patientPhone: '9011334455',
      patientAge: 67,
      aadhaarLast4: '2341',
      rationCardNumber: undefined,
      ayushmanCardNumber: 'AB/MH/2021/10039482',
      diagnosisDescription: 'Emergency Laparoscopic Cholecystectomy — Acute Cholecystitis',
      estimatedAmount: 38000,
      status: 'SETTLED',
      arogyaMitraId: 'ARMT/JLN/0312',
      preAuthorizationId: 'ABPMJAY/2026/JLN/00213',
      remarks: 'Claim settled fully. Patient discharged on Day 4.',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      schemeType: 'CASHLESS_TPA',
      patientName: 'Suresh Kulkarni',
      patientPhone: '9834112233',
      patientAge: 44,
      aadhaarLast4: '5611',
      insurerName: 'United India Insurance',
      tpaName: 'Medi Assist India TPA',
      diagnosisDescription: 'PTCA with Stenting — Single Vessel CAD',
      estimatedAmount: 120000,
      status: 'IN_TREATMENT',
      preAuthorizationId: 'UIIC/MEDI/2026/JLN/0029',
      remarks: 'Pre-auth for ₹1.2L approved. Patient in ICU post-procedure.',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * GET: All Claims (Admin view)
   */
  async getAllClaims(hospitalId?: string, schemeType?: SchemeType) {
    let result = this.claims;
    if (hospitalId) result = result.filter((c) => c.hospitalId === hospitalId);
    if (schemeType) result = result.filter((c) => c.schemeType === schemeType);
    return result;
  }

  /**
   * POST: Register New Government Scheme Claim
   */
  async registerClaim(dto: {
    schemeType: SchemeType;
    patientName: string;
    patientPhone: string;
    patientAge: number;
    aadhaarLast4: string;
    rationCardNumber?: string;
    ayushmanCardNumber?: string;
    insurerName?: string;
    tpaName?: string;
    diagnosisDescription: string;
    estimatedAmount: number;
  }) {
    const claim: SchemeClaimRecord = {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      ...dto,
      status: 'PENDING',
      arogyaMitraId: `ARMT/JLN/${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.claims.unshift(claim);
    this.logger.log(`New ${dto.schemeType} claim registered for ${dto.patientName}: ${claim.id}`);

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: 'SCHEME_CLAIM_REGISTERED',
      entity: 'SCHEME_CLAIM',
      entityId: claim.id,
      metadata: { schemeType: dto.schemeType, patientName: dto.patientName, amount: dto.estimatedAmount },
    });

    return claim;
  }

  /**
   * PATCH: Update Claim Status (Admin)
   */
  async updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    remarks?: string,
    preAuthorizationId?: string,
  ) {
    const claim = this.claims.find((c) => c.id === claimId);
    if (!claim) throw new Error(`Claim ${claimId} not found`);

    claim.status = status;
    claim.updatedAt = new Date().toISOString();
    if (remarks) claim.remarks = remarks;
    if (preAuthorizationId) claim.preAuthorizationId = preAuthorizationId;

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: 'SCHEME_CLAIM_STATUS_UPDATED',
      entity: 'SCHEME_CLAIM',
      entityId: claimId,
      metadata: { newStatus: status, remarks },
    });

    return claim;
  }

  /**
   * GET: Scheme Stats for Admin Dashboard
   */
  getStats() {
    return {
      total: this.claims.length,
      pending: this.claims.filter((c) => c.status === 'PENDING').length,
      preAuthorized: this.claims.filter((c) => c.status === 'PRE_AUTHORIZED').length,
      inTreatment: this.claims.filter((c) => c.status === 'IN_TREATMENT').length,
      settled: this.claims.filter((c) => c.status === 'SETTLED').length,
      rejected: this.claims.filter((c) => c.status === 'REJECTED').length,
      mjpjayClaims: this.claims.filter((c) => c.schemeType === 'MJPJAY').length,
      ayushmanClaims: this.claims.filter((c) => c.schemeType === 'AYUSHMAN_BHARAT').length,
      tpaClaims: this.claims.filter((c) => c.schemeType === 'CASHLESS_TPA').length,
      totalEstimatedAmount: this.claims.reduce((sum, c) => sum + c.estimatedAmount, 0),
    };
  }

  /**
   * GET: MJPJAY Eligible Procedures (Public Information)
   */
  getMjpjayProcedures() {
    return {
      schemeInfo: {
        name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
        governingAuthority: 'Government of Maharashtra',
        coverageLimit: '₹1,50,000 per family per year (₹2,50,000 for critical illnesses)',
        eligibility: 'Yellow / Orange Ration Card holders and ANTYODAYA families in Maharashtra',
        disclaimer:
          'Eligibility, coverage, and treatment availability are governed by applicable scheme rules and subject to Arogya Mitra pre-authorization. This information is for guidance only.',
      },
      eligibleCategories: [
        {
          category: 'Cardiac & Cardiovascular Surgery',
          procedures: ['PTCA with Stenting', 'Open Heart Bypass (CABG)', 'Valve Replacement', 'Pacemaker Implantation'],
        },
        {
          category: 'Orthopedics & Trauma',
          procedures: ['Total Knee Replacement', 'Total Hip Replacement', 'Spinal Fusion', 'Complex Fracture Fixation'],
        },
        {
          category: 'General & Laparoscopic Surgery',
          procedures: ['Laparoscopic Cholecystectomy', 'Appendectomy', 'Hernia Repair', 'Colostomy'],
        },
        {
          category: 'Obstetrics & Gynecology',
          procedures: ['Caesarean Section', 'Hysterectomy', 'High-Risk Pregnancy Management', 'Ovarian Cystectomy'],
        },
        {
          category: 'Neonatal & Pediatric Care',
          procedures: ['NICU Neonatal Intensive Care', 'Pediatric Emergency Surgery', 'Congenital Defect Correction'],
        },
        {
          category: 'Critical Care & Intensive Care',
          procedures: ['ICU Ventilator Management (up to 14 days)', 'Sepsis & Multi-Organ Failure', 'Renal Dialysis'],
        },
      ],
      documentChecklist: [
        { item: 'Yellow or Orange Ration Card (mandatory)', required: true },
        { item: 'Aadhaar Card of Patient & Family Head', required: true },
        { item: "Referring Doctor's Prescription & Clinical Summary", required: true },
        { item: 'Hospital Pre-Authorization from Arogya Mitra', required: true },
        { item: 'MJPJAY Smart Card (if issued)', required: false },
        { item: 'Income Certificate below ₹1 Lakh per annum', required: false },
      ],
      process: [
        { step: 1, title: 'Visit Arogya Mitra Desk', description: 'Report to the Sanjeevani Hospital MJPJAY Arogya Mitra desk on the ground floor near main reception with all documents.' },
        { step: 2, title: 'Eligibility Verification', description: 'Arogya Mitra verifies ration card, Aadhaar, and scheme eligibility using the NIC government portal.' },
        { step: 3, title: 'Online Pre-Authorization', description: 'Treating doctor submits pre-authorization request with diagnosis and procedure codes via the MJPJAY government portal.' },
        { step: 4, title: 'Pre-Auth Approval', description: 'Government insurance company approves pre-authorization (typically within 2–4 hours for emergencies, 1 working day for planned procedures).' },
        { step: 5, title: 'Cashless Treatment', description: 'Patient receives complete cashless treatment at Sanjeevani Hospital at no cost up to the approved limit.' },
        { step: 6, title: 'Claim Settlement', description: 'Hospital submits claim to the insurer post-discharge. Settlement directly to hospital account within 30 days.' },
      ],
    };
  }

  /**
   * GET: Insurance TPA Cashless Workflow (Public Information)
   */
  getInsuranceInfo() {
    return {
      panelInsurers: [
        'United India Insurance Company',
        'New India Assurance Company',
        'Oriental Insurance Company',
        'Star Health & Allied Insurance',
        'HDFC ERGO Health Insurance',
        'Niva Bupa Health Insurance',
        'Care Health Insurance',
        'ICICI Lombard General Insurance',
        'Bajaj Allianz General Insurance',
        'National Insurance Company',
      ],
      tpaPartners: [
        'Medi Assist India TPA Pvt. Ltd.',
        'MD India Healthcare Services TPA',
        'Good Health Insurance TPA Ltd.',
        'Paramount TPA Pvt. Ltd.',
        'Vidal Health TPA Private Limited',
        'Health India TPA Services Pvt. Ltd.',
        'Raksha TPA Pvt. Ltd.',
      ],
      cashlessProcess: [
        { step: 1, title: 'Inform TPA Desk at Admission', description: 'On arrival, visit the hospital Insurance / TPA Desk with your health insurance card and photo ID.' },
        { step: 2, title: 'Pre-Authorization Request', description: 'The hospital submits a pre-authorization request to your TPA/insurer with clinical summary, diagnosis, and estimated cost.' },
        { step: 3, title: 'TPA Approval (2–8 Hours)', description: 'The TPA/insurer reviews and approves the cashless request. Emergency approvals are typically fast-tracked within 2 hours.' },
        { step: 4, title: 'Cashless Treatment Begins', description: 'Once approved, you receive complete treatment without upfront payment up to the approved authorization limit.' },
        { step: 5, title: 'Discharge Formalities', description: 'Hospital raises the final claim with treatment summary and bills to the TPA. You only pay for non-covered items (if any).' },
        { step: 6, title: 'Direct Claim Settlement', description: 'The insurer settles the approved claim amount directly to Sanjeevani Hospital within the statutory claim period.' },
      ],
      documentsRequired: [
        'Health Insurance Policy Card / Health Insurance Policy Document',
        'Aadhaar Card or Passport (Photo ID)',
        "Doctor's Referral Letter / OPD Prescription",
        'Investigation Reports (Blood tests, X-Ray, Scan) if available',
        'Previous Hospitalization Records related to current illness (if any)',
        'TPA / Insurance Company Pre-Authorization Letter',
      ],
      tpaDeskTimings: 'Monday to Saturday: 09:00 AM to 06:00 PM. Emergency submissions: 24x7 on-call.',
      helpline: '+91-75073-42222 | 02482-223322',
      disclaimer: 'Coverage eligibility, sum insured limits, co-payment clauses, and exclusions are governed solely by your health insurance policy terms. Sanjeevani Hospital facilitates the cashless process but does not guarantee insurer approval.',
    };
  }
}
