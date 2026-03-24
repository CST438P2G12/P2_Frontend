import {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import './WorkoutLog.css'

const EMPTY_FORM = {exerciseName: '', sets: '', reps: ''}

export default function WorkoutLog() {
    const [workouts, setWorkouts] = useState([])
    const [exercises, setExercises] = useState([])
    const [form, setForm] = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [editError, setEditError] = useState('')

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

                return await res.json()
            } catch (error) {
                console.log('Error fetching workouts')
            }
        }
    }

    const fetchExercises = async () => {
        try {
            const result = await fetch('/api/getAllExercises')
            if (!result.ok) {
                throw new error(result.message)
            }
            return await result.json()
        } catch (error) {
            console.log('Error fetching exercises')
        }
    }

    const handleChange = e => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setError('');
        setSuccess('');
        setSubmitting(true)
        try {
            const userRes = await fetchUser()
            const userId = userRes.id
            const res = await fetch('/api/addWorkout', {
                credentials: 'include',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: userId,
                    date: form.date,
                })
            })
            const workoutRes = await fetch(`/api/getWorkoutByDate?userId=${userId}&date=${form.date}`,
                {credentials: 'include'})
            if (!workoutRes.ok) {
                throw new error(workoutRes.message)
            }

            const workoutData = await workoutRes.json()
            const workoutId = workoutData.id
            const exerciseRes = await fetch('api/addExercise', {
                credentials: 'include',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    workoutId: workoutId,
                    exerciseName: form.name,
                    sets: Number(form.sets),
                    reps: Number(form.reps),
                })
            })
            if (!exerciseRes.ok) throw new error(exerciseRes.message)
            setSuccess('Workout logged!')
            setForm(EMPTY_FORM)
            await fetchWorkouts()
            await fetchExercises()
        } catch {
            setError('Failed to save workout. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        await fetch(`/api/deleteExercise/${id}`, {method: 'DELETE'})
        await fetchWorkouts()
    }

    const openEdit = (e) => {
        setEditingId(e.id)
        setEditForm({
            exerciseName: e.exerciseName,
            sets: e.sets,
            reps: e.reps,
        })
        setEditError('')
    }

    const handleEditChange = e => {
        setEditForm(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleEditSaveWorkout = async (id) => {
        setEditError('')
        try {
            const res = await fetch('/api/updateWorkout', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: userId,
                    name: editForm.name,
                    date: editForm.date,
                    sets: Number(editForm.sets),
                    reps: Number(editForm.reps),
                })
            })
            if (!res.ok) throw new Error()
            setEditingId(null)
            await fetchWorkouts()
            await fetchExercises()
        } catch {
            setEditError('Failed to update. Please try again.')
        }
    }

    return (
        <div className="page">
            <Navbar/>
            <div className="page-content fade-up">
                <h1 className="page-title">Workout Log</h1>
                <p className="page-subtitle" style={{marginBottom: '32px'}}>Log and manage your workouts.</p>

                <div className="workout-layout">
                    {/* Add workout form */}
                    <div className="card workout-form-card">
                        <h2 className="form-title">Log a Workout</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input className="input" type="text" name="name" onChange={handleChange} required
                                       placeholder="e.g. Deadlift"/>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input className="input" type="date" name="date" onChange={handleChange} required/>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sets</label>
                                    <input className="input" type="number" name="sets" onChange={handleChange} min="1"
                                           required placeholder="e.g. 4"/>
                                </div>
                                <div className="form-group">
                                    <label>Reps per Set</label>
                                    <input className="input" type="number" name="reps" onChange={handleChange} min="1"
                                           required placeholder="e.g. 10"/>
                                </div>
                            </div>
                            {error && <p className="form-error">{error}</p>}
                            {success && <p className="form-success">{success}</p>}
                            <button className="btn btn-primary" type="submit" disabled={submitting}
                                    style={{width: '100%', marginTop: '4px'}}>
                                {submitting ? 'Saving...' : 'Log Workout'}
                            </button>
                        </form>
                    </div>

                    {/* Workout history */}
                    <div className="workout-history">
                        <h2 className="section-title" style={{marginBottom: '16px'}}>History</h2>
                        {loading ? (
                            <p className="empty-state">Loading...</p>
                        ) : workouts.length === 0 ? (
                            <p className="empty-state">No workouts logged yet.</p>
                        ) : (
                            workouts.map(w => (
                                <div key={w.id} className="card workout-history-row">
                                    <div className="workout-history-info">
                                        <span className="workout-date">{w.date}</span>
                                        {loading ? (
                                            <p className="empty-state">Loading...</p>) : exercises.length === 0 ? (
                                            <p className="empty-state">No exercises for this workout yet.</p>
                                        ) : (
                                            exercises.map((e) => (
                                                e.workoutId === w.id ?
                                                    <div key={e.id} className="workout-stats"
                                                         style={{marginTop: '6px'}}>
                                                        <span className="badge badge-primary"
                                                              style={{padding: '6px 8px'}}>{e.exerciseName}</span>
                                                        <span className="badge badge-accent"
                                                              style={{padding: '6px 8px'}}>{e.sets} sets</span>
                                                        <span className="badge badge-blue"
                                                              style={{padding: '6px 8px'}}>{e.reps} reps</span>
                                                        <div>
                                                            {/*<button className="btn btn-secondary"*/}
                                                            {/*        onClick={() => openEdit(e)}*/}
                                                            {/*        style={{*/}
                                                            {/*            fontSize: '0.8rem',*/}
                                                            {/*            padding: '6px 14px',*/}
                                                            {/*            marginRight: '6px'*/}
                                                            {/*        }}>Edit*/}
                                                            {/*</button>*/}
                                                            <button className="btn btn-danger"
                                                                    onClick={() => handleDelete(e.id)}
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        padding: '6px 14px'
                                                                    }}>Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    : null
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

