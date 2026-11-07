// ============================================================================
// CLASS & STREAM CATALOGUE — single source of truth
// ============================================================================
// Every service, admin screen and public component refers to classes through
// these ids so values stay consistent everywhere (and map 1:1 onto future
// Supabase rows: timetables.class_id, subjects.class_id, date_sheets…).
// ============================================================================

export const CLASS_LIST = [
  { id: 'nursery', label: 'Nursery', stage: 'Pre-Primary' },
  { id: 'kg', label: 'KG', stage: 'Pre-Primary' },
  { id: 'ekg', label: 'EKG', stage: 'Pre-Primary' },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `class-${i + 1}`,
    label: `Class ${i + 1}`,
    stage:
      i + 1 <= 5 ? 'Primary' : i + 1 <= 8 ? 'Middle School' : i + 1 <= 10 ? 'Secondary' : 'Senior Secondary',
  })),
]

export const STREAM_List_META = { science: 'Science', commerce: 'Commerce', arts: 'Arts / Humanities' }

export const STREAM_LIST = [
  { id: 'science', label: 'Science' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'arts', label: 'Arts / Humanities' },
]

/** Classes that are split into streams. */
export const STREAM_CLASS_IDS = ['class-11', 'class-12']

export function needsStream(classId) {
  return STREAM_CLASS_IDS.includes(classId)
}

export function classLabel(classId) {
  return CLASS_LIST.find((c) => c.id === classId)?.label || classId
}

export function streamLabel(streamId) {
  return STREAM_LIST.find((s) => s.id === streamId)?.label || streamId || ''
}

/** Human label: "Class 11 · Science" or "Class 4". */
export function classFullLabel(classId, stream) {
  const base = classLabel(classId)
  return stream ? `${base} · ${streamLabel(stream)}` : base
}

/** Stable storage key segments for class+stream combos (e.g. 'class-11' / 'class-11:science'). */
export function comboKey(classId, stream) {
  return needsStream(classId) ? `${classId}:${stream}` : classId
}

/** Every valid (class, stream) combination — 15 classes + 6 stream variants. */
export const ALL_COMBOS = CLASS_LIST.flatMap((c) =>
  needsStream(c.id)
    ? STREAM_LIST.map((s) => ({ classId: c.id, stream: s.id, label: `${c.label} ${s.label}` }))
    : [{ classId: c.id, stream: null, label: c.label }],
)
