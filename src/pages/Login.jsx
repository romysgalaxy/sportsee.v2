import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated()) {
    return <Navigate to="/home" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(username, password)

    if (result.success) {
      navigate('/home')
    } else {
      setError('Identifiants invalides. Veuillez réessayer.')
    }

    setIsLoading(false)
  }

  return (
      <div className="login-container">
        {/* Panneau gauche */}
        <div className="login-left">
          {/* Logo */}
          <div className="logo">
            <img
            src="logo.png"
            alt="Logo sportsee"
          />
          </div>

          {/* Formulaire */}
          <div className="form-card">
            <h1 className="tagline">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="form-title">Se connecter</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Adresse email
                </label>
                <input
                  id="email"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required

                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}

                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                Se connecter
              </button>
            </form>

            <a href="#" className="forgot-password">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Panneau droit - Image */}
        <div className="login-right">
          <img
            src="login.jpg"
            alt="Coureurs de marathon"
            className="background-image"
          />
          <div className="promo-text">
            Analysez vos performances en un clin d'œil, suivez vos progrès et
            atteignez vos objectifs.
          </div>
        </div>
      </div>
  )
}
