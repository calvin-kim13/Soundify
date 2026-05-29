import { useContext } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import { HiHome, HiUpload } from "react-icons/hi"
import { MdLibraryMusic } from "react-icons/md"
import { FiLogOut } from "react-icons/fi"
import { CgProfile } from "react-icons/cg"

const Sidebar = () => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const username = localStorage.getItem("username")

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const links = [
        { to: "/", label: "Home", icon: <HiHome />, end: true },
        { to: "/uploads", label: "Upload", icon: <HiUpload /> },
        { to: "/playlists", label: "Playlists", icon: <MdLibraryMusic /> },
        {
            to: `/user/${username}`,
            label: "Profile",
            icon: <CgProfile />,
        },
    ]

    return (
        <aside className="sf-sidebar">
            <Link to="/" className="sf-side-brand">
                Soundify
            </Link>

            <nav className="sf-side-nav">
                {links.map((l) => (
                    <NavLink
                        key={l.label}
                        to={l.to}
                        end={l.end}
                        className={({ isActive }) =>
                            "sf-side-link" + (isActive ? " active" : "")
                        }
                    >
                        <span className="sf-side-icon">{l.icon}</span>
                        {l.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sf-side-foot">
                <div className="sf-side-account">
                    <div className="sf-side-avatar">
                        {username ? username.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="sf-side-acct-meta">
                        <span className="sf-side-acct-name">{username}</span>
                        <span className="sf-side-acct-sub">Listener</span>
                    </div>
                </div>
                <button className="sf-side-logout" onClick={handleLogout}>
                    <FiLogOut /> Log out
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
