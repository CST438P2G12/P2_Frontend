import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Dashboard.css'

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Replace with actual user ID from auth context when available
  const userId = 1

  useEffect(() => {
    fetch(`/api/getWorkoutsByUser?userId=${userId}`)
      .then(res => res.json())
      .then(data => { setWorkouts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0)
  const totalReps = workouts.reduce((sum, w) => sum + (w.sets * w.repsPerSet), 0)
  const totalMins = workouts.reduce((sum, w) => sum + w.durationMinutes, 0)

  return (
    <div className="page">
      <Navbar />
      <div className="page-content fade-up">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Here's your training overview.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/workouts')}>
            + Log Workout
          </button>
        </div>

        {/* Stats row */}
        <div className="stats-grid">
          <div className="stat-card card">
            <span className="stat-label">Total Workouts</span>
            <span className="stat-value">{workouts.length}</span>
          </div>
          <div className="stat-card card">
            <span className="stat-label">Total Sets</span>
            <span className="stat-value">{totalSets}</span>
          </div>
          <div className="stat-card card">
            <span className="stat-label">Total Reps</span>
            <span className="stat-value">{totalReps}</span>
          </div>
          <div className="stat-card card">
            <span className="stat-label">Total Minutes</span>
            <span className="stat-value">{totalMins}</span>
          </div>
        </div>

        {/* Recent workouts */}
        <div className="section-header">
          <h2 className="section-title">Recent Workouts</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/workouts')}>
            View All
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : workouts.length === 0 ? (
          <div className="empty-state card">
            <p>No workouts yet.</p>
            <button className="btn btn-primary" style={{marginTop: '16px'}} onClick={() => navigate('/workouts')}>
              Log your first workout
            </button>
          </div>
        ) : (
          <div className="workout-list">
            {workouts.slice(0, 5).map(w => (
              <div key={w.id} className="workout-row card">
                <div className="workout-date">{w.date}</div>
                <div className="workout-stats">
                  <span className="badge badge-accent">{w.sets} sets</span>
                  <span className="badge badge-blue">{w.repsPerSet} reps</span>
                  <span className="badge badge-success">{w.durationMinutes} min</span>
                </div>
                {w.notes && <div className="workout-notes">{w.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
