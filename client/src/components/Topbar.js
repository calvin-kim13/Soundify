import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FiSearch } from "react-icons/fi"
import { SearchBarContext } from "../context/searchBarContext"

const Topbar = () => {
    const navigate = useNavigate()
    const { searchBar, setSearchBar } = useContext(SearchBarContext)
    const username = localStorage.getItem("username")

    return (
        <header className="sf-topbar">
            <div className="sf-tb-search">
                <FiSearch />
                <input
                    value={searchBar}
                    onChange={(e) => {
                        setSearchBar(e.target.value)
                        if (window.location.pathname !== "/") navigate("/")
                    }}
                    placeholder="Search songs, artists, playlists"
                />
            </div>

            <div className="sf-tb-right">
                <div className="sf-tb-avatar">
                    {username ? username.charAt(0).toUpperCase() : "?"}
                </div>
            </div>
        </header>
    )
}

export default Topbar
