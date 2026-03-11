import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './Admin.css'

export default function Admin() {
  const [users, setUsers]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editName, setEditName]       = useState('')
  const [expandedId, setExpandedId]   = useState(null)
  const [saving, setSaving]           = useState(false)
  const [message, setMessage]         = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const fetchUsers = () => {
    fetch('/admin/getAllUsers')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id) => {
    await fetch(`/admin/deleteUser?id=${id}`, { method: 'DELETE' })
    setMessage('User deleted.')
    setConfirmDeleteId(null)
    setExpandedId(null)
    fetchUsers()
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setEditName(user.name)
    setMessage('')
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    try {
      await fetch('/admin/updateUser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingUser, name: editName })
      })
      setMessage('User updated.')
      setEditingUser(null)
      fetchUsers()
    } catch {
      setMessage('Failed to update user.')
    } finally {
      setSaving(false)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="page">
      <Navbar isAdmin={true} />
      <div className="page-content fade-up">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle" style={{ marginBottom: '32px' }}>
          Manage all user accounts. {!loading && <span className="user-count">{users.length} users registered</span>}
        </p>

        {message && <p className="admin-message">{message}</p>}

        <div className="card">
          {/* Table header */}
          <div className="admin-table-header">
            <span>ID</span>
            <span>Name</span>
            <span>Role</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <p className="empty-state">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="empty-state">No users found.</p>
          ) : (
            users.map(u => (
              <div key={u.id}>
                {/* Main row */}
                <div className="admin-table-row">
                  <span className="user-id">#{u.id}</span>

                  <span className="user-name">
                    {editingUser?.id === u.id ? (
                      <input
                        className="input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                      />
                    ) : u.name}
                  </span>

                  <span>
                    <span className={`badge ${u.admin ? 'badge-accent' : 'badge-blue'}`}>
                      {u.admin ? 'Admin' : 'User'}
                    </span>
                  </span>

                  <span className="admin-actions">
                    {editingUser?.id === u.id ? (
                      <>
                        <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditingUser(null)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-secondary" onClick={() => toggleExpand(u.id)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                          {expandedId === u.id ? 'Hide' : 'View'}
                        </button>
                        <button className="btn btn-secondary" onClick={() => openEdit(u)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => setConfirmDeleteId(u.id)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                          Delete
                        </button>
                      </>
                    )}
                  </span>
                </div>

                {/* Expanded user info panel - satisfies #9 */}
                {expandedId === u.id && (
                  <div className="user-info-panel">
                    <h3 className="user-info-title">User Information</h3>
                    <div className="user-info-grid">
                      <div className="user-info-item">
                        <span className="user-info-label">ID</span>
                        <span className="user-info-value">#{u.id}</span>
                      </div>
                      <div className="user-info-item">
                        <span className="user-info-label">Name</span>
                        <span className="user-info-value">{u.name}</span>
                      </div>
                      <div className="user-info-item">
                        <span className="user-info-label">Role</span>
                        <span className="user-info-value">{u.admin ? 'Administrator' : 'Regular User'}</span>
                      </div>
                    </div>

                    {/* Confirm delete - satisfies #10 */}
                    {confirmDeleteId === u.id && (
                      <div className="confirm-delete-panel">
                        <p className="confirm-text">⚠️ Permanently delete <strong>{u.name}</strong> and all their data?</p>
                        <div className="confirm-buttons">
                          <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>Yes, Delete</button>
                          <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}