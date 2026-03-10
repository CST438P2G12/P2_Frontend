import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './Admin.css'

export default function Admin() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editName, setEditName]     = useState('')
  const [saving, setSaving]         = useState(false)
  const [message, setMessage]       = useState('')

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

  return (
    <div className="page">
      <Navbar isAdmin={true} />
      <div className="page-content fade-up">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle" style={{marginBottom: '32px'}}>Manage all user accounts.</p>

        {message && <p className="admin-message">{message}</p>}

        <div className="card">
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
              <div key={u.id} className="admin-table-row">
                <span className="user-id">#{u.id}</span>
                <span className="user-name">
                  {editingUser?.id === u.id ? (
                    <input
                      className="input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{padding: '6px 10px', fontSize: '0.875rem'}}
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
                      <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving} style={{fontSize:'0.8rem', padding:'6px 14px'}}>
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditingUser(null)} style={{fontSize:'0.8rem', padding:'6px 14px'}}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary" onClick={() => openEdit(u)} style={{fontSize:'0.8rem', padding:'6px 14px'}}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(u.id)} style={{fontSize:'0.8rem', padding:'6px 14px'}}>
                        Delete
                      </button>
                    </>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
