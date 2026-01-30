import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

export const Home = () => {
  const { logout, userId } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>SportSee</h1>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </header>

      <main className="home-content">
        <h2>Bienvenue sur SportSee!</h2>
        <p>User ID: {userId}</p>
        <p>Vous êtes maintenant connecté et authentifié.</p>
      </main>
    </div>
  )
}
