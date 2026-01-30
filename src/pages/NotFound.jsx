import { Link } from 'react-router-dom'
import './NotFound.css'

export const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas.</p>
        <Link to="/login" className="home-link">
          Retour à la page de connexion
        </Link>
      </div>
    </div>
  )
}
