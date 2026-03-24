import './Unauthorized.css'
import {useNavigate} from "react-router-dom";

export default function Unauthorized () {
    const navigate = useNavigate()

    return (
        <div className="page">
            <div className="page-content fade-up">
                <h1 className="page-title">401 Unauthorized</h1>
                <p className="page-subtitle">You are trying to access a protected resource which you do not have permission to access.</p>
                <p className="page-subtitle">Return to the homepage to authenticate, if you are not logged in and are meant to be seeing this page.</p>
            </div>
        </div>
    )
}