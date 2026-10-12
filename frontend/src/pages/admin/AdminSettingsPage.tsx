import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { HOSPITAL } from '../../config/hospital';

// What the public website currently shows. All of it comes from src/config/hospital.ts.
const H = HOSPITAL;
const PHONES = [
  { label: 'Emergency (24 hours) and reception', num: H.phones.emergency.display, where: 'Header, footer, contact page' },
  { label: 'Ambulance', num: H.phones.ambulance.display, where: 'Contact page' },
  { label: 'MJPJAY (Arogya Mitra)', num: H.phones.mjpjay.display, where: 'Contact page' },
  { label: 'Cashless insurance (TPA)', num: H.phones.tpa.display, where: 'Contact page' },
  { label: 'Administration', num: H.phones.admin.display, where: 'Contact page' },
];

const EMAILS = [
  { email: H.emails.main, where: 'Contact page' },
  { email: H.emails.footer, where: 'Footer' },
];

const HOURS = [
  { what: 'Emergency and ICU', when: H.opdHours.emergency.en, where: 'Everywhere' },
  { what: 'Morning OPD', when: H.opdHours.contactMorning.replace(/:00/g, ''), where: 'Contact page' },
  { what: 'Morning OPD', when: H.opdHours.morning.en, where: 'Header and footer' },
  { what: 'Evening OPD', when: H.opdHours.evening.en, where: 'Everywhere' },
];

const ADDRESS = H.address.en;
const MORNING_CONFLICT = HOURS[1].when !== HOURS[2].when;
const EMAIL_CONFLICT = H.emails.main !== H.emails.footer;

const humanRole = (role?: string) =>
  role
    ? role
        .toLowerCase()
        .split('_')
        .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join(' ')
    : 'Hospital admin';

const Row: React.FC<{ label: React.ReactNode; value: React.ReactNode; note?: React.ReactNode }> = ({ label, value, note }) => (
  <li className="px-5 py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-0.5 sm:gap-4">
    <span className="sm:col-span-4 text-sm text-stone-500">{label}</span>
    <span className="sm:col-span-5 text-[#1C2321] break-words">{value}</span>
    <span className="sm:col-span-3 text-sm text-stone-500 sm:text-right">{note}</span>
  </li>
);

export const AdminSettingsPage: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Hospital details</h1>
        <p className="mt-1 text-stone-600">
          The phone numbers, email, address and hours patients currently see on the website.
        </p>
      </div>

      {(MORNING_CONFLICT || EMAIL_CONFLICT) && (
      <div role="note" className="p-4 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900 space-y-1.5">
        <p className="font-semibold">The website shows two different versions of some details. Please confirm which is right.</p>
        {MORNING_CONFLICT && (
        <p>
          Morning OPD: the contact page says {HOURS[1].when}, but the header and footer say {HOURS[2].when}.
        </p>
        )}
        {EMAIL_CONFLICT && (
        <p>
          Email: the contact page shows {H.emails.main}, but the footer shows {H.emails.footer}.
        </p>
        )}
        <p>Tell your developer the correct ones and they will make every page match.</p>
      </div>
      )}

      <section className="bg-white border border-[#E7E3DA] rounded-lg">
        <div className="px-5 py-4 border-b border-[#E7E3DA]">
          <h2 className="text-lg">Phone numbers</h2>
        </div>
        <ul className="divide-y divide-[#E7E3DA]">
          {PHONES.map((p) => (
            <Row
              key={p.num}
              label={p.label}
              value={
                <a href={`tel:${p.num.replace(/\s/g, '')}`} className="font-medium hover:text-[#0F766E]">
                  {p.num}
                </a>
              }
              note={p.where}
            />
          ))}
        </ul>
      </section>

      <section className="bg-white border border-[#E7E3DA] rounded-lg">
        <div className="px-5 py-4 border-b border-[#E7E3DA]">
          <h2 className="text-lg">Email and address</h2>
        </div>
        <ul className="divide-y divide-[#E7E3DA]">
          {EMAILS.map((e) => (
            <Row
              key={e.where}
              label="Email"
              value={
                <span className="flex items-center gap-1.5">
                  {EMAIL_CONFLICT && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" aria-hidden />}
                  {e.email}
                </span>
              }
              note={e.where}
            />
          ))}
          <Row label="Address" value={ADDRESS} note="Contact page and footer" />
        </ul>
      </section>

      <section className="bg-white border border-[#E7E3DA] rounded-lg">
        <div className="px-5 py-4 border-b border-[#E7E3DA]">
          <h2 className="text-lg">Opening hours</h2>
        </div>
        <ul className="divide-y divide-[#E7E3DA]">
          {HOURS.map((h) => {
            const conflict = MORNING_CONFLICT && h.what === 'Morning OPD';
            return (
              <Row
                key={h.what + h.when}
                label={h.what}
                value={
                  <span className="flex items-center gap-1.5">
                    {conflict && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" aria-hidden />}
                    {h.when}
                  </span>
                }
                note={h.where}
              />
            );
          })}
        </ul>
        <p className="px-5 py-3 border-t border-[#E7E3DA] text-sm text-stone-500">
          Each doctor’s own booking hours are set separately under OPD timings.
        </p>
      </section>

      <section className="bg-white border border-[#E7E3DA] rounded-lg">
        <div className="px-5 py-4 border-b border-[#E7E3DA]">
          <h2 className="text-lg">Your account</h2>
        </div>
        <ul className="divide-y divide-[#E7E3DA]">
          <Row label="Name" value={admin?.name || 'Not known'} />
          <Row label="Email" value={admin?.email || 'Not known'} />
          <Row label="Role" value={humanRole(admin?.role)} />
        </ul>
        <div className="px-5 py-4 border-t border-[#E7E3DA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-stone-500">Sign out when you leave a shared computer.</p>
          <button type="button" onClick={signOut} className="btn-secondary text-sm self-start sm:self-auto">
            Sign out
          </button>
        </div>
      </section>

      <p className="text-sm text-stone-600 max-w-3xl">
        These details are part of the website’s pages and cannot be edited from here. To change a number, email,
        address or hours, ask your developer.
      </p>
    </div>
  );
};
