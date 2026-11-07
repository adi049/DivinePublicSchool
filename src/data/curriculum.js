// ============================================================================
// CURRICULUM DATA — CLASS PROFILES (descriptions, highlights) AND SUBJECT SEEDS
// ============================================================================
// Class summaries/highlights below are editable here. SUBJECT LISTS are now
// managed from the Admin Dashboard (Manage Subjects): the arrays in this file
// are used once to seed the subject service on first run, after which the
// saved lists in src/services/subjectService.js are the live source.
//
// HOW TO EDIT:
//  • To change the subjects of a class, edit its `subjects` array below.
//  • For Class 11 & 12, subjects are edited per stream (science / commerce /
//    humanities).
//// ============================================================================

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
  },
  {
    id: 'kg',
    label: 'KG',
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
  },
  {
    id: 'ekg',
    label: 'EKG',
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
  },
  arts: {
    id: 'arts',
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
  },
}

// Options used in the contact & admission enquiry forms (generated from above)
export const CLASS_OPTIONS = [
  'Nursery',
  'KG',
  'EKG',
  ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`),
  'Class 11 – Science',
  'Class 11 – Commerce',
  'Class 11 – Arts',
  'Class 12 – Science',
  'Class 12 – Commerce',
  'Class 12 – Arts',
]

// ----------------------------------------------------------------------------
// TIMETABLES & DATE SHEETS
// ----------------------------------------------------------------------------
// Timetables and examination date sheets are uploaded as photographs / PDFs by
// the school office through the Admin Dashboard (Manage Timetables / Date
// Sheets) and stored via src/services/. No table data lives in this file.
// ----------------------------------------------------------------------------
