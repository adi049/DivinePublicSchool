import { useCallback, useEffect, useState } from 'react'
import { Inbox, RefreshCw, Phone, Mail, Clock3 } from 'lucide-react'
import { useToast } from '../../components/admin/Toast.jsx'
import { supabaseRequest, getStoredSessionToken } from '../../services/supabaseClient.js'

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminEnquiries() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const rows = await supabaseRequest('rest/v1/enquiries?select=*&order=created_at.desc', { token: getStoredSessionToken() })
      setItems(Array.isArray(rows) ? rows : [])
    } catch (error) {
      toast.error(error.message || 'Could not load enquiries from Supabase.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    setBusyId(id)
    try {
      await supabaseRequest('rest/v1/enquiries?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH',
        token: getStoredSessionToken(),
        body: { status },
        prefer: 'return=minimal',
      })
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item))
      toast.success('Enquiry status updated.')
    } catch (error) {
      toast.error(error.message || 'Could not update enquiry status.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <div className="evt-head">
          <div>
            <h2 className="acard__title"><Inbox size={17} aria-hidden="true" /> Website enquiries</h2>
            <p className="acard__sub">Contact and admission form submissions saved in the school's Supabase database.</p>
          </div>
          <button type="button" className="btn btn--outline" onClick={load} disabled={loading}>
            <RefreshCw size={15} aria-hidden="true" /> {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <div className="stat-grid">
          <div className="stat"><span className="stat__label">Total enquiries</span><strong className="stat__value">{items.length}</strong></div>
          <div className="stat stat--magenta"><span className="stat__label">New</span><strong className="stat__value">{items.filter(x => x.status === 'new').length}</strong></div>
          <div className="stat stat--green"><span className="stat__label">Contacted / closed</span><strong className="stat__value">{items.filter(x => x.status !== 'new').length}</strong></div>
        </div>
      </section>

      {loading ? (
        <section className="acard"><p className="acard__sub">Loading enquiries…</p></section>
      ) : items.length === 0 ? (
        <section className="acard">
          <div className="empty">
            <span className="empty__icon"><Inbox size={22} /></span>
            <h3>No enquiries yet</h3>
            <p>New contact and admission form submissions will appear here.</p>
          </div>
        </section>
      ) : (
        <section className="acard">
          <h2 className="acard__title">All submissions ({items.length})</h2>
          <div className="evt-table-wrap">
            <table className="evt-table">
              <thead><tr><th>Received</th><th>Parent / Student</th><th>Contact</th><th>Class</th><th>Type</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td data-label="Received"><span className="evt-date"><Clock3 size={13} /> {formatDate(item.created_at)}</span></td>
                    <td data-label="Parent / Student"><strong>{item.parent_name}</strong>{item.student_name && <span className="evt-desc">{item.student_name}</span>}</td>
                    <td data-label="Contact"><a href={'tel:' + item.phone}><Phone size={12} /> {item.phone}</a><span className="evt-desc"><a href={'mailto:' + item.email}><Mail size={12} /> {item.email}</a></span></td>
                    <td data-label="Class">{item.class_interested}</td>
                    <td data-label="Type">{item.enquiry_type}</td>
                    <td data-label="Message"><span className="evt-desc" style={{ whiteSpace: 'normal' }}>{item.message}</span></td>
                    <td data-label="Status">
                      <select className="select" value={item.status} disabled={busyId === item.id} onChange={e => updateStatus(item.id, e.target.value)}>
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
