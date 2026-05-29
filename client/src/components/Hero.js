import { Link } from "react-router-dom"

const tracks = [
    { cls: "sf-card-1", art: "sf-art-1", title: "Midnight Drive", artist: "Neon Pulse" },
    { cls: "sf-card-2", art: "sf-art-2", title: "Saffron Skies", artist: "Ravi & The Monsoon" },
    { cls: "sf-card-3", art: "sf-art-3", title: "Golden Hour", artist: "Luna Ray" },
]

const Hero = () => {
    return (
        <section className="sf-landing">
            <div className="sf-landing-copy">
                <span className="sf-eyebrow">Stream • Share • Discover</span>
                <h1 className="sf-display">
                    Your sound,
                    <br />
                    <span className="sf-grad">amplified.</span>
                </h1>
                <p className="sf-lead">
                    Upload, stream, and discover music in one beautifully simple
                    space — built for creators and listeners alike.
                </p>
                <div className="sf-hero-cta">
                    <Link to="/register" className="sf-btn sf-btn-primary">
                        Start listening
                    </Link>
                    <Link to="/login" className="sf-btn sf-btn-ghost">
                        I have an account
                    </Link>
                </div>
                <div className="sf-stats">
                    <div>
                        <strong>10k+</strong>
                        <span>Tracks</span>
                    </div>
                    <div>
                        <strong>2k+</strong>
                        <span>Artists</span>
                    </div>
                    <div>
                        <strong>∞</strong>
                        <span>Playlists</span>
                    </div>
                </div>
            </div>

            <div className="sf-landing-visual" aria-hidden="true">
                {tracks.map((t) => (
                    <div className={`sf-track-card ${t.cls}`} key={t.title}>
                        <div className={`sf-art ${t.art}`} />
                        <div className="sf-track-meta">
                            <span className="sf-track-title">{t.title}</span>
                            <span className="sf-track-artist">{t.artist}</span>
                        </div>
                        <div className="sf-mini-eq">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Hero
