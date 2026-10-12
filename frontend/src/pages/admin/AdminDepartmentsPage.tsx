import React from 'react';
import { DOCTORS_DATA } from '../../data/doctorsData';
import { DEPARTMENTS, type Department } from '../DepartmentsPage';

// Words in a slug that are too general to match a doctor's department on their own
const GENERIC = new Set(['care', 'surgery', 'medicine', 'and']);

/** Doctors linked to this department, plus any whose department name loosely matches it. */
const doctorsIn = (dept: Department) => {
  const stems = dept.slug
    .split('-')
    .filter((w) => w.length >= 3 && !GENERIC.has(w))
    .map((w) => w.slice(0, 6));
  return DOCTORS_DATA.filter(
    (d) => dept.doctorIds.includes(d.id) || stems.some((s) => new RegExp(`\\b${s}`, 'i').test(d.dept)),
  );
};

export const AdminDepartmentsPage: React.FC = () => (
  <div className="max-w-[1200px] mx-auto space-y-6">
    <div>
      <h1 className="text-2xl sm:text-3xl">Departments</h1>
      <p className="mt-1 text-stone-600">The {DEPARTMENTS.length} departments shown on the website’s Departments page.</p>
    </div>

    <section className="bg-white border border-[#E7E3DA] rounded-lg">
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E7E3DA] text-sm text-stone-500">
        <span className="col-span-4">Department</span>
        <span className="col-span-3">Lead doctor</span>
        <span className="col-span-3">Doctors</span>
        <span className="col-span-2 text-right">Website</span>
      </div>
      <ul className="divide-y divide-[#E7E3DA]">
        {DEPARTMENTS.map((dept) => {
          const lead = DOCTORS_DATA.find((d) => d.id === dept.doctorIds[0]);
          const docs = doctorsIn(dept);
          return (
            <li key={dept.slug} className="px-5 py-4 grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 md:items-start">
              <div className="md:col-span-4 min-w-0">
                <p className="font-medium text-[#1C2321]">{dept.nameEn}</p>
                {dept.nameMr && <p className="text-sm text-stone-500">{dept.nameMr}</p>}
                <p className="text-sm text-stone-500 mt-0.5">{dept.hoursEn}</p>
              </div>
              <div className="md:col-span-3 text-sm text-stone-700">
                <span className="md:hidden text-stone-500">Lead doctor: </span>
                {lead ? lead.name : 'Not set'}
              </div>
              <div className="md:col-span-3 text-sm text-stone-700">
                <span className="md:hidden text-stone-500">Doctors: </span>
                {docs.length} {docs.length === 1 ? 'doctor' : 'doctors'}
                <span className="block text-stone-500">{docs.map((d) => d.name.replace(/^Dr\.\s*/, 'Dr ')).join(', ')}</span>
              </div>
              <div className="md:col-span-2 md:text-right text-sm pt-1 md:pt-0">
                <a
                  href={`/departments/${dept.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F766E] font-semibold hover:underline underline-offset-4"
                >
                  View on website
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>

    <p className="text-sm text-stone-600 max-w-3xl">
      This page is for checking only. Department names, descriptions, OPD hours and which doctors belong to each
      department are part of the website’s pages, so to change them, ask your developer. Doctor counts include doctors
      whose own department title matches, so a doctor can appear under more than one department.
    </p>
  </div>
);
