import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import WorkoutLog from './pages/WorkoutLog'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Unauthorized from "./pages/Unauthorized.jsx";
import Forbidden from "./pages/Forbidden.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/login" replace />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts"  element={<WorkoutLog />} />
        <Route path="/profile"   element={<Profile />} />
        <Route path="/admin"     element={<Admin />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  )
}
