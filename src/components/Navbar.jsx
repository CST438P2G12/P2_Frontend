import {NavLink, useNavigate} from 'react-router-dom'
import './Navbar.css'
import {useEffect, useState} from "react";

export default function Navbar({isAdmin = false}) {
    const navigate = useNavigate()
    const [admin, setAdmin] = useState(false)

    useEffect(() => {
        fetchAdmin().then(res => setAdmin(res))
    })

    const fetchAdmin = async () => {
        try {
            const res = await fetch('https://p2-backend-7wbr.onrender.com/auth/me',
                {credentials: 'include'})
            if (!res.ok) {
                throw new error(res.message)
            }

            const user = await res.json()
            return user.admin
        } catch (error) {
            console.log('Failed to fetch users')
        }
    }

    const handleLogout = () => {
        // Spring Boot OAuth2 logout endpoint
        window.location.href = 'https://p2-backend-7wbr.onrender.com/logout'
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">GL</span>
                <span className="navbar-title">GymLog</span>
            </div>

            <div className="navbar-links">
                <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                    Dashboard
                </NavLink>
                <NavLink to="/workouts" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                    Workouts
                </NavLink>
                <NavLink to="/profile" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                    Profile
                </NavLink>
                {admin && (
                    <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
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
