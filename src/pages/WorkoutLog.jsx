import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './WorkoutLog.css'

const EMPTY_FORM = { date: '', sets: '', repsPerSet: '', durationMinutes: '', notes: '' }
const userId = 1 // Replace with auth context user ID

export default function WorkoutLog() {
  const [workouts, setWorkouts]     = useState([])
  const [form, setForm]             = useState(EMPTY_FORM)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [editingId, setEditingId]   = useState(null)
  const [editForm, setEditForm]     = useState({})
  const [editError, setEditError]   = useState('')

  const fetchWorkouts = () => {
    fetch(`/api/getWorkoutsByUser?userId=${userId}`)
      .then(res => res.json())
      .then(data => { setWorkouts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchWorkouts() }, [])

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess(''); setSubmitting(true)
    try {
      const res = await fetch('/api/addWorkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: form.date,
          sets: Number(form.sets),
          repsPerSet: Number(form.repsPerSet),
          durationMinutes: Number(form.durationMinutes),
          notes: form.notes
        })
      })
      if (!res.ok) throw new Error()
      setSuccess('Workout logged!')
      setForm(EMPTY_FORM)
      fetchWorkouts()
    } catch {
      setError('Failed to save workout. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    await fetch(`/api/deleteWorkout?id=${id}`, { method: 'DELETE' })
    fetchWorkouts()
  }

  const openEdit = (w) => {
    setEditingId(w.id)
    setEditForm({
      date: w.date,
      sets: w.sets,
      repsPerSet: w.repsPerSet,
      durationMinutes: w.durationMinutes,
      notes: w.notes || ''
    })
    setEditError('')
  }

  const handleEditChange = e => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEditSave = async (id) => {
    setEditError('')
    try {
      const res = await fetch('/api/updateWorkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          userId,
          date: editForm.date,
          sets: Number(editForm.sets),
          repsPerSet: Number(editForm.repsPerSet),
          durationMinutes: Number(editForm.durationMinutes),
          notes: editForm.notes
        })
      })
      if (!res.ok) throw new Error()
      setEditingId(null)
      fetchWorkouts()
    } catch {
      setEditError('Failed to update. Please try again.')
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content fade-up">
        <h1 className="page-title">Workout Log</h1>
        <p className="page-subtitle" style={{ marginBottom: '32px' }}>Log and manage your workouts.</p>

        <div className="workout-layout">
          {/* Add workout form */}
          <div className="card workout-form-card">
            <h2 className="form-title">Log a Workout</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sets</label>
                  <input className="input" type="number" name="sets" value={form.sets} onChange={handleChange} min="1" required placeholder="e.g. 4" />
                </div>
                <div className="form-group">
                  <label>Reps per Set</label>
                  <input className="input" type="number" name="repsPerSet" value={form.repsPerSet} onChange={handleChange} min="1" required placeholder="e.g. 10" />
                </div>
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input className="input" type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} min="1" required placeholder="e.g. 45" />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <input className="input" type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="e.g. Leg day, felt great" />
              </div>
              {error   && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}
              <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', marginTop: '4px' }}>
                {submitting ? 'Saving...' : 'Log Workout'}
              </button>
            </form>
          </div>

          {/* Workout history */}
          <div className="workout-history">
            <h2 className="section-title" style={{ marginBottom: '16px' }}>History</h2>
            {loading ? (
              <p className="empty-state">Loading...</p>
            ) : workouts.length === 0 ? (
              <p className="empty-state">No workouts logged yet.</p>
            ) : (
              workouts.map(w => (
                <div key={w.id} className="card workout-history-row">
                  {editingId === w.id ? (
                    /* ── Edit mode ── */
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Date</label>
                          <input className="input" type="date" name="date" value={editForm.date} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Duration (min)</label>
                          <input className="input" type="number" name="durationMinutes" value={editForm.durationMinutes} onChange={handleEditChange} min="1" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Sets</label>
                          <input className="input" type="number" name="sets" value={editForm.sets} onChange={handleEditChange} min="1" />
                        </div>
                        <div className="form-group">
                          <label>Reps per Set</label>
                          <input className="input" type="number" name="repsPerSet" value={editForm.repsPerSet} onChange={handleEditChange} min="1" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <input className="input" type="text" name="notes" value={editForm.notes} onChange={handleEditChange} placeholder="Optional notes" />
                      </div>
                      {editError && <p className="form-error">{editError}</p>}
                      <div className="edit-actions">
                        <button className="btn btn-primary" onClick={() => handleEditSave(w.id)}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* ── View mode ── */
                    <>
                      <div className="workout-history-info">
                        <span className="workout-date">{w.date}</span>
                        <div className="workout-stats" style={{ marginTop: '6px' }}>
                          <span className="badge badge-accent">{w.sets} sets</span>
                          <span className="badge badge-blue">{w.repsPerSet} reps</span>
                          <span className="badge badge-success">{w.durationMinutes} min</span>
                        </div>
                        {w.notes && <p className="workout-notes" style={{ marginTop: '6px' }}>{w.notes}</p>}
                      </div>
                      <div className="row-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(w)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(w.id)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
