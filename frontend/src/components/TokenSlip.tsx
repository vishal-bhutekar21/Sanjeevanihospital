import React, { forwardRef } from 'react';
import { HOSPITAL } from '../config/hospital';

export interface SlipData {
  appointmentCode: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  dateLabel: string; // already formatted, e.g. "Tuesday, 13 October 2026"
  time: string; // "11:00 AM"
  fee: number;
  paid: boolean;
}

/**
 * Printable A5 OPD token slip. Rendered off-screen and captured into a PDF,
 * so any script (including Marathi names) comes out exactly as on screen.
 * Sized at 559 x 794 CSS px = A5 at 96 dpi.
 */
export const TokenSlip = forwardRef<HTMLDivElement, { d: SlipData }>(({ d }, ref) => {
  const row = (label: string, value: React.ReactNode) => (
    <tr>
      <td style={{ padding: '7px 0', color: '#6B6459', width: 128, verticalAlign: 'top' }}>{label}</td>
      <td style={{ padding: '7px 0', color: '#1C2321', fontWeight: 500 }}>{value}</td>
    </tr>
  );

  return (
    <div
      ref={ref}
      style={{
        width: 559,
        height: 794,
        background: '#FFFFFF',
        color: '#1C2321',
        fontFamily: "Inter, Mukta, 'Noto Sans Devanagari', system-ui, sans-serif",
        fontSize: 13,
        lineHeight: 1.45,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Letterhead */}
      <div style={{ padding: '26px 32px 18px', borderBottom: '3px solid #0F766E', display: 'flex', alignItems: 'center', gap: 14 }}>
        <img src={HOSPITAL.logo} alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} crossOrigin="anonymous" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 19, fontWeight: 600, lineHeight: 1.2 }}>
            {HOSPITAL.name}
          </div>
          <div style={{ fontSize: 11, color: '#6B6459', marginTop: 2 }}>
            {HOSPITAL.address.letterhead}
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 32px 0', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F766E', fontWeight: 600 }}>
            OPD appointment
          </div>
          <div style={{ fontSize: 11, color: '#6B6459' }}>
            Issued {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Token */}
        <div
          style={{
            marginTop: 12,
            border: '1px solid #E7E3DA',
            borderRadius: 8,
            padding: '16px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FAF8F4',
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#6B6459' }}>Token number</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 26, fontWeight: 700, letterSpacing: '0.04em' }}>
              {d.appointmentCode}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#6B6459' }}>Time</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{d.time.replace(/^0/, '')}</div>
          </div>
        </div>

        <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse', fontSize: 13 }}>
          <tbody>
            {row('Date', d.dateLabel)}
            {row('Doctor', d.doctorName)}
            {row('Department', d.department)}
            {row('Patient', d.patientName)}
            {row('Mobile', d.patientPhone)}
            {row(
              'Consultation fee',
              <span>
                {d.fee > 0 ? `₹${d.fee}` : 'As per hospital rates'}{' '}
                <span style={{ color: d.paid ? '#0B5D57' : '#7A5300', fontWeight: 600 }}>
                  {d.paid ? '· Paid online' : '· To pay at OPD counter'}
                </span>
              </span>,
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #E7E3DA' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Please remember</div>
          {[
            'Arrive 15 minutes early and show this slip at OPD reception.',
            'Bring old prescriptions and test reports, if any.',
            ...(d.paid ? [] : [d.fee > 0 ? `Pay the consultation fee of ₹${d.fee} at the counter.` : 'Pay the consultation fee at the counter.']),
            `To change or cancel, call ${HOSPITAL.phones.reception.display}.`,
          ].map((t, i) => (
            <div key={t} style={{ display: 'flex', gap: 8, color: '#3F3A33', marginBottom: 3 }}>
              <span style={{ width: 14, flexShrink: 0, color: '#6B6459' }}>{i + 1}.</span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, color: '#6B6459' }}>Doctor’s notes</div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 26, borderBottom: '1px solid #E7E3DA' }} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          margin: '0 32px',
          padding: '12px 0 22px',
          borderTop: '1px dashed #CFC9BC',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#6B6459',
        }}
      >
        <span>Emergency (24 hours): <b style={{ color: '#C62828' }}>{HOSPITAL.phones.emergency.display}</b></span>
        <span>{HOSPITAL.opdHours.short}</span>
      </div>
    </div>
  );
});
TokenSlip.displayName = 'TokenSlip';

/** Capture the slip element into an A5 PDF and download it. */
export async function downloadSlipPdf(el: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  if (document.fonts?.ready) await document.fonts.ready;
  const canvas = await html2canvas(el, { scale: 3, backgroundColor: '#FFFFFF', useCORS: true, logging: false });
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
  pdf.setProperties({ title: fileName.replace(/\.pdf$/, ''), author: HOSPITAL.name });
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 148, 210);
  pdf.save(fileName);
}
