import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">©Sportsee Tous droits réservés</p>

        <nav className="footer-nav">
          <a href="/conditions" className="footer-link">
            Conditions générales
          </a>
          <a href="/contact" className="footer-link">
            Contact
          </a>
          <img
            src="/logo-icon.png"
            alt="SportSee"
            className="footer-logo"
          />
        </nav>
      </div>
    </footer>
  );
}
