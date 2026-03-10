import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Profile.css'

const userId = 1 // Replace with auth context user ID

export default function Profile() {
  const [user, setUser]         = useState(null)
  const [name, setName]         = useState('')
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveMsg, setSaveMsg]   = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/api/getUserById?id=${userId}`)
      .then(res => res.json())
      .then(data => { setUser(data); setName(data.name) })
  }, [])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true); setSaveMsg('')
    try {
      const res = await fetch(`/api/editProfile?id=${userId}&name=${encodeURIComponent(name)}`, { method: 'PUT' })
      if (!res.ok) throw new Error()
      setSaveMsg('Profile updated!')
    } catch {
      setSaveMsg('Failed to update. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch(`/api/deleteMyAccount?id=${userId}`, { method: 'DELETE' })
      window.location.href = '/login'
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content fade-up">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle" style={{marginBottom: '32px'}}>Manage your account settings.</p>

        <div className="profile-layout">
          {/* Edit profile */}
          <div className="card">
            <h2 className="form-title">Edit Profile</h2>
            {user ? (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    className="input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Admin Status</label>
                  <p className="profile-static">{user.admin ? 'Administrator' : 'Regular User'}</p>
                </div>
                {saveMsg && (
                  <p className={saveMsg.includes('Failed') ? 'form-error' : 'form-success'}>
                    {saveMsg}
                  </p>
                )}
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <p className="empty-state">Loading profile...</p>
            )}
          </div>

          {/* Danger zone */}
          <div className="card danger-zone">
            <h2 className="danger-title">Danger Zone</h2>
            <p className="danger-desc">
              Permanently delete your account and all associated workout data. This cannot be undone.
            </p>
            {!confirmDelete ? (
              <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
                Delete My Account
              </button>
            ) : (
              <div className="confirm-delete">
                <p className="confirm-text">Are you sure? This is permanent.</p>
                <div className="confirm-buttons">
                  <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
