// ============================================================
// SCHOOL INFORMATION  —  EDIT THIS FILE TO UPDATE SITE CONTENT
// ============================================================

import {
  BookOpen, Users, Sprout, Palette, ShieldCheck, Eye, Target, Lightbulb, HeartHandshake,
} from 'lucide-react'

import { ASSETS } from './assets.js'

export const SCHOOL = {
  name: 'Divine Public School', tagline: 'Vatika Kunj Ext., Gurugram · CBSE Curriculum', board: 'CBSE',
  address: 'Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana 122102', addressShort: 'Vatika Kunj Ext., Gurugram',
  classesOffered: 'Nursery – Class XII', session: '2026–27',
  phones: [{ label: 'Phone 1', display: '9953275511', href: 'tel:+919953275511' }, { label: 'Phone 2', display: '9999789418', href: 'tel:+919999789418' }],
  email: { display: 'divinepublicschool2003@gmail.com', href: 'mailto:divinepublicschool2003@gmail.com' },
  whatsapp: { display: '9953275511', url: 'https://wa.me/919953275511' },
  mapsUrl: 'https://www.google.com/maps?ll=28.364833,77.088651&z=13&t=m&hl=en-US&gl=US&mapclient=embed&cid=8527534613871894791',
  visitingNote: 'Please call the school office before planning a visit',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' }, { label: 'About Us', to: '/about' }, { label: 'Gallery', to: '/gallery' },
  { label: 'Curriculum', to: '/curriculum' }, { label: 'Contact Us', to: '/contact' },
]

export const DIRECTOR = {
  name: 'Mr. Bhumesh Chander', designation: 'Director, Divine Public School', photo: ASSETS.directorBhumeshChander,
  photoAlt: 'Mr. Bhumesh Chander, Director of Divine Public School',
  excerpt: 'Education without moral is like a shift without a compass merely wondering nowhere.',
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
  bio: ['A detailed profile of Mr. Bhumesh Chander, Director of Divine Public School, will be published here shortly.', 'For any questions, the Director’s office may be reached through the contact details on this page.'],
}

export const WHY_CHOOSE = [
  { icon: BookOpen, title: 'Strong Academic Foundation', text: 'Concept-first teaching, regular practice and personal attention in every classroom, from Nursery to the board classes.' },
  { icon: Users, title: 'Experienced & Caring Educators', text: 'Teachers who guide their students patiently, pay attention to each child’s progress and keep parents informed.' },
  { icon: Sprout, title: 'Holistic Development', text: 'Academics balanced with sports, art, music and life skills, so children grow in confidence and character.' },
  { icon: Palette, title: 'Co-curricular Learning', text: 'Activities, celebrations, exhibitions and club periods that build teamwork, expression and stage confidence.' },
  { icon: ShieldCheck, title: 'Safe & Supportive Environment', text: 'A disciplined and caring school environment where children are treated with respect and encouraged to do their best.' },
]

export const SCHOOL_VALUES = [
  { icon: Eye, title: 'Our Vision', text: 'To be a school that families in our community trust — where children receive a strong academic grounding and grow into capable, compassionate and confident young people.' },
  { icon: Target, title: 'Our Mission', text: 'To provide quality CBSE education in a safe and caring environment; to employ dedicated teachers; and to give every child — whatever their starting point — the attention and encouragement they need to succeed.' },
  { icon: Lightbulb, title: 'Educational Philosophy', text: 'Children learn best when they feel secure, are encouraged to ask questions, and are taught through understanding rather than memorisation. We teach for clarity first, and marks follow.' },
  { icon: Sprout, title: 'Student Development', text: 'Alongside the syllabus, we invest in reading habits, handwriting, spoken English, sports, art and value education — the everyday habits that shape a child’s future.' },
  { icon: HeartHandshake, title: 'Our Values', text: 'Respect, honesty, discipline and service. We expect our students to work hard, to be kind, to respect their teachers and parents, and to take pride in their school.' },
]

export const ABOUT_INTRO = [
  'Divine Public School is a CBSE-curriculum school located on Nayagaon Road, Vatika Kunj Extension, Gurugram, Haryana. The school offers classes from Nursery to Class XII, with Science, Commerce and Humanities streams available at the senior secondary level.',
  'The school is built around a simple belief: children do their best when teaching is clear, classrooms are disciplined and caring, and parents and teachers work together. Lessons follow the CBSE framework, while sports, art, music, celebrations and activities keep school life balanced and joyful.',
  'This page will be updated with the school’s detailed history, milestones and achievements as they are shared by the school administration.',
]
