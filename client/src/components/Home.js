import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { BsPlayFill, BsPauseFill, BsHeart, BsHeartFill } from "react-icons/bs"
import { SearchBarContext } from "../context/searchBarContext"
import { getLikes, toggleLike } from "../utils/likes"
import TrackList from "./TrackList"

const Home = ({
    setCurrentSong,
    getSongInfo,
    setIsPlaying,
    isPlaying,
    currentSong,
    setSinglePL,
    getTrackIndex,
}) => {
    const navigate = useNavigate()
    const { searchBar } = useContext(SearchBarContext)
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [likes, setLikes] = useState(getLikes())

    const like = (e, id) => {
        e.stopPropagation()
        setLikes(toggleLike(id))
    }
    const liked = (id) => likes.includes(id)

    useEffect(() => {
        ;(async () => {
            try {
                const s = await fetch("/songs").then((r) => r.json())
                setSongs(Array.isArray(s) ? s : [])
            } catch (e) {
                setSongs([])
            }
            setLoading(false)
        })()
    }, [])

    const query = (searchBar || "").trim().toLowerCase()
    const filtered = query
        ? songs.filter(
              (s) =>
                  s.title?.toLowerCase().includes(query) ||
                  s.artist?.toLowerCase().includes(query),
          )
        : songs

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

    if (loading) {
        return (
            <div className="sf-detail-loading">
                <div className="sf-spinner" />
            </div>
        )
    }

    const featured = songs[0]
    const recent = filtered.slice(0, 5)
    const featuredPlaying = featured && currentSong === featured.link && isPlaying

    const likeAction = (song) => (
        <button
            className={"sf-trk-like" + (liked(song.id) ? " liked" : "")}
            onClick={(e) => like(e, song.id)}
            aria-label="Like"
        >
            {liked(song.id) ? <BsHeartFill /> : <BsHeart />}
        </button>
    )

    // Search mode
    if (query) {
        return (
            <div className="sf-home">
                <div className="sf-sec-head">
                    <h2>Results for "{searchBar}"</h2>
                    <span className="sf-sec-count">{filtered.length} found</span>
                </div>
                {filtered.length === 0 ? (
                    <div className="sf-empty">No matches.</div>
                ) : (
                    <TrackList
                        songs={filtered}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        onPlay={(s, i) => playSong(s, i, filtered)}
                        onOpen={(s) => navigate(`/song/${s.id}`)}
                        trailing={likeAction}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="sf-home">
            {featured && (
                <section className="sf-hero">
                    {featured.cover ? (
                        <img
                            className="sf-hero-art"
                            src={featured.cover}
                            alt={featured.title}
                        />
                    ) : (
                        <div className="sf-hero-art sf-grad-art" />
                    )}
                    <div className="sf-hero-body">
                        <span className="sf-hero-kicker">Featured today</span>
                        <h1
                            className="sf-hero-title sf-hero-title-link"
                            onClick={() => navigate(`/song/${featured.id}`)}
                        >
                            {featured.title}
                        </h1>
                        <p className="sf-hero-sub">
                            {featured.artist} · {featured.genre}
                        </p>
                        <div className="sf-hero-actions">
                            <button
                                className="sf-play-btn"
                                onClick={() => playSong(featured, 0, songs)}
                            >
                                {featuredPlaying ? (
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
                                className={
                                    "sf-ghost-round" +
                                    (liked(featured.id) ? " liked" : "")
                                }
                                onClick={(e) => like(e, featured.id)}
                                aria-label="Like"
                            >
                                {liked(featured.id) ? <BsHeartFill /> : <BsHeart />}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="sf-sec">
                <div className="sf-sec-head">
                    <h2>Recently played</h2>
                </div>
                <div className="sf-cards">
                    {recent.map((song, i) => {
                        const playingThis =
                            currentSong === song.link && isPlaying
                        return (
                            <div className="sf-card2" key={song.id || i}>
                                <div className="sf-card2-art-wrap">
                                    {song.cover ? (
                                        <img
                                            className="sf-card2-art"
                                            src={song.cover}
                                            alt={song.title}
                                        />
                                    ) : (
                                        <div className="sf-card2-art sf-grad-art" />
                                    )}
                                    <button
                                        className="sf-card2-play"
                                        onClick={() => playSong(song, i, songs)}
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
                                    className="sf-card2-title"
                                    onClick={() => navigate(`/song/${song.id}`)}
                                >
                                    {song.title}
                                </div>
                                <div className="sf-card2-sub">{song.artist}</div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="sf-sec">
                <div className="sf-sec-head">
                    <h2>Popular this week</h2>
                </div>
                <TrackList
                    songs={songs}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={(s, i) => playSong(s, i, songs)}
                    onOpen={(s) => navigate(`/song/${s.id}`)}
                    trailing={likeAction}
                />
            </section>
        </div>
    )
}

export default Home
