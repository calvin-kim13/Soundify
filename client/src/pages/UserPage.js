import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { BsHeart, BsHeartFill } from "react-icons/bs"
import { GET_USER_SONGS } from "../utils/queries/songQueries"
import { getLikes, toggleLike } from "../utils/likes"
import TrackList from "../components/TrackList"

const UserPage = ({
    setIsPlaying,
    isPlaying,
    currentSong,
    setCurrentSong,
    getSongInfo,
    getTrackIndex,
    setSinglePL,
}) => {
    const navigate = useNavigate()
    const { username } = useParams()
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)

    const { loading, data } = useQuery(GET_USER_SONGS, {
        variables: { username },
    })
    const usersSongs = data?.userSongs || []

    useEffect(() => {
        ;(async () => {
            try {
                const res = await fetch(`/user/${username}`, {
                    headers: { Accept: "application/json" },
                })
                const u = await res.json()
                setUser(Array.isArray(u) ? u[0] : u)
            } catch (err) {
                setUser(null)
            }
            setLoadingUser(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username])

    const [likes, setLikes] = useState(getLikes())
    const liked = (id) => likes.includes(id)
    const like = (e, id) => {
        e.stopPropagation()
        setLikes(toggleLike(id))
    }

    const playSong = (song, index) => {
        if (currentSong === song.link) {
            setIsPlaying(!isPlaying)
            return
        }
        getTrackIndex(index)
        setCurrentSong(song.link)
        setSinglePL({ songs: usersSongs })
        getSongInfo({ title: song.title, artist: song.artist })
        setIsPlaying(true)
    }

    if (loading || loadingUser) {
        return (
            <div className="sf-detail-loading">
                <div className="sf-spinner" />
            </div>
        )
    }

    return (
        <div className="sf-profile">
            <header className="sf-profile-hero">
                <div className="sf-profile-avatar">
                    {username?.charAt(0).toUpperCase()}
                </div>
                <div className="sf-profile-meta">
                    <span className="sf-eyebrow">Profile</span>
                    <h1 className="sf-profile-name">{username}</h1>
                    <p className="sf-profile-stats">
                        {user?.songs?.length || 0} songs ·{" "}
                        {user?.playlists?.length || 0} playlists
                    </p>
                </div>
            </header>

            <div className="sf-profile-uploads">
            <h2 className="sf-detail-h2">Uploads</h2>
            {usersSongs.length === 0 ? (
                <div className="sf-comments-empty">
                    {username} hasn't uploaded any songs yet.
                </div>
            ) : (
                <TrackList
                    songs={usersSongs}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={(s, i) => playSong(s, i)}
                    onOpen={(s) => navigate(`/song/${s._id || s.id}`)}
                    trailing={(s) => (
                        <button
                            className={
                                "sf-trk-like" +
                                (liked(s.id || s._id) ? " liked" : "")
                            }
                            onClick={(e) => like(e, s.id || s._id)}
                            aria-label="Like"
                        >
                            {liked(s.id || s._id) ? (
                                <BsHeartFill />
                            ) : (
                                <BsHeart />
                            )}
                        </button>
                    )}
                />
            )}
            </div>
        </div>
    )
}

export default UserPage
