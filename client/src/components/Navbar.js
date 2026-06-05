import { Link } from "react-router-dom"
import "./styles/Navbar.css"

// The logged-in app uses the Sidebar; this slim nav only shows on the
// logged-out landing page.
const Navbar = () => {
    return (
        <nav className="navMain sf-nav">
            <Link to="/" className="sf-nav-brand">
                Soundify
            </Link>
            <div className="sf-nav-actions">
                <Link to="/login" className="sf-nav-login">
                    Log in
                </Link>
                <Link
                    to="/register"
                    className="sf-btn sf-btn-primary sf-nav-cta"
                >
                    Create account
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
