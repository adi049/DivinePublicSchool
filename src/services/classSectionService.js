import { getStoredSessionToken, supabaseRequest } from './supabaseClient.js'

const TABLE = 'class_sections'

function queryValue(value) {
  return encodeURIComponent(String(value))
}

export async function listClassSections(classId, { includeInactive = true } = {}) {
  const filters = [
    'select=*',
    `class_id=eq.${queryValue(classId)}`,
    'order=display_order.asc,section_name.asc',
  ]
  if (!includeInactive) filters.push('active=eq.true')
  return supabaseRequest(`rest/v1/${TABLE}?${filters.join('&')}`, {
    token: getStoredSessionToken(),
  })
}

export async function listAllActiveClassSections() {
  return supabaseRequest(`rest/v1/${TABLE}?select=*&active=eq.true&order=class_id.asc,display_order.asc,section_name.asc`, {
    token: getStoredSessionToken(),
  })
}

export async function createClassSection({ classId, sectionName, displayOrder = 0 }) {
  const cleanName = String(sectionName || '').trim()
  if (!cleanName) throw new Error('Enter a section name.')
  const rows = await supabaseRequest(`rest/v1/${TABLE}?select=*`, {
    method: 'POST',
    token: getStoredSessionToken(),
    prefer: 'return=representation',
    body: [{
      class_id: classId,
      section_name: cleanName,
      active: true,
      display_order: displayOrder,
    }],
  })
  return rows[0]
}

export async function updateClassSection(id, changes) {
  const payload = { ...changes, updated_at: new Date().toISOString() }
  const rows = await supabaseRequest(`rest/v1/${TABLE}?id=eq.${queryValue(id)}&select=*`, {
    method: 'PATCH',
    token: getStoredSessionToken(),
    prefer: 'return=representation',
    body: payload,
  })
  return rows[0]
}

export async function deleteClassSection(id) {
  await supabaseRequest(`rest/v1/${TABLE}?id=eq.${queryValue(id)}`, {
    method: 'DELETE',
    token: getStoredSessionToken(),
    prefer: 'return=minimal',
  })
}
