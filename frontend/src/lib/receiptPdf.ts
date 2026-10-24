/**
 * Receipt as a real text PDF on A4 (selectable text, small file).
 * English by default; the staff member can switch the receipt to Marathi.
 * Other layouts (for example an 80 mm thermal printer) can be added later by
 * adding another builder next to buildReceiptPdf.
 */

import type { jsPDF as JsPDF } from 'jspdf';
import { HOSPITAL } from '../config/hospital';
import { drawLetterhead, text, field, plain, INK, MUTED, TEAL, RULE, PANEL, AMBER, RED } from './appointmentPdf';
import type { Receipt, ReceiptLang } from './reception';
import { kindLabel, modeLabel } from './reception';

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;

export const RECEIPT_LABELS = {
  en: {
    title: 'Receipt',
    cancelled: 'CANCELLED',
    no: 'Receipt number',
    date: 'Date and time',
    patient: 'Patient',
    regNo: 'Registration no.',
    mobile: 'Mobile',
    address: 'Address',
    doctor: 'Doctor',
    token: 'OPD token',
    type: 'Receipt for',
    item: 'Description',
    qty: 'Qty',
    rate: 'Rate',
    gst: 'GST',
    amount: 'Amount',
    subtotal: 'Subtotal',
    discount: 'Discount',
    cgst: 'CGST',
    sgst: 'SGST',
    total: 'Total',
    paid: 'Amount received',
    balance: 'Balance due',
    payments: 'Payments received',
    by: 'Received by',
    mode: 'Mode',
    ref: 'Reference',
    note: 'Note',
    words: 'Amount in words',
    gstin: 'GSTIN',
    sign: 'Authorised signatory',
    footer: 'Computer-generated receipt. For questions, call',
    reason: 'Cancelled because',
  },
  mr: {
    title: 'पावती',
    cancelled: 'रद्द',
    no: 'पावती क्रमांक',
    date: 'दिनांक व वेळ',
    patient: 'रुग्ण',
    regNo: 'नोंदणी क्र.',
    mobile: 'मोबाईल',
    address: 'पत्ता',
    doctor: 'डॉक्टर',
    token: 'ओपीडी टोकन',
    type: 'पावतीचा प्रकार',
    item: 'तपशील',
    qty: 'संख्या',
    rate: 'दर',
    gst: 'जीएसटी',
    amount: 'रक्कम',
    subtotal: 'एकूण (करापूर्वी)',
    discount: 'सूट',
    cgst: 'सीजीएसटी',
    sgst: 'एसजीएसटी',
    total: 'एकूण रक्कम',
    paid: 'मिळालेली रक्कम',
    balance: 'बाकी रक्कम',
    payments: 'मिळालेले पैसे',
    by: 'स्वीकारणारा',
    mode: 'पद्धत',
    ref: 'संदर्भ',
    note: 'टीप',
    words: 'अक्षरी रक्कम',
    gstin: 'जीएसटीआयएन',
    sign: 'अधिकृत स्वाक्षरी',
    footer: 'संगणकीय पावती. चौकशीसाठी संपर्क',
    reason: 'रद्द करण्याचे कारण',
  },
} as const;

// Receipt type and payment mode in Marathi
export const KIND_MR: Record<string, string> = {
  CONSULTATION: 'सल्ला शुल्क',
  REGISTRATION: 'नोंदणी शुल्क',
  PROCEDURE: 'उपचार / प्रक्रिया',
  LAB: 'तपासणी',
  PHARMACY: 'औषधे',
  ADVANCE: 'आगाऊ रक्कम',
  OTHER: 'इतर',
};
export const MODE_MR: Record<string, string> = {
  CASH: 'रोख',
  UPI: 'यूपीआय',
  CARD: 'कार्ड',
  ONLINE: 'ऑनलाइन',
  CHEQUE: 'धनादेश',
  INSURANCE: 'विमा / टीपीए',
  SCHEME: 'शासकीय योजना',
};

const amt = (n: number) => `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const below100 = (n: number) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`);
const below1000 = (n: number) => (n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ' ' + below100(n % 100) : ''}` : below100(n));

/** 12345.5 -> "Rupees Twelve Thousand Three Hundred Forty Five and Fifty Paise Only" (Indian grouping) */
export function amountInWords(value: number): string {
  const paiseTotal = Math.round(value * 100);
  let rupees = Math.floor(paiseTotal / 100);
  const paise = paiseTotal % 100;
  if (rupees === 0 && paise === 0) return 'Rupees Zero Only';
  const parts: string[] = [];
  const crore = Math.floor(rupees / 10000000);
  rupees %= 10000000;
  const lakh = Math.floor(rupees / 100000);
  rupees %= 100000;
  const thousand = Math.floor(rupees / 1000);
  rupees %= 1000;
  if (crore) parts.push(`${below100(crore)} Crore`);
  if (lakh) parts.push(`${below100(lakh)} Lakh`);
  if (thousand) parts.push(`${below100(thousand)} Thousand`);
  if (rupees) parts.push(below1000(rupees));
  const r = parts.join(' ');
  const p = paise ? `${r ? ' and ' : ''}${below100(paise)} Paise` : '';
  return `Rupees ${r}${p} Only`;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export async function buildReceiptPdf(r: Receipt, lang: ReceiptLang = 'en'): Promise<JsPDF> {
  const { jsPDF } = await import('jspdf');
  if (document.fonts?.ready) await document.fonts.ready;
  const t = RECEIPT_LABELS[lang];
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  pdf.setProperties({ title: `${t.title} ${r.receiptNo}`, author: HOSPITAL.name, creator: HOSPITAL.website });

  let y = await drawLetterhead(pdf, t.title, new Date(r.createdAt), PAGE_W);
  if (r.hospital?.gstin) {
    text(pdf, `${t.gstin}: ${r.hospital.gstin}`, PAGE_W / 2, y, { size: 8, color: MUTED, align: "center" });
  }
  if (r.status === 'CANCELLED') {
    text(pdf, t.cancelled, PAGE_W / 2, y + 1, { size: 20, bold: true, color: RED, align: 'center' });
  }
  y += 9;

  // ── Details ──
  const colW = (PAGE_W - 2 * M - 12) / 3;
  const c = (i: number) => M + i * (colW + 6);
  const kind = lang === 'mr' ? KIND_MR[r.kind] || kindLabel(r.kind) : kindLabel(r.kind);
  field(pdf, t.no, r.receiptNo, c(0), y, colW);
  field(pdf, t.date, when(r.createdAt), c(1), y, colW);
  field(pdf, t.type, kind, c(2), y, colW);
  y += 12;
  field(pdf, t.patient, r.patientName, c(0), y, colW);
  field(pdf, t.regNo, r.patientRegNo || '-', c(1), y, colW);
  field(pdf, t.mobile, `+91 ${r.patientPhone}`, c(2), y, colW);
  y += 12;
  if (r.doctorName || r.appointmentCode) {
    field(pdf, t.doctor, r.doctorName || '-', c(0), y, colW);
    field(pdf, t.token, r.appointmentCode || '-', c(1), y, colW);
    y += 12;
  }
  if (r.patientAddress) {
    field(pdf, t.address, r.patientAddress, M, y, PAGE_W - 2 * M);
    y += 12;
  }
  y += 2;

  // ── Items ──
  const xAmt = PAGE_W - M - 2;
  const xGst = xAmt - 34;
  const xRate = xGst - 22;
  const xQty = xRate - 28;
  const header = (yy: number) => {
    pdf.setFillColor(...PANEL);
    pdf.rect(M, yy - 4.8, PAGE_W - 2 * M, 7.4, 'F');
    text(pdf, t.item, M + 2, yy, { size: 8, bold: true, color: MUTED });
    text(pdf, t.qty, xQty, yy, { size: 8, bold: true, color: MUTED, align: 'right' });
    text(pdf, t.rate, xRate, yy, { size: 8, bold: true, color: MUTED, align: 'right' });
    text(pdf, `${t.gst} %`, xGst, yy, { size: 8, bold: true, color: MUTED, align: 'right' });
    text(pdf, t.amount, xAmt, yy, { size: 8, bold: true, color: MUTED, align: 'right' });
    return yy + 7.5;
  };
  y = header(y);
  r.items.forEach((it, i) => {
    if (y > PAGE_H - 95) {
      pdf.addPage();
      y = header(M + 6);
    }
    text(pdf, `${i + 1}. ${it.name}`, M + 2, y, { size: 9, maxWidth: xQty - M - 16 });
    text(pdf, String(it.qty), xQty, y, { size: 9, align: 'right' });
    text(pdf, amt(it.rate), xRate, y, { size: 9, align: 'right' });
    text(pdf, it.gstPercent ? `${it.gstPercent}%` : '-', xGst, y, { size: 9, align: 'right' });
    text(pdf, amt(it.amount), xAmt, y, { size: 9, align: 'right' });
    pdf.setDrawColor(...RULE);
    pdf.line(M, y + 2.8, PAGE_W - M, y + 2.8);
    y += 7.5;
  });

  // ── Totals ──
  if (y > PAGE_H - 90) {
    pdf.addPage();
    y = M + 8;
  }
  y += 2;
  const labelX = xGst + 2;
  const row = (label: string, value: string, bold = false, color = INK) => {
    text(pdf, label, labelX, y, { size: 9, bold, color: MUTED, align: 'right' });
    text(pdf, value, xAmt, y, { size: bold ? 10.5 : 9, bold, color, align: 'right' });
    y += 6.2;
  };
  row(t.subtotal, amt(r.subtotal));
  if (r.discount > 0) row(t.discount, `- ${amt(r.discount)}`);
  if (r.tax > 0) {
    // Intra-state supply: the tax splits equally into central and state GST
    const half = Math.round((r.tax / 2) * 100) / 100;
    row(t.cgst, amt(half));
    row(t.sgst, amt(Math.round((r.tax - half) * 100) / 100));
  }
  pdf.setDrawColor(...INK);
  pdf.line(labelX - 40, y - 3.4, xAmt, y - 3.4);
  y += 1;
  row(t.total, amt(r.total), true);
  row(t.paid, amt(r.paid));
  row(t.balance, amt(r.balance), true, r.balance > 0 ? AMBER : TEAL);

  if (lang === 'en') {
    y += 1;
    text(pdf, t.words, M, y, { size: 7.5, color: MUTED });
    text(pdf, amountInWords(r.total), M, y + 4.6, { size: 9, bold: true, maxWidth: PAGE_W - 2 * M });
    y += 11;
  }

  // ── Payments ──
  if (r.payments.length > 0) {
    y += 2;
    text(pdf, t.payments, M, y, { size: 8.5, bold: true, color: TEAL });
    y += 5.5;
    r.payments.forEach((p) => {
      if (y > PAGE_H - 40) {
        pdf.addPage();
        y = M + 8;
      }
      const mode = lang === 'mr' ? MODE_MR[p.mode] || modeLabel(p.mode) : modeLabel(p.mode);
      text(pdf, when(p.at), M, y, { size: 8.5 });
      text(pdf, `${t.mode}: ${mode}${p.ref ? `  |  ${t.ref}: ${p.ref}` : ''}`, M + 42, y, { size: 8.5, maxWidth: 70 });
      if (p.by) text(pdf, `${t.by}: ${p.by}`, xAmt - 28, y, { size: 8, color: MUTED, align: 'right', maxWidth: 52 });
      text(pdf, amt(p.amount), xAmt, y, { size: 8.5, align: 'right' });
      y += 5.8;
    });
  }

  if (r.note) {
    y += 2;
    text(pdf, t.note, M, y, { size: 7.5, color: MUTED });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...INK);
    if (/[^\x20-\x7E]/.test(plain(r.note))) text(pdf, r.note, M, y + 4.6, { size: 9, maxWidth: PAGE_W - 2 * M });
    else pdf.text(pdf.splitTextToSize(plain(r.note), PAGE_W - 2 * M) as string[], M, y + 4.6);
    y += 12;
  }
  if (r.status === 'CANCELLED' && r.cancelReason) {
    text(pdf, `${t.reason}: ${r.cancelReason}`, M, y + 2, { size: 8.5, color: RED, maxWidth: PAGE_W - 2 * M });
  }

  // ── Footer: signature and note ──
  const fy = PAGE_H - 22;
  pdf.setDrawColor(...INK);
  pdf.line(PAGE_W - M - 55, fy, PAGE_W - M, fy);
  text(pdf, t.sign, PAGE_W - M, fy + 4.6, { size: 8, color: MUTED, align: 'right' });
  if (r.issuedByName) text(pdf, r.issuedByName, PAGE_W - M, fy - 2, { size: 8, align: 'right' });
  pdf.setDrawColor(207, 201, 188);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(M, PAGE_H - 12, PAGE_W - M, PAGE_H - 12);
  pdf.setLineDashPattern([], 0);
  text(pdf, `${t.footer} ${HOSPITAL.phones.reception.display}.`, M, PAGE_H - 7, { size: 7.5, color: MUTED });
  return pdf;
}

export async function downloadReceiptPdf(r: Receipt, lang: ReceiptLang = 'en') {
  const pdf = await buildReceiptPdf(r, lang);
  pdf.save(`${HOSPITAL.brand}-receipt-${r.receiptNo}.pdf`);
}

/** Opens the print dialog for the receipt PDF */
export async function printReceiptPdf(r: Receipt, lang: ReceiptLang = 'en') {
  const pdf = await buildReceiptPdf(r, lang);
  pdf.autoPrint();
  const url = URL.createObjectURL(pdf.output('blob'));
  const w = window.open(url, '_blank');
  if (!w) {
    // Pop-up blocked: fall back to a normal download
    pdf.save(`${HOSPITAL.brand}-receipt-${r.receiptNo}.pdf`);
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
