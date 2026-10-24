/**
 * OPD appointment slip as a real text PDF (A5, selectable and searchable text,
 * small file size), drawn directly with jsPDF the way hospital and lab systems
 * print receipts. A QR code carries the token number for the reception desk.
 *
 * jsPDF's built-in fonts only cover Latin text, so any value in another script
 * (for example a patient name typed in Marathi) is drawn as a sharp image of
 * that one line instead, using the fonts already loaded on the page.
 */

import type { jsPDF as JsPDF } from 'jspdf';
import { HOSPITAL } from '../config/hospital';

export interface SlipData {
  /** confirmed = booked on the server; request = sent to reception, not yet confirmed */
  kind: 'confirmed' | 'request';
  appointmentCode?: string;
  patientName: string;
  patientAge?: number | string;
  patientGender?: string;
  patientPhone: string; // "+91 98765 43210"
  phoneVerified?: boolean;
  town?: string;
  doctorName: string;
  department: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "09:30 AM"
  endTime?: string;
  fee: number; // 0 = not published
  paid: boolean;
  paymentId?: string;
  /** Hospital registration number (UHID), e.g. SMH-P-000123 */
  regNo?: string;
  /** How the visit was booked */
  visitType?: 'ONLINE' | 'WALK_IN' | 'PHONE';
  /** Staff member who booked it (reception bookings) */
  bookedBy?: string;
  /** When it was booked (ISO) */
  bookedAt?: string;
  address?: string;
}

const VISIT_TYPE: Record<string, string> = { ONLINE: 'Online booking', WALK_IN: 'Walk-in', PHONE: 'Booked by phone' };

const stamp = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`;
};

// Colours (match the website)
export const INK: [number, number, number] = [28, 35, 33];
export const MUTED: [number, number, number] = [107, 100, 89];
export const TEAL: [number, number, number] = [15, 118, 110];
export const RULE: [number, number, number] = [231, 227, 218];
export const PANEL: [number, number, number] = [250, 248, 244];
export const AMBER: [number, number, number] = [122, 83, 0];
export const RED: [number, number, number] = [198, 40, 40];

const PAGE_W = 148;
const PAGE_H = 210;
const M = 11; // page margin, mm

/** Typographic characters the built-in fonts can't encode reliably. */
export const plain = (s: string) =>
  s
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/·/g, '|')
    .replace(/₹\s?/g, 'Rs. ');

const needsImage = (s: string) => /[^\x20-\x7E]/.test(plain(s));

const time12 = (t: string) => t.replace(/^0/, '');

const longDate = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** "09:30 AM" minus 15 minutes, for the reporting time. */
const minus15 = (t: string) => {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return t;
  let mins = (Number(m[1]) % 12) * 60 + Number(m[2]) + (m[3].toUpperCase() === 'PM' ? 720 : 0) - 15;
  if (mins < 0) mins += 1440;
  const h = Math.floor(mins / 60);
  const p = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(mins % 60).padStart(2, '0')} ${p}`;
};

export const money = (n: number) => `Rs. ${n.toLocaleString('en-IN')}`;

export async function imageDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export interface TextOpts {
  size?: number; // pt
  bold?: boolean;
  color?: [number, number, number];
  align?: 'left' | 'right' | 'center';
  font?: 'helvetica' | 'courier';
  maxWidth?: number; // mm
}

/** Draws one line of text; non-Latin text becomes a crisp image. Returns the line height in mm. */
export function text(pdf: JsPDF, value: string, x: number, y: number, o: TextOpts = {}): number {
  const size = o.size ?? 9;
  const color = o.color ?? INK;
  const lineH = size * 0.3528 * 1.25;

  if (!needsImage(value)) {
    pdf.setFont(o.font ?? 'helvetica', o.bold ? 'bold' : 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    let s = plain(value);
    if (o.maxWidth && pdf.getTextWidth(s) > o.maxWidth) {
      // Single line: shorten with an ellipsis if it doesn't fit
      while (s.length > 1 && pdf.getTextWidth(`${s}...`) > o.maxWidth) s = s.slice(0, -1);
      s = `${s.trimEnd()}...`;
    }
    pdf.text(s, x, y, { align: o.align ?? 'left', baseline: 'alphabetic' });
    return lineH;
  }

  // Render with the browser's fonts (Mukta / Noto Sans Devanagari) at 4x for print sharpness
  const scale = 4;
  const pxPerMm = 96 / 25.4;
  const fontPx = size * (96 / 72) * scale;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const font = `${o.bold ? 600 : 400} ${fontPx}px Mukta, 'Noto Sans Devanagari', Inter, system-ui, sans-serif`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(value).width) + 4;
  const h = Math.ceil(fontPx * 1.5);
  canvas.width = w;
  canvas.height = h;
  ctx.font = font;
  ctx.fillStyle = `rgb(${color.join(',')})`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(value, 2, fontPx * 1.1);
  let wMm = w / scale / pxPerMm;
  let hMm = h / scale / pxPerMm;
  if (o.maxWidth && wMm > o.maxWidth) {
    hMm *= o.maxWidth / wMm;
    wMm = o.maxWidth;
  }
  const left = o.align === 'right' ? x - wMm : o.align === 'center' ? x - wMm / 2 : x;
  const top = y - (fontPx * 1.1) / scale / pxPerMm;
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', left, top, wMm, hMm);
  return lineH;
}

/** Label above value, in a column. Returns the height used. */
export function field(pdf: JsPDF, label: string, value: string, x: number, y: number, width: number, valueColor = INK): number {
  text(pdf, label, x, y, { size: 7, color: MUTED });
  text(pdf, value, x, y + 4.4, { size: 9.5, bold: true, color: valueColor, maxWidth: width });
  return 10.5;
}

/** Logo, hospital name, address and contact line, teal rule, then the document title. Returns the next y. */
export async function drawLetterhead(
  pdf: JsPDF,
  title: string,
  issued: Date,
  pageW = PAGE_W,
  gstin: string | null = HOSPITAL.gstin || null,
): Promise<number> {
  let y = M;
  const logo = await imageDataUrl(HOSPITAL.logo);
  let textX = M;
  if (logo) {
    try {
      pdf.addImage(logo, 'PNG', M, y, 13, 13);
      textX = M + 16;
    } catch {
      /* logo is optional */
    }
  }
  text(pdf, HOSPITAL.name, textX, y + 4.6, { size: 12.5, bold: true, maxWidth: pageW - textX - M - (gstin ? 34 : 0) });
  text(pdf, HOSPITAL.address.letterhead, textX, y + 9, { size: 7, color: MUTED, maxWidth: pageW - textX - M });
  text(pdf, `Phone ${HOSPITAL.phones.reception.display}  |  ${HOSPITAL.emails.main}  |  ${HOSPITAL.website}`, textX, y + 12.6, {
    size: 7,
    color: MUTED,
    maxWidth: pageW - textX - M,
  });
  if (gstin) {
    text(pdf, `GSTIN ${gstin}`, pageW - M, y + 4.6, { size: 7, color: MUTED, align: 'right' });
  }
  y += 17;
  pdf.setFillColor(...TEAL);
  pdf.rect(M, y, pageW - 2 * M, 0.8, 'F');

  y += 7;
  text(pdf, title, M, y, { size: 11, bold: true, color: TEAL });
  text(
    pdf,
    `Issued ${issued.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${issued.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    })}`,
    pageW - M,
    y,
    { size: 7, color: MUTED, align: 'right' },
  );

  return y;
}

export async function buildAppointmentPdf(d: SlipData): Promise<JsPDF> {
  const [{ jsPDF }, QR] = await Promise.all([import('jspdf'), import('qrcode')]);
  if (document.fonts?.ready) await document.fonts.ready;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5', compress: true });
  const confirmed = d.kind === 'confirmed';
  const issued = new Date();
  pdf.setProperties({
    title: confirmed ? `OPD appointment ${d.appointmentCode}` : 'OPD appointment request',
    subject: `${d.doctorName}, ${longDate(d.date)}`,
    author: HOSPITAL.name,
    creator: HOSPITAL.website,
  });

  let y = await drawLetterhead(pdf, confirmed ? 'OPD Appointment Slip' : 'OPD Appointment Request', issued);

  // ── Token panel ──────────────────────────────────────────────────────────
  y += 4;
  const panelH = 32;
  pdf.setFillColor(...PANEL);
  pdf.setDrawColor(...RULE);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(M, y, PAGE_W - 2 * M, panelH, 2, 2, 'FD');

  const qrSize = 26;
  if (confirmed && d.appointmentCode) {
    const payload = `${d.appointmentCode}|${d.date}|${d.startTime}`;
    const qr = await QR.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 0, width: 400, color: { dark: '#1C2321', light: '#FAF8F4' } });
    pdf.addImage(qr, 'PNG', PAGE_W - M - 3 - qrSize, y + 3, qrSize, qrSize);

    text(pdf, 'Token number', M + 5, y + 7.5, { size: 7.5, color: MUTED });
    text(pdf, d.appointmentCode, M + 5, y + 16, { size: 19, bold: true, font: 'courier' });
    text(pdf, 'Status', M + 5, y + 23, { size: 7.5, color: MUTED });
    text(pdf, d.phoneVerified === false ? 'Confirmed - reception will call to verify mobile' : 'Confirmed', M + 5, y + 27.6, {
      size: 9,
      bold: true,
      color: d.phoneVerified === false ? AMBER : TEAL,
      maxWidth: PAGE_W - 2 * M - qrSize - 12,
    });
  } else {
    text(pdf, 'Status', M + 5, y + 7.5, { size: 7.5, color: MUTED });
    text(pdf, 'Requested - not yet confirmed', M + 5, y + 14.5, { size: 13, bold: true, color: AMBER });
    text(pdf, 'Reception will call you to confirm this time.', M + 5, y + 21, { size: 8.5, color: INK });
    text(pdf, 'Please do not travel until you receive the call.', M + 5, y + 26, { size: 8.5, color: INK });
  }
  y += panelH + 8;

  // ── Appointment & patient ───────────────────────────────────────────────
  const colW = (PAGE_W - 2 * M - 6) / 2;
  const c1 = M;
  const c2 = M + colW + 6;
  const section = (title: string, x: number, yy: number) => {
    text(pdf, title, x, yy, { size: 8.5, bold: true, color: TEAL });
    pdf.setDrawColor(...RULE);
    pdf.line(x, yy + 1.8, x + colW, yy + 1.8);
    return yy + 7;
  };

  let ya = section('Appointment', c1, y);
  ya += field(pdf, 'Date', longDate(d.date), c1, ya, colW);
  ya += field(pdf, 'Time', d.endTime ? `${time12(d.startTime)} - ${time12(d.endTime)}` : time12(d.startTime), c1, ya, colW);
  ya += field(pdf, 'Please report by', `${minus15(d.startTime)} at OPD reception`, c1, ya, colW);
  ya += field(pdf, 'Doctor', d.doctorName, c1, ya, colW);
  ya += field(pdf, 'Department', d.department, c1, ya, colW);
  if (d.visitType) ya += field(pdf, 'Visit type', VISIT_TYPE[d.visitType] || d.visitType, c1, ya, colW);

  let yp = section('Patient', c2, y);
  yp += field(pdf, 'Name', d.patientName, c2, yp, colW);
  if (d.regNo) yp += field(pdf, 'Registration no. (UHID)', d.regNo, c2, yp, colW);
  const ageSex = [d.patientAge ? `${d.patientAge} years` : '', d.patientGender || ''].filter(Boolean).join(', ');
  if (ageSex) yp += field(pdf, 'Age and gender', ageSex, c2, yp, colW);
  yp += field(pdf, 'Mobile', d.patientPhone, c2, yp, colW);
  if (d.town) yp += field(pdf, 'Town or village', d.town, c2, yp, colW);

  // Payment
  yp += 2;
  yp = section('Payment', c2, yp);
  yp += field(pdf, 'Consultation fee', d.fee > 0 ? money(d.fee) : 'As per hospital rates', c2, yp, colW);
  yp += field(
    pdf,
    'Payment status',
    d.paid ? 'Paid online' : 'To pay at OPD counter',
    c2,
    yp,
    colW,
    d.paid ? TEAL : AMBER,
  );
  if (d.paid && d.paymentId) yp += field(pdf, 'Payment reference', d.paymentId, c2, yp, colW);

  y = Math.max(ya, yp) + 2;

  // ── Instructions ─────────────────────────────────────────────────────────
  pdf.setDrawColor(...RULE);
  pdf.line(M, y, PAGE_W - M, y);
  y += 5.5;
  text(pdf, 'Please remember', M, y, { size: 8.5, bold: true });
  y += 5;
  const notes = [
    'Arrive 15 minutes early and show this slip (printed or on your phone) at OPD reception.',
    'Bring old prescriptions, test reports and any medicines you take.',
    ...(d.paid ? [] : [d.fee > 0 ? `Pay the consultation fee of ${money(d.fee)} at the OPD counter.` : 'Pay the consultation fee at the OPD counter.']),
    ...(HOSPITAL.empanelments.length
      ? [`${HOSPITAL.empanelments.map((e) => e.code).join(' / ')} patients: bring your ration card and Aadhaar card.`]
      : []),
    `To change or cancel, call ${HOSPITAL.phones.reception.display}.`,
  ];
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.8);
  for (const [i, n] of notes.entries()) {
    const lines = pdf.splitTextToSize(plain(n), PAGE_W - 2 * M - 5) as string[];
    pdf.setTextColor(...MUTED);
    pdf.text(`${i + 1}.`, M, y);
    pdf.setTextColor(...INK);
    pdf.text(lines, M + 5, y);
    y += lines.length * 3.5 + 0.9;
  }

  // ── Footer ───────────────────────────────────────────────────────────────
  const fy = PAGE_H - 17;
  pdf.setDrawColor(207, 201, 188);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(M, fy, PAGE_W - M, fy);
  pdf.setLineDashPattern([], 0);
  text(pdf, `Emergency, 24 hours: ${HOSPITAL.phones.emergency.display}`, M, fy + 5, { size: 7.5, bold: true, color: RED });
  text(pdf, HOSPITAL.website, PAGE_W - M, fy + 5, { size: 7.5, color: MUTED, align: 'right' });
  text(
    pdf,
    confirmed
      ? 'Computer-generated slip. No signature required.'
      : 'This is a request only. It becomes an appointment after reception confirms by phone.',
    M,
    fy + 10,
    { size: 6.8, color: MUTED },
  );
  if (confirmed && (d.bookedAt || d.bookedBy)) {
    const who = d.bookedBy ? `Booked by ${d.bookedBy}` : d.visitType === 'ONLINE' || !d.visitType ? 'Booked online' : 'Booked';
    text(pdf, `${who}${d.bookedAt ? ` on ${stamp(d.bookedAt)}` : ''}`, M, fy + 13.6, { size: 6.5, color: MUTED, maxWidth: PAGE_W - 2 * M });
  }
  return pdf;
}

/** Build and download the slip. */
export async function downloadAppointmentPdf(d: SlipData) {
  const pdf = await buildAppointmentPdf(d);
  const name = d.kind === 'confirmed' ? `${HOSPITAL.brand}-OPD-${d.appointmentCode}.pdf` : `${HOSPITAL.brand}-OPD-request-${d.date}.pdf`;
  pdf.save(name);
}

// ─── Bill ──────────────────────────────────────────────────────────────────

export interface BillPdfData {
  billNo: string;
  date: string; // YYYY-MM-DD
  title: string;
  patientName: string;
  patientPhone: string;
  items: { name: string; qty: number; amount: number }[];
  total: number;
  paid: number;
  note?: string;
}

/** Itemised bill as a text PDF (A5), shared with the patient from the portal. */
export async function downloadBillPdf(b: BillPdfData) {
  const { jsPDF } = await import('jspdf');
  if (document.fonts?.ready) await document.fonts.ready;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5', compress: true });
  pdf.setProperties({ title: `Bill ${b.billNo}`, author: HOSPITAL.name, creator: HOSPITAL.website });

  let y = await drawLetterhead(pdf, b.title || 'Hospital bill', new Date());
  y += 8;
  const colW = (PAGE_W - 2 * M - 6) / 2;
  field(pdf, 'Bill number', b.billNo, M, y, colW);
  field(pdf, 'Bill date', longDate(b.date), M + colW + 6, y, colW);
  y += 11;
  field(pdf, 'Patient', b.patientName || '-', M, y, colW);
  field(pdf, 'Mobile', b.patientPhone, M + colW + 6, y, colW);
  y += 13;

  // Table
  const xQty = PAGE_W - M - 34;
  const xAmt = PAGE_W - M;
  const header = (yy: number) => {
    pdf.setFillColor(...PANEL);
    pdf.rect(M, yy - 4.5, PAGE_W - 2 * M, 7, 'F');
    text(pdf, 'Item', M + 2, yy, { size: 7.5, bold: true, color: MUTED });
    text(pdf, 'Qty', xQty, yy, { size: 7.5, bold: true, color: MUTED, align: 'right' });
    text(pdf, 'Amount', xAmt - 2, yy, { size: 7.5, bold: true, color: MUTED, align: 'right' });
    return yy + 7;
  };
  y = header(y);
  b.items.forEach((it, i) => {
    if (y > PAGE_H - 45) {
      pdf.addPage();
      y = header(M + 6);
    }
    text(pdf, `${i + 1}. ${it.name}`, M + 2, y, { size: 8.5, maxWidth: xQty - M - 12 });
    text(pdf, String(it.qty), xQty, y, { size: 8.5, align: 'right' });
    text(pdf, money(it.amount), xAmt - 2, y, { size: 8.5, align: 'right' });
    pdf.setDrawColor(...RULE);
    pdf.line(M, y + 2.6, PAGE_W - M, y + 2.6);
    y += 7;
  });

  // Totals
  y += 2;
  const due = Math.max(0, b.total - b.paid);
  const totalRow = (label: string, value: string, bold = false, color = INK) => {
    text(pdf, label, xQty, y, { size: 8.5, bold, color: MUTED, align: 'right' });
    text(pdf, value, xAmt - 2, y, { size: bold ? 10 : 8.5, bold, color, align: 'right' });
    y += 6;
  };
  totalRow('Total', money(b.total), true);
  totalRow('Paid', money(b.paid));
  totalRow('Balance due', money(due), true, due > 0 ? AMBER : TEAL);

  if (b.note) {
    y += 2;
    text(pdf, 'Note', M, y, { size: 7.5, color: MUTED });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...INK);
    pdf.text(pdf.splitTextToSize(plain(b.note), PAGE_W - 2 * M) as string[], M, y + 4.5);
  }

  const fy = PAGE_H - 12;
  pdf.setDrawColor(207, 201, 188);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(M, fy, PAGE_W - M, fy);
  pdf.setLineDashPattern([], 0);
  text(pdf, 'Computer-generated bill. For questions, call ' + HOSPITAL.phones.reception.display + '.', M, fy + 5, { size: 6.8, color: MUTED });
  pdf.save(`${HOSPITAL.brand}-bill-${b.billNo}.pdf`);
}

// ─── Medicine list ─────────────────────────────────────────────────────────

export interface MedicineListPdfData {
  patientName: string;
  patientPhone: string;
  medicines: {
    name: string;
    strength: string;
    dosage: string;
    instructions: string;
    startDate: string;
    endDate: string;
    expiryDate: string;
    doctorName: string;
  }[];
}

/** Current medicines as a text PDF the patient can show at a pharmacy. */
export async function downloadMedicineListPdf(d: MedicineListPdfData) {
  const { jsPDF } = await import('jspdf');
  if (document.fonts?.ready) await document.fonts.ready;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5', compress: true });
  pdf.setProperties({ title: 'Current medicines', author: HOSPITAL.name, creator: HOSPITAL.website });
  let y = await drawLetterhead(pdf, 'Current medicines', new Date());
  y += 8;
  const colW = (PAGE_W - 2 * M - 6) / 2;
  field(pdf, 'Patient', d.patientName || '-', M, y, colW);
  field(pdf, 'Mobile', d.patientPhone, M + colW + 6, y, colW);
  y += 14;

  d.medicines.forEach((m, i) => {
    if (y > PAGE_H - 40) {
      pdf.addPage();
      y = M + 6;
    }
    pdf.setDrawColor(...RULE);
    pdf.line(M, y - 4.5, PAGE_W - M, y - 4.5);
    text(pdf, `${i + 1}. ${[m.name, m.strength].filter(Boolean).join(' ')}`, M, y, { size: 10, bold: true, maxWidth: PAGE_W - 2 * M });
    y += 5;
    const dose = /^\s*[\d.½]+\s*-\s*[\d.½]+\s*-\s*[\d.½]+\s*$/.test(m.dosage)
      ? `Morning ${m.dosage.split('-')[0].trim()} | Afternoon ${m.dosage.split('-')[1].trim()} | Night ${m.dosage.split('-')[2].trim()}`
      : m.dosage;
    if (dose || m.instructions) {
      text(pdf, [dose, m.instructions].filter(Boolean).join('  -  '), M + 4, y, { size: 8.5, maxWidth: PAGE_W - 2 * M - 4 });
      y += 4.5;
    }
    const course = `Course: ${longDate(m.startDate)} to ${m.endDate ? longDate(m.endDate) : 'ongoing'}`;
    text(pdf, course, M + 4, y, { size: 7.5, color: MUTED, maxWidth: PAGE_W - 2 * M - 4 });
    y += 4;
    const extra = [m.expiryDate ? `Pack expiry: ${longDate(m.expiryDate)}` : '', m.doctorName ? `Prescribed by ${m.doctorName}` : '']
      .filter(Boolean)
      .join('  |  ');
    if (extra) {
      text(pdf, extra, M + 4, y, { size: 7.5, color: MUTED, maxWidth: PAGE_W - 2 * M - 4 });
      y += 4;
    }
    y += 6;
  });

  const fy = PAGE_H - 12;
  pdf.setDrawColor(207, 201, 188);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(M, fy, PAGE_W - M, fy);
  pdf.setLineDashPattern([], 0);
  text(pdf, 'Take medicines only as your doctor advised. Questions: ' + HOSPITAL.phones.reception.display, M, fy + 5, { size: 6.8, color: MUTED });
  pdf.save(`${HOSPITAL.brand}-medicines-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── OPD case sheet (A4, for the doctor's desk) ─────────────────────────────

/**
 * Printed by reception for each visit: patient and visit details at the top,
 * then blank, ruled sections the doctor fills in by hand (vitals, complaints,
 * examination, diagnosis, prescription, tests, advice, follow-up, signature).
 */
export async function downloadOpdSheetPdf(d: SlipData) {
  const [{ jsPDF }, QR] = await Promise.all([import('jspdf'), import('qrcode')]);
  if (document.fonts?.ready) await document.fonts.ready;
  const W = 210;
  const H = 297;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  pdf.setProperties({ title: `OPD case sheet ${d.appointmentCode || ''}`.trim(), author: HOSPITAL.name, creator: HOSPITAL.website });

  let y = await drawLetterhead(pdf, 'OPD Case Sheet', new Date(), W);
  y += 4;

  // Token band
  const bandH = 24;
  pdf.setFillColor(...PANEL);
  pdf.setDrawColor(...RULE);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(M, y, W - 2 * M, bandH, 2, 2, 'FD');
  if (d.appointmentCode) {
    const qr = await QR.toDataURL(`${d.appointmentCode}|${d.date}|${d.startTime}`, {
      errorCorrectionLevel: 'M',
      margin: 0,
      width: 300,
      color: { dark: '#1C2321', light: '#FAF8F4' },
    });
    pdf.addImage(qr, 'PNG', W - M - 3 - 18, y + 3, 18, 18);
  }
  const bandCols = [
    ['Token number', d.appointmentCode || '-'],
    ['Date and time', `${new Date(`${d.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${time12(d.startTime)}`],
    ['Doctor', d.doctorName],
  ];
  const bandW = (W - 2 * M - 28) / 3;
  bandCols.forEach(([label, value], i) => {
    const x = M + 5 + i * bandW;
    text(pdf, label, x, y + 8, { size: 7.5, color: MUTED });
    text(pdf, value, x, y + 15, { size: i === 0 ? 13 : 10, bold: true, font: i === 0 ? 'courier' : 'helvetica', maxWidth: bandW - 4 });
    if (i === 2) text(pdf, d.department, x, y + 20, { size: 7.5, color: MUTED, maxWidth: bandW - 4 });
  });
  y += bandH + 7;

  // Patient and visit grid (4 columns x 2 rows)
  const cells: [string, string][] = [
    ['Patient name', d.patientName],
    ['Registration no. (UHID)', d.regNo || '-'],
    ['Age / gender', [d.patientAge ? `${d.patientAge} yrs` : '', d.patientGender || ''].filter(Boolean).join(' / ') || '-'],
    ['Mobile', d.patientPhone],
    ['Address', d.address || d.town || '-'],
    ['Visit type', d.visitType ? VISIT_TYPE[d.visitType] || d.visitType : '-'],
    ['Consultation fee', `${d.fee > 0 ? money(d.fee) : 'As per rates'} (${d.paid ? 'paid' : 'due'})`],
    ['Booked', d.bookedAt ? `${stamp(d.bookedAt)}${d.bookedBy ? `, ${d.bookedBy}` : ''}` : d.bookedBy || '-'],
  ];
  const cw = (W - 2 * M) / 4;
  cells.forEach(([label, value], i) => {
    const x = M + (i % 4) * cw;
    const yy = y + Math.floor(i / 4) * 11;
    text(pdf, label, x, yy, { size: 7, color: MUTED });
    text(pdf, value, x, yy + 4.4, { size: 9, bold: true, maxWidth: cw - 3 });
  });
  y += 22 + 1;

  // Vitals boxes
  const vitals = ['BP (mmHg)', 'Pulse (/min)', 'Temp (F)', 'SpO2 (%)', 'Weight (kg)', 'Height (cm)'];
  const vw = (W - 2 * M - 5 * 3) / 6;
  text(pdf, 'Vitals', M, y + 3, { size: 9, bold: true, color: TEAL });
  y += 5.5;
  vitals.forEach((v, i) => {
    const x = M + i * (vw + 3);
    pdf.setDrawColor(...RULE);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, y, vw, 12, 1.5, 1.5, 'S');
    text(pdf, v, x + 2, y + 4, { size: 6.8, color: MUTED });
  });
  y += 12 + 6;

  // Ruled writing sections
  const ruled = (title: string, lines: number) => {
    text(pdf, title, M, y, { size: 9, bold: true, color: TEAL });
    y += 2;
    pdf.setDrawColor(...RULE);
    pdf.setLineWidth(0.25);
    for (let i = 1; i <= lines; i++) pdf.line(M, y + i * 5.8, W - M, y + i * 5.8);
    y += lines * 5.8 + 5;
  };
  ruled('Chief complaints', 2);
  ruled('History and examination', 3);
  ruled('Provisional diagnosis', 2);

  // Prescription table
  text(pdf, 'Rx', M, y, { size: 12, bold: true, color: TEAL, font: 'courier' });
  y += 2.5;
  const cols: [string, number][] = [
    ['#', 8],
    ['Medicine and strength', 72],
    ['Dose', 22],
    ['Morning - Noon - Night', 36],
    ['Before / after food', 26],
    ['Days', 22],
  ];
  const rowH = 6.4;
  const rows = 6;
  pdf.setFillColor(...PANEL);
  pdf.rect(M, y, W - 2 * M, rowH, 'F');
  let x = M;
  cols.forEach(([h, w]) => {
    text(pdf, h, x + 1.8, y + 4.7, { size: 7.2, bold: true, color: MUTED, maxWidth: w - 3 });
    x += w;
  });
  pdf.setDrawColor(...RULE);
  pdf.setLineWidth(0.25);
  for (let r = 0; r <= rows + 1; r++) pdf.line(M, y + r * rowH, W - M, y + r * rowH);
  x = M;
  for (const [, w] of cols) {
    pdf.line(x, y, x, y + (rows + 1) * rowH);
    x += w;
  }
  pdf.line(W - M, y, W - M, y + (rows + 1) * rowH);
  for (let r = 1; r <= rows; r++) text(pdf, String(r), M + 2.6, y + r * rowH + 4.8, { size: 7.5, color: MUTED });
  y += (rows + 1) * rowH + 5.5;

  ruled('Investigations advised', 2);
  ruled('Advice', 2);

  // Follow-up and signature
  const sigW = 62;
  text(pdf, 'Follow-up on', M, y + 1, { size: 9, bold: true, color: TEAL });
  pdf.setDrawColor(...RULE);
  pdf.line(M + 26, y + 1.5, M + 80, y + 1.5);
  pdf.roundedRect(W - M - sigW, y - 4, sigW, 19, 1.5, 1.5, 'S');
  pdf.line(W - M - sigW + 4, y + 7.5, W - M - 4, y + 7.5);
  text(pdf, d.doctorName, W - M - sigW / 2, y + 11.2, { size: 8, bold: true, align: 'center', maxWidth: sigW - 6 });
  text(pdf, "Doctor's signature and stamp", W - M - sigW / 2, y + 13.8, { size: 6.5, color: MUTED, align: 'center' });

  // Footer
  const fy = H - 10;
  pdf.setDrawColor(207, 201, 188);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(M, fy, W - M, fy);
  pdf.setLineDashPattern([], 0);
  text(pdf, `Emergency, 24 hours: ${HOSPITAL.phones.emergency.display}`, M, fy + 5, { size: 7.5, bold: true, color: RED });
  text(pdf, `${HOSPITAL.website}  |  Medicines only as prescribed. Keep this sheet for your next visit.`, W - M, fy + 5, {
    size: 7,
    color: MUTED,
    align: 'right',
  });

  pdf.save(`${HOSPITAL.brand}-OPD-sheet-${d.appointmentCode || d.date}.pdf`);
}
