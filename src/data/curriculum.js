// ============================================================================
// CURRICULUM DATA  —  FRONTEND PLACEHOLDER, FULLY EDITABLE
// ============================================================================
// The subjects and timetables below are sample data used to build the website
// interface. The school's actual class-wise curriculum and timetables should
// be confirmed by the school administration and edited directly in this file.
//
// HOW TO EDIT:
//  • To change the subjects of a class, edit its `subjects` array below.
//  • For Class 11 & 12, subjects are edited per stream (science / commerce /
//    humanities).
//  • Timetables are shared per group of classes (prePrimary, primary, middle,
//    secondary, science, commerce, humanities). Edit the TIMETABLES object at
//    the bottom of this file. Days are ordered Monday → Saturday.
// ============================================================================

export const CLASSES = [
  {
    id: 'nursery',
    label: 'Nursery',
    stage: 'Pre-Primary',
    age: '3+ years',
    summary:
      'A gentle, play-based introduction to school life. Children settle into a routine, learn to share, speak, listen and take their first steps into reading, numbers and writing readiness.',
    highlights: [
      'Play-way and activity-based learning, no formal examinations',
      'Focus on speech, fine motor skills and social habits',
      'Colourful, safe classrooms with caring teachers',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Environmental / General Awareness',
      'Art & Craft',
      'Rhymes',
      'Physical Activities',
    ],
    timetable: 'prePrimary',
  },
  {
    id: 'lkg',
    label: 'LKG',
    stage: 'Pre-Primary',
    age: '4+ years',
    summary:
      'In Lower Kindergarten, children begin recognising letters and numbers, learn through rhymes, stories and hands-on activities, and grow comfortable expressing themselves in the classroom.',
    highlights: [
      'Early phonics, letter recognition and pre-number concepts',
      'Storytelling, rhymes and show-and-tell to build speech',
      'Art, craft and outdoor play woven into the daily timetable',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Environmental / General Awareness',
      'Art & Craft',
      'Rhymes & Storytelling',
      'Physical Education',
    ],
    timetable: 'prePrimary',
  },
  {
    id: 'ukg',
    label: 'UKG',
    stage: 'Pre-Primary',
    age: '5+ years',
    summary:
      'Upper Kindergarten prepares children for Class 1 — reading simple words, writing neatly, counting with understanding, and following classroom discipline with confidence.',
    highlights: [
      'Reading and writing readiness for formal schooling',
      'Number work, patterns and early problem solving',
      'Stage exposure through rhymes, recitation and celebrations',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Environmental / General Awareness',
      'Art & Craft',
      'Rhymes & Storytelling',
      'Physical Education',
    ],
    timetable: 'prePrimary',
  },
  {
    id: 'class-1',
    label: 'Class 1',
    stage: 'Primary',
    age: '6+ years',
    summary:
      'The first year of formal schooling. Children begin structured reading, writing and arithmetic, with plenty of activity, art and play to keep learning joyful.',
    highlights: [
      'Strong focus on reading, handwriting and number sense',
      'Activity-based EVS lessons about the world around us',
      'Gentle introduction to tests and classroom routine',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Environmental Studies (EVS)',
      'Computer',
      'General Knowledge',
      'Art & Craft',
      'Physical Education',
    ],
    timetable: 'primary',
  },
  {
    id: 'class-2',
    label: 'Class 2',
    stage: 'Primary',
    age: '7+ years',
    summary:
      'Children build fluency in reading and writing, master addition and subtraction, and begin exploring the environment, good habits and simple computer skills.',
    highlights: [
      'Reading fluency and cursive handwriting practice',
      'Mental maths and tables made enjoyable',
      'Weekly computer, GK, art and sports periods',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Environmental Studies (EVS)',
      'Computer',
      'General Knowledge',
      'Art & Craft',
      'Physical Education',
    ],
    timetable: 'primary',
  },
  {
    id: 'class-3',
    label: 'Class 3',
    stage: 'Primary',
    age: '8+ years',
    summary:
      'The foundation widens — children move from learning to read towards reading to learn, with introduction of structured Science and Social Studies concepts.',
    highlights: [
      'Concept-based Science and Social Studies begin',
      'Paragraph writing and spoken English practice',
      'Tables, mental maths and word problems',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Studies',
      'Computer',
      'General Knowledge',
      'Art & Craft',
      'Physical Education',
    ],
    timetable: 'primary',
  },
  {
    id: 'class-4',
    label: 'Class 4',
    stage: 'Primary',
    age: '9+ years',
    summary:
      'Students deepen their understanding of Science, Social Studies and Mathematics, take on longer written work, and participate more in class discussions and activities.',
    highlights: [
      'Emphasis on understanding, not memorisation',
      'Regular dictation, mental maths and comprehension work',
      'Projects, charts and activity-based assessment',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Studies',
      'Computer',
      'General Knowledge',
      'Art & Craft',
      'Physical Education',
    ],
    timetable: 'primary',
  },
  {
    id: 'class-5',
    label: 'Class 5',
    stage: 'Primary',
    age: '10+ years',
    summary:
      'The final primary year consolidates reading, writing, arithmetic and general awareness, preparing students for the step up to middle school.',
    highlights: [
      'Revision and consolidation of all primary concepts',
      'Essay writing, grammar and spoken English',
      'Exam practice with descriptive answers',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Studies',
      'Computer',
      'General Knowledge',
      'Art & Craft',
      'Physical Education',
    ],
    timetable: 'primary',
  },
  {
    id: 'class-6',
    label: 'Class 6',
    stage: 'Middle School',
    age: '11+ years',
    summary:
      'Middle school begins. Students take on full subject teachers, a third language, laboratory-based Science and a more analytical approach to every subject.',
    highlights: [
      'Separate Science, Social Science and Sanskrit begin',
      'Introduction to laboratory and practical work',
      'Study skills, note-making and exam technique',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer / Information Technology',
      'Sanskrit',
      'Physical Education',
      'Art Education',
    ],
    timetable: 'middle',
  },
  {
    id: 'class-7',
    label: 'Class 7',
    stage: 'Middle School',
    age: '12+ years',
    summary:
      'Students grow more independent — handling algebra, descriptive answers, scientific diagrams and longer projects across subjects.',
    highlights: [
      'Algebra, geometry and data handling in Mathematics',
      'Map work and source-based answers in Social Science',
      'Hands-on experiments and practical notebooks',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer / Information Technology',
      'Sanskrit',
      'Physical Education',
      'Art Education',
    ],
    timetable: 'middle',
  },
  {
    id: 'class-8',
    label: 'Class 8',
    stage: 'Middle School',
    age: '13+ years',
    summary:
      'The final middle-school year bridges into the secondary stage, with rigorous practice in writing, problem solving and scientific reasoning.',
    highlights: [
      'Preparation for the academic demand of Classes 9–10',
      'Chapter-wise tests and regular revision cycles',
      'Career awareness and study-habit guidance',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer / Information Technology',
      'Sanskrit',
      'Physical Education',
      'Art Education',
    ],
    timetable: 'middle',
  },
  {
    id: 'class-9',
    label: 'Class 9',
    stage: 'Secondary',
    age: '14+ years',
    summary:
      'The secondary stage begins with the CBSE pattern — structured syllabus, periodic assessments and a clear focus on building towards the Class 10 board examination.',
    highlights: [
      'CBSE pattern of assessments and internal evaluation',
      'Strong drill in Mathematics, Science and Social Science',
      'Practical work, lab records and project submissions',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer Applications (Elective)',
      'Physical & Health Education',
      'Art Education',
    ],
    timetable: 'secondary',
  },
  {
    id: 'class-10',
    label: 'Class 10',
    stage: 'Secondary',
    age: '15+ years',
    summary:
      'The board examination year. Teaching is organised around the CBSE syllabus, sample-paper practice, practicals and steady, low-pressure revision.',
    highlights: [
      'Complete CBSE syllabus coverage with planned revision',
      'Sample papers, pre-boards and answer-writing practice',
      'Stream-selection counselling for Class 11',
    ],
    subjects: [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer Applications (Elective)',
      'Physical & Health Education',
      'Art Education',
    ],
    timetable: 'secondary',
  },
  {
    id: 'class-11',
    label: 'Class 11',
    stage: 'Senior Secondary',
    age: '16+ years',
    summary:
      'Students choose a stream — Science, Commerce or Humanities — and begin focused senior secondary study with specialisation, practicals and career orientation.',
    highlights: [
      'Three streams offered: Science, Commerce and Humanities',
      'Stream-wise subject combinations as per CBSE norms',
      'Guidance for competitive and career pathways',
    ],
    hasStreams: true,
    timetable: 'per-stream',
  },
  {
    id: 'class-12',
    label: 'Class 12',
    stage: 'Senior Secondary',
    age: '17+ years',
    summary:
      'The final school year, centred on the CBSE board examinations — systematic revision, practical and project work, and preparation for college and careers beyond school.',
    highlights: [
      'Board-focused teaching with pre-board examinations',
      'Practicals, projects and internal assessment support',
      'College application and career guidance',
    ],
    hasStreams: true,
    timetable: 'per-stream',
  },
]

// ----------------------------------------------------------------------------
// STREAMS FOR CLASS 11 & 12  (sample combinations — edit as per school offering)
// ----------------------------------------------------------------------------
export const STREAMS = {
  science: {
    id: 'science',
    label: 'Science',
    icon: 'FlaskConical',
    blurb:
      'For students inclined towards medicine, engineering, research and the pure sciences.',
    subjects: [
      'English (Core)',
      'Physics',
      'Chemistry',
      'Mathematics',
      'Biology / Computer Science',
      'Physical Education',
    ],
    timetable: 'science',
  },
  commerce: {
    id: 'commerce',
    label: 'Commerce',
    icon: 'Briefcase',
    blurb:
      'For students headed towards business, finance, accountancy, management and entrepreneurship.',
    subjects: [
      'English (Core)',
      'Accountancy',
      'Business Studies',
      'Economics',
      'Mathematics / Applied Mathematics',
      'Entrepreneurship / Physical Education',
    ],
    timetable: 'commerce',
  },
  humanities: {
    id: 'humanities',
    label: 'Arts / Humanities',
    icon: 'Landmark',
    blurb:
      'For students drawn to civil services, law, design, teaching, social sciences and the liberal arts.',
    subjects: [
      'English (Core)',
      'History',
      'Political Science',
      'Geography',
      'Economics',
      'Sociology / Psychology',
    ],
    timetable: 'humanities',
  },
}

// Options used in the contact & admission enquiry forms (generated from above)
export const CLASS_OPTIONS = [
  'Nursery',
  'LKG',
  'UKG',
  ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`),
  'Class 11 – Science',
  'Class 11 – Commerce',
  'Class 11 – Humanities',
  'Class 12 – Science',
  'Class 12 – Commerce',
  'Class 12 – Humanities',
]

// ----------------------------------------------------------------------------
// SAMPLE TIMETABLES  (front-end placeholders — replace with actual timetables)
// ----------------------------------------------------------------------------
// `days` arrays are ordered: Monday, Tuesday, Wednesday, Thursday, Friday,
// Saturday. Rows marked with `breakRow: true` render as break/lunch rows.
// ----------------------------------------------------------------------------

const DAY_TIMES = ['08:00 – 08:40', '08:40 – 09:20', '09:35 – 10:15', '10:15 – 10:55', '10:55 – 11:35', '12:05 – 12:45', '12:45 – 13:25', '13:25 – 14:05']

function buildDay(periods) {
  const rows = []
  const times = [...DAY_TIMES]
  let periodNo = 0
  for (const days of periods) {
    if (days === 'SHORT BREAK') {
      rows.push({ breakRow: true, label: 'Short Break', time: '09:20 – 09:35' })
      continue
    }
    if (days === 'LUNCH') {
      rows.push({ breakRow: true, label: 'Lunch Break', time: '11:35 – 12:05' })
      continue
    }
    rows.push({ period: ++periodNo, time: times.shift(), days })
  }
  return rows
}

export const TIMETABLES = {
  prePrimary: {
    label: 'Pre-Primary (Nursery – UKG) · 9:00 AM – 12:30 PM',
    periodLabel: 'Period',
    rows: [
      { period: 1, time: '09:00 – 09:30', days: ['Assembly & Rhymes', 'Rhymes & Action Songs', 'Assembly & Rhymes', 'Rhymes & Action Songs', 'Assembly & Rhymes', 'Activity & Free Play'] },
      { period: 2, time: '09:30 – 10:05', days: ['English', 'English', 'English', 'Hindi', 'Hindi', 'Art & Craft'] },
      { period: 3, time: '10:05 – 10:40', days: ['Mathematics', 'Mathematics', 'Hindi', 'Mathematics', 'English', 'Rhymes'] },
      { breakRow: true, label: 'Snack Break', time: '10:40 – 11:00' },
      { period: 4, time: '11:00 – 11:35', days: ['EVS / GK', 'Art & Craft', 'Mathematics', 'English', 'EVS / GK', 'Outdoor Play'] },
      { period: 5, time: '11:35 – 12:10', days: ['Outdoor Play', 'EVS / GK', 'Art & Craft', 'Story Time', 'Music & Movement', 'Story Time'] },
      { period: 6, time: '12:10 – 12:30', days: ['Story Time & Pack-up', 'Story Time & Pack-up', 'Story Time & Pack-up', 'Story Time & Pack-up', 'Story Time & Pack-up', 'Pack-up'] },
    ],
  },

  primary: {
    label: 'Primary (Classes 1 – 5) · 8:00 AM – 2:05 PM',
    periodLabel: 'Period',
    rows: buildDay([
      ['English', 'Mathematics', 'Hindi', 'English', 'Mathematics', 'Computer'],
      ['Mathematics', 'English', 'EVS', 'Hindi', 'English', 'Art & Craft'],
      'SHORT BREAK',
      ['Hindi', 'EVS', 'Mathematics', 'Mathematics', 'Hindi', 'General Knowledge'],
      ['EVS', 'Hindi', 'English', 'EVS', 'Mathematics', 'Music'],
      ['Mathematics', 'Computer', 'English', 'General Knowledge', 'EVS', 'Library'],
      'LUNCH',
      ['Computer', 'Physical Education', 'Art & Craft', 'Hindi', 'English', 'Physical Education'],
      ['Art & Craft', 'General Knowledge', 'Computer', 'Music', 'Physical Education', 'Class Activity'],
      ['Library', 'Art & Craft', 'Physical Education', 'English', 'Hindi', 'Club Activity'],
    ]),
  },

  middle: {
    label: 'Middle School (Classes 6 – 8) · 8:00 AM – 2:05 PM',
    periodLabel: 'Period',
    rows: buildDay([
      ['English', 'Mathematics', 'Science', 'Hindi', 'Mathematics', 'Sanskrit'],
      ['Mathematics', 'English', 'Hindi', 'Science', 'English', 'Computer'],
      'SHORT BREAK',
      ['Science', 'Social Science', 'Mathematics', 'English', 'Hindi', 'Art Education'],
      ['Hindi', 'Science', 'Social Science', 'Mathematics', 'Science', 'Library'],
      ['Social Science', 'Hindi', 'English', 'Sanskrit', 'Social Science', 'Physical Education'],
      'LUNCH',
      ['Computer', 'Sanskrit', 'Science', 'Social Science', 'English', 'General Knowledge'],
      ['Sanskrit', 'Computer', 'Physical Education', 'Art Education', 'Computer', 'Club Activity'],
      ['Art Education', 'Library', 'General Knowledge', 'Physical Education', 'Mathematics', 'Weekly Test'],
    ]),
  },

  secondary: {
    label: 'Secondary (Classes 9 – 10) · 8:00 AM – 2:05 PM',
    periodLabel: 'Period',
    rows: buildDay([
      ['Mathematics', 'English', 'Science', 'Mathematics', 'English', 'Science'],
      ['Science', 'Mathematics', 'Social Science', 'English', 'Mathematics', 'Computer Applications'],
      'SHORT BREAK',
      ['English', 'Science', 'Mathematics', 'Social Science', 'Hindi', 'Health & PE'],
      ['Social Science', 'Hindi', 'English', 'Science', 'Social Science', 'Library'],
      ['Hindi', 'Social Science', 'Science', 'Hindi', 'Science', 'Art Education'],
      'LUNCH',
      ['Computer Applications', 'Physical Education', 'Social Science', 'Computer Applications', 'Mathematics', 'Mathematics Practice'],
      ['Science Lab', 'Computer Applications', 'Health & PE', 'Art Education', 'English', 'Club Activity'],
      ['Library', 'Art Education', 'English', 'Physical Education', 'Social Science', 'Weekly Test'],
    ]),
  },

  science: {
    label: 'Senior Secondary — Science · 8:00 AM – 2:05 PM',
    periodLabel: 'Period',
    rows: buildDay([
      ['Physics', 'Chemistry', 'English', 'Mathematics', 'Physics', 'Chemistry'],
      ['Chemistry', 'Mathematics', 'Physics', 'Chemistry', 'Mathematics', 'Physics'],
      'SHORT BREAK',
      ['Mathematics', 'Physics', 'Mathematics', 'English', 'Chemistry', 'Mathematics'],
      ['English', 'Biology / CS', 'Chemistry', 'Physics', 'Biology / CS', 'Library'],
      ['Biology / CS', 'English', 'Biology / CS', 'Biology / CS', 'English', 'Physical Education'],
      'LUNCH',
      ['Physics Practical', 'Chemistry Practical', 'Biology / CS Lab', 'Mathematics', 'Self Study', 'Physics Practical'],
      ['Self Study', 'Physical Education', 'English', 'Computer Lab', 'Physics', 'Chemistry Practical'],
      ['Library', 'Self Study', 'Mathematics', 'Self Study', 'Chemistry', 'Weekly Test'],
    ]),
  },

  commerce: {
    label: 'Senior Secondary — Commerce · 8:00 AM – 2:05 PM',
    periodLabel: 'Period',
    rows: buildDay([
      ['Accountancy', 'Business Studies', 'Economics', 'Accountancy', 'Business Studies', 'Economics'],
      ['Business Studies', 'Accountancy', 'English', 'Economics', 'Accountancy', 'Accountancy'],
      'SHORT BREAK',
      ['Economics', 'English', 'Accountancy', 'Business Studies', 'Mathematics', 'Business Studies'],
      ['English', 'Economics', 'Mathematics', 'English', 'Economics', 'Library'],
      ['Mathematics', 'Accountancy', 'Business Studies', 'Mathematics', 'English', 'Physical Education'],
      'LUNCH',
      ['Entrepreneurship', 'Mathematics', 'Economics', 'Accountancy', 'Business Studies', 'Entrepreneurship'],
      ['Self Study', 'Physical Education', 'English', 'Economics', 'Accountancy', 'Club Activity'],
      ['Library', 'Self Study', 'Business Studies', 'Self Study', 'Economics', 'Weekly Test'],
    ]),
  },

  humanities: {
    label: 'Senior Secondary — Humanities · 8:00 AM – 2:05 PM',
    periodLabel: 'Period',
    rows: buildDay([
      ['History', 'Political Science', 'English', 'Geography', 'History', 'Economics'],
      ['Political Science', 'History', 'Geography', 'English', 'Political Science', 'History'],
      'SHORT BREAK',
      ['English', 'Economics', 'Political Science', 'History', 'Geography', 'Political Science'],
      ['Geography', 'English', 'Economics', 'Sociology / Psychology', 'English', 'Library'],
      ['Economics', 'History', 'Geography', 'Economics', 'Sociology / Psychology', 'Physical Education'],
      'LUNCH',
      ['Sociology / Psychology', 'Physical Education', 'English', 'Political Science', 'History', 'Self Study'],
      ['Self Study', 'Library', 'Geography', 'Economics', 'Political Science', 'Club Activity'],
      ['Library', 'Self Study', 'History', 'Self Study', 'English', 'Weekly Test'],
    ]),
  },
}
