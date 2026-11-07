// ============================================================================
// PUBLIC MANDATORY DISCLOSURE  —  OFFICIAL DATA
// ============================================================================
// Content sourced from the school's official Public Mandatory Disclosure page

import { assetUrl } from '../utils/assetUrl.js'
// (divinepublicschoolgurgaon.com/public-mandatory-disclosure). Documents are
// stored locally in /public/documents/. Update this file when the school
// publishes revised data or documents.
// ============================================================================

export const DISCLOSURE_GENERAL = [
  { label: 'Name of the School', value: 'Divine Public School' },
  { label: 'Affiliation No. (if applicable)', value: 'NA' },
  { label: 'School Code (if applicable)', value: 'NA' },
  {
    label: 'Complete Address with PIN Code',
    value: 'Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana 122102',
  },
  { label: 'Principal Name & Qualification', value: 'Mrs. Nisha Sharma, M.A., B.Ed.' },
  { label: 'School Email ID', value: 'divinepublicschool2003@gmail.com' },
  { label: 'Contact Details (Mobile)', value: '+91-9953275511, +91-9999789418' },
]

export const DISCLOSURE_STAFF = [
  { label: 'Principal', value: 'Mrs. Nisha Sharma' },
  { label: 'Total No. of Teachers', value: '21 (PGT: 04, TGT: 08, PRT: 05)' },
  { label: 'Teacher–Section Ratio', value: '1.5:1' },
  { label: 'Special Educator', value: 'Mrs. Shweta' },
  { label: 'Counsellor & Wellness Teacher', value: 'Mrs. Purnima' },
]

export const DISCLOSURE_INFRA = [
  { label: 'Total Campus Area', value: '4056 sq. mtr.' },
  { label: 'No. & Size of Classrooms', value: '18 classrooms · 48 sq. mtr.' },
  { label: 'No. & Size of Laboratories (incl. Computer Lab)', value: '4 labs · 54 sq. mtr.' },
  { label: 'Internet Facility', value: 'Yes' },
  { label: 'No. of Girls Toilets', value: '7' },
  { label: 'No. of Boys Toilets', value: '7' },
  {
    label: 'Inspection Video (Infrastructure)',
    value: 'YouTube',
    href: 'https://www.youtube.com/watch?v=ZasueYpzVqQ',
  },
]

// Documents are served from /public/documents/ (downloaded from the official site)
export const DISCLOSURE_DOCUMENTS = [
  {
    group: 'Documents & Information',
    items: [
      {
        label: 'Society / Trust Registration Certificate',
        href: assetUrl('/documents/society-registration.pdf'),
      },
      {
        label: 'No Objection Certificate (NOC) — State Government',
        href: assetUrl('/documents/state-noc.pdf'),
      },
      {
        label: 'Recognition Certificate under RTE Act, 2009',
        href: assetUrl('/documents/recognition-certificate.pdf'),
      },
      {
        label: 'Building Safety Certificate (National Building Code)',
        href: assetUrl('/documents/building-safety-certificate.pdf'),
      },
      {
        label: 'Fire Safety Certificate',
        href: assetUrl('/documents/fire-safety-certificate.pdf'),
      },
      {
        label: 'DEO Certificate',
        href: assetUrl('/documents/deo-certificate.pdf'),
      },
      {
        label: 'Water, Health & Sanitation Certificate',
        href: assetUrl('/documents/health-sanitation-certificate.pdf'),
      },
    ],
  },
  {
    group: 'Results & Academics',
    items: [
      { label: 'Fee Structure of the School', href: assetUrl('/documents/fee-structure.pdf') },
      { label: 'Annual Academic Calendar', href: assetUrl('/documents/academic-calendar.pdf') },
      { label: 'School Management Committee (SMC) — List', href: assetUrl('/documents/smc-list.pdf') },
      { label: 'Parent Teacher Association (PTA) — Members', href: assetUrl('/documents/pta-list.pdf') },
    ],
  },
]
