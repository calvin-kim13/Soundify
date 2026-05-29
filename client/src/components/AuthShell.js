import { Link } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"

// Split-screen layout shared by the Login and Register pages: an immersive
// brand panel on the left and the form ({children}) on the right.
const AuthShell = ({ children }) => {
    return (
        <div className="sf-auth-split">
            <aside className="sf-auth-brand">
                <div className="sf-brand-wordmark">Soundify</div>

                <div className="sf-brand-mid">
                    <h2 className="sf-brand-tagline">
                        Where your <span className="sf-grad">sound</span> finds
                        its audience.
                    </h2>
                    <ul className="sf-brand-feats">
                        <li>Upload your tracks in seconds</li>
                        <li>Build and share playlists</li>
                        <li>Discover new music by genre</li>
                    </ul>
                </div>

                <div className="sf-brand-card">
                    <div className="sf-track-card">
                        <div className="sf-art sf-art-1" />
                        <div className="sf-track-meta">
                            <span className="sf-track-title">Midnight Drive</span>
                            <span className="sf-track-artist">Neon Pulse</span>
                        </div>
                        <div className="sf-mini-eq">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="sf-auth-panel">
                <Link to="/" className="sf-back-link">
                    <IoIosArrowBack /> Back
                </Link>
                <div className="sf-form-wrap">{children}</div>
            </main>
        </div>
    )
}

export default AuthShell
