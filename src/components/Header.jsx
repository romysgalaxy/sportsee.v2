import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
      const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-logo">
          <img src="/logo.png" alt="SportSee" className="header-logo-img" />
        </Link>

        <nav className="header-nav">
          <div className="header-nav-pill">
            <Link href="/dashboard" className="header-nav-link">
              Dashboard
            </Link>
            <Link href="/profil" className="header-nav-link">
              Mon profil
            </Link>
            <span className="header-nav-separator"></span>
            <Link onClick={handleLogout} className="header-nav-link header-nav-logout">
              Se déconnecter
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
