import { useContext, useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { AuthContext } from "../context/authContext"
import { GET_USER_PLAYLIST } from "../utils/queries/songQueries"
import { HiHome, HiUpload } from "react-icons/hi"
import { MdLibraryMusic } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { FiLogOut } from "react-icons/fi"
import { BsMusicNoteBeamed, BsHeartFill } from "react-icons/bs"
import { getLikes } from "../utils/likes"
import { playlistGradient } from "../utils/gradients"

const Sidebar = () => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const username = localStorage.getItem("username")
    const { data } = useQuery(GET_USER_PLAYLIST, {
        variables: { owner: username },
    })
    const playlists = data?.userPlaylists || []
    const [confirmLogout, setConfirmLogout] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const linkClass = ({ isActive }) =>
        "sf-sb-nav-item" + (isActive ? " active" : "")

    return (
        <>
        <aside className="sf-sb">
            <Link to="/" className="sf-sb-brand">
                <span className="sf-sb-mark">
                    <BsMusicNoteBeamed />
                </span>
                Soundify
            </Link>

            <nav className="sf-sb-nav">
                <NavLink end to="/" className={linkClass}>
                    <HiHome /> Home
                </NavLink>
                <NavLink to="/uploads" className={linkClass}>
                    <HiUpload /> Upload
                </NavLink>
                <NavLink to="/playlists" className={linkClass}>
                    <MdLibraryMusic /> Playlists
                </NavLink>
                <NavLink to={`/user/${username}`} className={linkClass}>
                    <CgProfile /> Profile
                </NavLink>
            </nav>

            <div className="sf-sb-lib">
                <div className="sf-sb-lib-head">
                    <span>Your playlists</span>
                </div>
                <div className="sf-sb-lib-list">
                    <Link to="/playlists?view=liked" className="sf-sb-pl">
                        <span className="sf-sb-pl-art sf-sb-liked-art">
                            <BsHeartFill />
                        </span>
                        <span className="sf-sb-pl-meta">
                            <span className="sf-sb-pl-title">Liked Songs</span>
                            <span className="sf-sb-pl-sub">
                                {getLikes().length} songs
                            </span>
                        </span>
                    </Link>
                    {playlists.map((pl, i) => (
                        <Link
                            to={`/playlists?view=${pl._id}`}
                            className="sf-sb-pl"
                            key={pl._id}
                        >
                                <span
                                    className="sf-sb-pl-art"
                                    style={{
                                        background: playlistGradient(i),
                                    }}
                                />
                                <span className="sf-sb-pl-meta">
                                    <span className="sf-sb-pl-title">
                                        {pl.plTitle}
                                    </span>
                                    <span className="sf-sb-pl-sub">
                                        {pl.songs?.length || 0} songs
                                    </span>
                                </span>
                            </Link>
                        ))}
                </div>
            </div>

            <button
                className="sf-sb-logout"
                onClick={() => setConfirmLogout(true)}
            >
                <FiLogOut /> Log out
            </button>
        </aside>

        {confirmLogout && (
            <div
                className="sf-m2-overlay"
                onClick={() => setConfirmLogout(false)}
            >
                <div
                    className="sf-m2 sf-m2-confirm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="sf-m2-close"
                        onClick={() => setConfirmLogout(false)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <h2 className="sf-m2-title">Log out?</h2>
                    <p className="sf-m2-sub">
                        You'll need to sign back in to keep listening.
                    </p>
                    <div className="sf-m2-actions">
                        <button
                            className="sf-m2-ghost"
                            onClick={() => setConfirmLogout(false)}
                        >
                            Cancel
                        </button>
                        <button className="sf-m2-danger" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default Sidebar
