import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <section className="sf-hero">
            <span className="sf-eyebrow">Stream • Share • Discover</span>
            <h1 className="sf-hero-title">
                Where your sound <br />
                finds its <span className="sf-grad">audience</span>.
            </h1>
            <p className="sf-hero-sub">
                Upload your tracks, build playlists, and tune into what everyone
                else is creating — all in one place.
            </p>
            <div className="sf-hero-cta">
                <Link to="/register" className="sf-btn sf-btn-primary">
                    Get started
                </Link>
                <Link to="/login" className="sf-btn sf-btn-ghost">
                    Log in
                </Link>
            </div>
            <div className="sf-bars" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
    )
}

export default Hero
