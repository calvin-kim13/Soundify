import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BsPlayFill, BsPauseFill } from "react-icons/bs"

const GENRES = ["All", "Rock", "RnB", "HipHop", "EDM", "Pop", "Country", "Classical", "International"]

const Home = ({
    setCurrentSong,
    getSongInfo,
    currentPlayer,
    setIsPlaying,
    isPlaying,
    currentSong,
    setSinglePL,
    getTrackIndex,
}) => {
    const navigate = useNavigate()
    const [songs, setSongs] = useState([])
    const [users, setUsers] = useState([])
    const [genre, setGenre] = useState("All")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const s = await fetch("/songs").then((r) => r.json())
                setSongs(Array.isArray(s) ? s : [])
            } catch (e) {
                setSongs([])
            }
            try {
                const u = await fetch("/users").then((r) => r.json())
                setUsers(Array.isArray(u) ? u : [])
            } catch (e) {
                setUsers([])
            }
            setLoading(false)
        })()
    }, [])

    const filtered =
        genre === "All" ? songs : songs.filter((s) => s.genre === genre)

    const playSong = (song, index, list) => {
        if (currentSong === song.link) {
            setIsPlaying(!isPlaying)
            return
        }
        getTrackIndex(index)
        setCurrentSong(song.link)
        setSinglePL({ songs: list })
        getSongInfo({ title: song.title, artist: song.artist })
        setIsPlaying(true)
    }

    const featured = songs[0]

    return (
        <div className="sf-home">
            {featured && (
                <section
                    className="sf-feature"
                    style={
                        featured.cover
                            ? {
                                  backgroundImage: `linear-gradient(90deg, rgba(11,9,19,0.92), rgba(11,9,19,0.55)), url(${featured.cover})`,
                              }
                            : undefined
                    }
                >
                    <div className="sf-feature-body">
                        <span className="sf-eyebrow">Featured today</span>
                        <h1 className="sf-feature-title">{featured.title}</h1>
                        <p className="sf-feature-artist">{featured.artist}</p>
                        <div className="sf-feature-actions">
                            <button
                                className="sf-btn sf-btn-primary"
                                onClick={() => playSong(featured, 0, songs)}
                            >
                                {currentSong === featured.link && isPlaying ? (
                                    <>
                                        <BsPauseFill /> Pause
                                    </>
                                ) : (
                                    <>
                                        <BsPlayFill /> Play
                                    </>
                                )}
                            </button>
                            <button
                                className="sf-btn sf-btn-ghost"
                                onClick={() => navigate(`/song/${featured.id}`)}
                            >
                                Details
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <div className="sf-genre-row">
                {GENRES.map((g) => (
                    <button
                        key={g}
                        className={"sf-genre-pill" + (genre === g ? " active" : "")}
                        onClick={() => setGenre(g)}
                    >
                        {g}
                    </button>
                ))}
            </div>

            <section>
                <div className="sf-section-head">
                    <h2>{genre === "All" ? "All tracks" : genre}</h2>
                    <span className="sf-count">{filtered.length} songs</span>
                </div>

                {loading ? (
                    <div className="sf-empty">Loading…</div>
                ) : filtered.length === 0 ? (
                    <div className="sf-empty">No songs here yet.</div>
                ) : (
                    <div className="sf-grid">
                        {filtered.map((song, i) => {
                            const playingThis =
                                currentSong === song.link && isPlaying
                            return (
                                <div className="sf-card" key={song.id || i}>
                                    <div className="sf-card-art-wrap">
                                        {song.cover ? (
                                            <img
                                                className="sf-card-art"
                                                src={song.cover}
                                                alt={song.title}
                                            />
                                        ) : (
                                            <div className="sf-card-art sf-card-art-ph" />
                                        )}
                                        <button
                                            className="sf-card-play"
                                            onClick={() =>
                                                playSong(song, i, filtered)
                                            }
                                            aria-label="Play"
                                        >
                                            {playingThis ? (
                                                <BsPauseFill />
                                            ) : (
                                                <BsPlayFill />
                                            )}
                                        </button>
                                    </div>
                                    <div
                                        className="sf-card-title"
                                        onClick={() =>
                                            navigate(`/song/${song.id}`)
                                        }
                                    >
                                        {song.title}
                                    </div>
                                    <div className="sf-card-artist">
                                        {song.artist}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {users.length > 0 && (
                <section className="sf-artists">
                    <div className="sf-section-head">
                        <h2>Artists</h2>
                    </div>
                    <div className="sf-artist-row">
                        {users.map((u) => (
                            <div
                                className="sf-artist"
                                key={u._id}
                                onClick={() => navigate(`/user/${u.username}`)}
                            >
                                <div className="sf-artist-avatar">
                                    {u.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="sf-artist-name">
                                    {u.username}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default Home
