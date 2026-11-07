// ============================================================
// SCHOOL INFORMATION  —  EDIT THIS FILE TO UPDATE SITE CONTENT
// ============================================================
// This file is the single source of truth for official school

import { assetUrl } from '../utils/assetUrl.js'
// details. Components read from here, so pages stay consistent.
// A future Admin Panel can manage the data in this file.
// ============================================================

import {
  BookOpen,
  Users,
  Sprout,
  Palette,
  ShieldCheck,
  Eye,
  Target,
  Lightbulb,
  HeartHandshake,
  School,
  Presentation,
  LibraryBig,
  FlaskConical,
  Trees,
  Dices,
  Droplets,
  Music,
  Video,
  Bus,
} from 'lucide-react'

export const SCHOOL = {
  name: 'Divine Public School',
  tagline: 'Vatika Kunj Ext., Gurugram · CBSE Curriculum',
  board: 'CBSE',
  address: 'Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana 122102',
  addressShort: 'Vatika Kunj Ext., Gurugram',
  classesOffered: 'Nursery – Class XII',
  session: '2026–27',
  phones: [
    { label: 'Phone 1', display: '9953275511', href: 'tel:+919953275511' },
    { label: 'Phone 2', display: '9999789418', href: 'tel:+919999789418' },
  ],
  email: {
    display: 'divinepublicschool2003@gmail.com',
    href: 'mailto:divinepublicschool2003@gmail.com',
  },
  whatsapp: {
    display: '9953275511',
    // wa.me requires the country code; 91 = India
    url: 'https://wa.me/919953275511',
  },
  // Official Google Maps location provided by the school
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Divine%20public%20school%20937Q%2BWF9%2C%20Nayagaon%20Rd%2C%20Vatika%20Kunj%20Extension%2C%20Gurugram%2C%20Haryana%20122102%2C%20India',
  visitingNote: 'Please call the school office before planning a visit',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Curriculum', to: '/curriculum' },
  { label: 'Contact Us', to: '/contact' },
]

// ------------------------------------------------------------
// DIRECTOR'S PROFILE  (official details provided by the school)
// ------------------------------------------------------------
export const DIRECTOR = {
  name: 'Mr. Bhumesh Chander',
  designation: 'Director, Divine Public School',
  photo: assetUrl('images/director-bhumesh-chander-new.jpg'),
  photoAlt: 'Mr. Bhumesh Chander, Director of Divine Public School, at his office desk',
  // Short excerpt shown in the home-page preview (first lines of the message)
  excerpt:
    'Education without moral is like a shift without a compass merely wondering nowhere.',
  // Official Director's message — keep verbatim, only paragraph formatting applied.
  message: [
    'Education without moral is like a shift without a compass merely wondering nowhere.',
    'Divine Public School would like to extend his warmest welcome to all new prospective students.',
    'We at Divine Public School are going to provide 360° development to students giving them sufficient exposure and competitive environment. A successful person in life is a result of loving parents and laborious teachers who believe in the students and make them understand the basic realities of life.',
    'School is going to inculcate moral education which is necessary for the new generation and engage them in creative activities.',
    'Our staff members are careful and patient with children to develop them literally and physically. We believe in your kids and let them explore their capabilities.',
    'Each one of our students will be a successful story. This is my Dream. This is my commitment.',
    'Divine Public School looks forward to have you on its board for creating a more empowered world.',
    'My best wishes to you!',
  ],
  quote: "'Intelligence + Character, that is the goal of True education.'",
  // Short "about the director" notes — replace with an official biography when provided.
  bio: [
    'A detailed profile of Mr. Bhumesh Chander, Director of Divine Public School, will be published here shortly.',
    'For any questions, the Director’s office may be reached through the contact details on this page.',
  ],
}

// ------------------------------------------------------------
// "WHY CHOOSE US" POINTS  (academic-focused, no invented claims)
// ------------------------------------------------------------
export const WHY_CHOOSE = [
  {
    icon: BookOpen,
    title: 'Strong Academic Foundation',
    text: 'Concept-first teaching, regular practice and personal attention in every classroom, from Nursery to the board classes.',
  },
  {
    icon: Users,
    title: 'Experienced & Caring Educators',
    text: 'Teachers who guide their students patiently, pay attention to each child’s progress and keep parents informed.',
  },
  {
    icon: Sprout,
    title: 'Holistic Development',
    text: 'Academics balanced with sports, art, music and life skills, so children grow in confidence and character.',
  },
  {
    icon: Palette,
    title: 'Co-curricular Learning',
    text: 'Activities, celebrations, exhibitions and club periods that build teamwork, expression and stage confidence.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Supportive Environment',
    text: 'A disciplined and caring school environment where children are treated with respect and encouraged to do their best.',
  },
]

// ------------------------------------------------------------
// FACILITIES  (official list from the school's website)
// ------------------------------------------------------------
export const FACILITIES = [
  {
    icon: School,
    title: 'Classrooms',
    text: 'Properly ventilated and furnished classrooms for effective teaching.',
  },
  {
    icon: Presentation,
    title: 'Blackboards, Whiteboards & Smartboards',
    text: 'Teaching aids that support clear, engaging lessons.',
  },
  {
    icon: LibraryBig,
    title: 'Library',
    text: 'Books, reference materials and digital resources.',
  },
  {
    icon: FlaskConical,
    title: 'Laboratories',
    text: 'Science labs (Physics, Chemistry, Biology), Computer lab and Mathematics lab.',
  },
  {
    icon: Trees,
    title: 'Playground',
    text: 'For outdoor games and physical activities.',
  },
  {
    icon: Dices,
    title: 'Indoor Sports Room',
    text: 'Table tennis, chess, carrom and more.',
  },
  {
    icon: Droplets,
    title: 'Drinking Water & Sanitation',
    text: 'Safe drinking water and separate toilets for boys and girls.',
  },
  {
    icon: Music,
    title: 'Music, Dance & Art Rooms',
    text: 'Dedicated rooms for creative activities.',
  },
  {
    icon: Video,
    title: 'CCTV Monitoring',
    text: 'CCTV across the campus for monitoring and safety.',
  },
  {
    icon: Bus,
    title: 'School Buses / Transport',
    text: 'Transport facility for student commuting.',
  },
]

// ------------------------------------------------------------
// ABOUT PAGE — VISION / MISSION / PHILOSOPHY  (editable placeholders)
// ------------------------------------------------------------
export const SCHOOL_VALUES = [
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'To be a school that families in our community trust — where children receive a strong academic grounding and grow into capable, compassionate and confident young people.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To provide quality CBSE education in a safe and caring environment; to employ dedicated teachers; and to give every child — whatever their starting point — the attention and encouragement they need to succeed.',
  },
  {
    icon: Lightbulb,
    title: 'Educational Philosophy',
    text: 'Children learn best when they feel secure, are encouraged to ask questions, and are taught through understanding rather than memorisation. We teach for clarity first, and marks follow.',
  },
  {
    icon: Sprout,
    title: 'Student Development',
    text: 'Alongside the syllabus, we invest in reading habits, handwriting, spoken English, sports, art and value education — the everyday habits that shape a child’s future.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Values',
    text: 'Respect, honesty, discipline and service. We expect our students to work hard, to be kind, to respect their teachers and parents, and to take pride in their school.',
  },
]

// Official "About School" text from the school's website (about-us page).
export const ABOUT_INTRO = [
  'Divine Public School promises to create a strong environment for students to meet the present needs of wide-ranging knowledge. Our school is dedicated to the noble motive of moulding the next generation to be responsible, educated, empathetic, capable, disciplined, and value-driven. The management would be more than happy to know if they can do anything more for students’ multifaceted and comprehensive development and exposure.',
  'We believe in inculcating a culture of learning where students understand the concepts rather than mugging up answers for the sake of marks, which will eventually do more harm than good. The school encourages participation from parents, who can put forward helpful and productive ideas.',
  'The lesson plans are tailored to the topic, and interaction between students and teachers across diverse fields related to the topic of study is highly encouraged. The lesson plans also include hands-on experience wherever appropriate.',
  'The school offers classes from Nursery to Class XII with Science, Commerce and Humanities streams at the senior secondary level, and follows the CBSE curriculum pattern.',
]
