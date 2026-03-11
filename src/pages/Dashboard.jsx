import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Dashboard.css'

const userId = 1 // Replace with auth context user ID

function computeAnalytics(workouts) {
  if (!workouts.length) return { thisWeek: 0, streak: 0, totalSets: 0, totalReps: 0, totalMins: 0 }

  // Workouts this week (Mon–Sun)
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon=0 ... Sun=6
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)
  weekStart.setHours(0, 0, 0, 0)

  const thisWeek = workouts.filter(w => new Date(w.date) >= weekStart).length

  // Current streak — consecutive days ending today or yesterday
  const uniqueDays = [...new Set(workouts.map(w => w.date))].sort().reverse()
  let streak = 0
  let expected = new Date()
  expected.setHours(0, 0, 0, 0)

  for (const day of uniqueDays) {
    const d = new Date(day)
    d.setHours(0, 0, 0, 0)
    const diff = (expected - d) / (1000 * 60 * 60 * 24)
    if (diff === 0 || diff === 1) {
      streak++
      expected = d
    } else {
      break
    }
  }

  const totalSets = workouts.reduce((s, w) => s + w.sets, 0)
  const totalReps = workouts.reduce((s, w) => s + w.sets * w.repsPerSet, 0)
  const totalMins = workouts.reduce((s, w) => s + w.durationMinutes, 0)

  return { thisWeek, streak, totalSets, totalReps, totalMins }
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/api/getWorkoutsByUser?userId=${userId}`)
      .then(res => res.json())
      .then(data => { setWorkouts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const { thisWeek, streak, totalSets, totalReps, totalMins } = computeAnalytics(workouts)

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

        {/* Analytics highlight row */}
        <div className="analytics-row">
          <div className="analytics-card card">
            <span className="analytics-icon">🔥</span>
            <div>
              <span className="stat-value">{streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
          <div className="analytics-card card">
            <span className="analytics-icon">📅</span>
            <div>
              <span className="stat-value">{thisWeek}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
          <div className="analytics-card card">
            <span className="analytics-icon">💪</span>
            <div>
              <span className="stat-value">{workouts.length}</span>
              <span className="stat-label">Total Workouts</span>
            </div>
          </div>
          <div className="analytics-card card">
            <span className="analytics-icon">⏱️</span>
            <div>
              <span className="stat-value">{totalMins}</span>
              <span className="stat-label">Total Minutes</span>
            </div>
          </div>
        </div>

        {/* Totals row */}
        <div className="stats-grid">
          <div className="stat-card card">
            <span className="stat-label">Total Sets</span>
            <span className="stat-value">{totalSets}</span>
          </div>
          <div className="stat-card card">
            <span className="stat-label">Total Reps</span>
            <span className="stat-value">{totalReps}</span>
          </div>
          <div className="stat-card card">
            <span className="stat-label">Avg Duration</span>
            <span className="stat-value">
              {workouts.length ? Math.round(totalMins / workouts.length) : 0}
              <span className="stat-unit"> min</span>
            </span>
          </div>
          <div className="stat-card card">
            <span className="stat-label">Avg Sets/Workout</span>
            <span className="stat-value">
              {workouts.length ? Math.round(totalSets / workouts.length) : 0}
            </span>
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
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/workouts')}>
              Log your first workout
            </button>
          </div>
        ) : (
          <div className="workout-list">
            {[...workouts].reverse().slice(0, 5).map(w => (
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