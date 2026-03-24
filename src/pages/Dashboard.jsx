import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Dashboard.css'

// const userId = 3 // Replace with auth context user ID

function computeAnalytics(workouts, exercises) {
    if (!workouts.length) return {thisWeek: 0, streak: 0, totalSets: 0, totalReps: 0}

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

    const totalSets = exercises.reduce((s, w) => s + w.sets, 0)
    const totalReps = exercises.reduce((s, w) => s + w.sets * w.reps, 0)

    return {thisWeek, streak, totalSets, totalReps}
}

export default function Dashboard() {
    const [workouts, setWorkouts] = useState([])
    const [exercises, setExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchWorkouts().then(workouts => setWorkouts(workouts))
            .then(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        fetchExercises(workouts).then(exercises => setExercises(exercises))
            .then(() => {
                setLoading(false)
            })
    }, [])

    const fetchExercises = async () => {
        try {
            const result = await fetch('/api/getAllExercises',
                {credentials: 'include'})
            if (!result.ok) {
                throw new error(result.message)
            }
            return await result.json()
        } catch (error) {
            console.log('Error fetching exercises')
        }
    }

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me',
                {credentials: 'include'})
            if (!res.ok) {
                throw new error(res.message)
            }

            return await res.json()
        } catch (error) {
            console.log('Failed to fetch users')
            navigate('/unauthorized')
        }
    }

    const fetchWorkouts = async () => {
        const result = await fetchUser()
        if (result !== null) {
            try {
                const id = result.id
                const res = await fetch(`/api/getWorkoutsByUser?userId=${id}`,
                    {credentials: 'include'})
                if (!res.ok) {
                    throw new error(res.message)
                }

                const data = await res.json();
                return data
            } catch (error) {
                console.log('Failed to fetch workouts')
            }
        }
    }

    const {thisWeek, streak, totalSets, totalReps} = computeAnalytics(workouts, exercises)

    return (
        <div className="page">
            <Navbar/>
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

                {/* Totals row */}
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
                        <button className="btn btn-primary" style={{marginTop: '16px'}}
                                onClick={() => navigate('/workouts')}>
                            Log your first workout
                        </button>
                    </div>
                ) : (
                    <div className="workout-list">
                        {[...workouts].reverse().slice(0, 5).map(w => (
                            <div key={w.id} className="workout-row card">
                                <div className="workout-date">{w.date}</div>
                                {
                                    loading ? (<p className="empty-state">Loading...</p>)
                                        : exercises.length === 0 ? (
                                                <p className="empty-state">No exercises for this workout yet.</p>)
                                            : exercises.map((e) => (
                                                e.workoutId === w.id ?
                                                    <div className="workout-stats">
                                                        <span className="badge badge-primary">{e.exerciseName}</span>
                                                        <span className="badge badge-accent">{e.sets} sets</span>
                                                        <span className="badge badge-blue">{e.reps} reps</span>
                                                    </div>
                                                    : null
                                            ))
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}