import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FiTrash2, FiArrowLeft, FiPlus } from "react-icons/fi"
import { BsHeartFill, BsMusicNoteList } from "react-icons/bs"
import { useQuery, useMutation } from "@apollo/client"
import { GET_USER_PLAYLIST } from "../utils/queries/songQueries"
import {
    REMOVE_PLAYLIST,
    REMOVE_FROM_PLAYLIST,
    CREATEPLAYLIST,
} from "../utils/mutations/playlistMutations"
import { getLikes, toggleLike } from "../utils/likes"
import { playlistGradient } from "../utils/gradients"
import TrackList from "../components/TrackList"
import toast from "../utils/toast"

const Playlists = ({
    setSinglePL,
    setIsPlaying,
    isPlaying,
    currentSong,
    getSongInfo,
    setCurrentSong,
    getTrackIndex,
}) => {
    const navigate = useNavigate()
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    const { data, refetch } = useQuery(GET_USER_PLAYLIST, {
        variables: { owner: username },
    })
    const playlists = data?.userPlaylists || []
    const [removePlaylist] = useMutation(REMOVE_PLAYLIST)
    const [removeFromPlaylist] = useMutation(REMOVE_FROM_PLAYLIST)
    const [createPlaylist] = useMutation(CREATEPLAYLIST)

    const [allSongs, setAllSongs] = useState([])
    const [likes, setLikes] = useState(getLikes())
    const [selectedId, setSelectedId] = useState(null)
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState("")

    const handleCreate = async () => {
        if (!newName.trim()) return toast.error("Give the playlist a name.")
        try {
            await createPlaylist({
                variables: { playlistname: newName.trim(), username },
            })
            setNewName("")
            setCreating(false)
            await refetch()
            toast.success("Playlist created.")
        } catch (err) {
            toast.error("Couldn't create playlist.")
        }
    }
    const [params] = useSearchParams()
    const view = params.get("view")

    useEffect(() => {
        fetch("/songs")
            .then((r) => r.json())
            .then((s) => setAllSongs(Array.isArray(s) ? s : []))
            .catch(() => {})
    }, [])

    // Open a specific playlist (or Liked Songs) when navigated via ?view=<id>.
    useEffect(() => {
        setSelectedId(view || null)
    }, [view])

    const likedSongs = allSongs.filter((s) => likes.includes(s.id))

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

    const deletePlaylist = async (e, pl) => {
        e.stopPropagation()
        try {
            await removePlaylist({ variables: { playlistId: pl._id, token } })
            await refetch()
            toast.success("Playlist removed.")
        } catch (err) {
            toast.error("Couldn't remove playlist.")
        }
    }

    // -------- selected playlist (or Liked Songs) view --------
    if (selectedId) {
        const isLiked = selectedId === "liked"
        const plIndex = playlists.findIndex((p) => p._id === selectedId)
        const pl = isLiked
            ? { plTitle: "Liked Songs", songs: likedSongs }
            : playlists.find((p) => p._id === selectedId)

        if (!pl) {
            return (
                <div className="sf-pls">
                    <button
                        className="sf-detail-back"
                        onClick={() => setSelectedId(null)}
                    >
                        <FiArrowLeft /> Playlists
                    </button>
                </div>
            )
        }

        const songs = pl.songs || []

        const removeTrack = async (e, song) => {
            e.stopPropagation()
            if (isLiked) {
                setLikes(toggleLike(song.id || song._id))
                toast.success("Removed from Liked Songs.")
                return
            }
            try {
                await removeFromPlaylist({
                    variables: { playlistId: selectedId, songId: song._id, token },
                })
                await refetch()
                toast.success("Removed from playlist.")
            } catch (err) {
                toast.error("Couldn't remove song.")
            }
        }

        return (
            <div className="sf-pls">
                <button
                    className="sf-detail-back"
                    onClick={() => setSelectedId(null)}
                >
                    <FiArrowLeft /> Playlists
                </button>

                <div className="sf-plview-head">
                    <div
                        className="sf-plview-art"
                        style={
                            isLiked
                                ? { background: "linear-gradient(135deg,#ff5a5f,#ff9d4d)" }
                                : { background: playlistGradient(plIndex) }
                        }
                    >
                        {isLiked ? <BsHeartFill /> : <BsMusicNoteList />}
                    </div>
                    <div>
                        <span className="sf-pltracks-eyebrow">Playlist</span>
                        <h1 className="sf-plview-title">{pl.plTitle}</h1>
                        <p className="sf-pltracks-count">
                            {songs.length} {songs.length === 1 ? "song" : "songs"}
                        </p>
                    </div>
                </div>

                {songs.length === 0 ? (
                    <div className="sf-comments-empty">
                        {isLiked
                            ? "No liked songs yet — tap the heart on any song."
                            : "No songs in this playlist yet."}
                    </div>
                ) : (
                    <TrackList
                        songs={songs}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        onPlay={(s, i) => playSong(s, i, songs)}
                        onOpen={(s) => navigate(`/song/${s._id || s.id}`)}
                        trailing={(s) => (
                            <button
                                className={
                                    isLiked
                                        ? "sf-trk-like liked"
                                        : "sf-trk-del"
                                }
                                onClick={(e) => removeTrack(e, s)}
                                aria-label={isLiked ? "Unfavorite" : "Remove"}
                            >
                                {isLiked ? <BsHeartFill /> : <FiTrash2 />}
                            </button>
                        )}
                    />
                )}
            </div>
        )
    }

    // -------- grid of playlists --------
    return (
        <div className="sf-pls">
            <div className="sf-pls-head">
                <h1 className="sf-pls-title">Playlists</h1>
                <button
                    className="sf-pls-add"
                    onClick={() => setCreating(true)}
                    aria-label="New playlist"
                    title="New playlist"
                >
                    <FiPlus />
                </button>
            </div>
            <div className="sf-pls-grid">
                <div
                    className="sf-plcard"
                    onClick={() => setSelectedId("liked")}
                >
                    <div className="sf-plcard-art sf-plcard-liked">
                        <BsHeartFill />
                    </div>
                    <div className="sf-plcard-title">Liked Songs</div>
                    <div className="sf-plcard-sub">
                        {likedSongs.length} songs
                    </div>
                </div>

                {playlists.map((pl, i) => (
                    <div
                        className="sf-plcard"
                        key={pl._id}
                        onClick={() => setSelectedId(pl._id)}
                    >
                        <div
                            className="sf-plcard-art"
                            style={{ background: playlistGradient(i) }}
                        >
                            <BsMusicNoteList />
                        </div>
                        <div className="sf-plcard-title">{pl.plTitle}</div>
                        <div className="sf-plcard-sub">
                            {pl.songs?.length || 0} songs
                        </div>
                        <button
                            className="sf-plcard-del"
                            onClick={(e) => deletePlaylist(e, pl)}
                            aria-label="Delete playlist"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
            </div>

            {creating && (
                <div
                    className="sf-m2-overlay"
                    onClick={() => setCreating(false)}
                >
                    <div
                        className="sf-m2 sf-m2-confirm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="sf-m2-close"
                            onClick={() => setCreating(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="sf-m2-title">New playlist</h2>
                        <p className="sf-m2-sub">Give your playlist a name.</p>
                        <input
                            className="sf-m2-input"
                            style={{ marginTop: 16 }}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Playlist name"
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleCreate()
                            }
                            autoFocus
                        />
                        <div className="sf-m2-actions">
                            <button
                                className="sf-m2-ghost"
                                onClick={() => setCreating(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="sf-m2-primary"
                                onClick={handleCreate}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Playlists
