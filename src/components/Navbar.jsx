import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ isAdmin = false }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Spring Boot OAuth2 logout endpoint
    window.location.href = 'http://localhost:8080/logout'
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">GL</span>
        <span className="navbar-title">GymLog</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/workouts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Workouts
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Profile
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Admin
          </NavLink>
        )}
      </div>

      <button className="btn btn-secondary navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}
