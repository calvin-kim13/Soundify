import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { FiPlus, FiArrowLeft } from "react-icons/fi"
import { BsPlayFill, BsPauseFill, BsHeart, BsHeartFill } from "react-icons/bs"
import { getLikes, toggleLike } from "../utils/likes"
import { playlistGradient } from "../utils/gradients"

import {
    GET_SONG,
    GET_GENRES,
    GET_USER_PLAYLIST,
} from "../utils/queries/songQueries"
import { ADD_COMMENT } from "../utils/mutations/commentMutations"
import {
    CREATEPLAYLIST,
    ADDTOPLAYLIST,
} from "../utils/mutations/playlistMutations"
import CommentSection from "../components/CommentSection"
import shuffleArray from "../utils/helpers/shuffleArray"
import { useForm } from "../utils/hooks/hooks"
import toast from "../utils/toast"

const SongDetails = ({
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    getSongInfo,
    setSinglePL,
    currentSong,
}) => {
    const username = localStorage.getItem("username")
    const navigate = useNavigate()
    const { songId } = useParams()

    const { loading, data } = useQuery(GET_SONG, { variables: { songId } })
    const querySong = data?.songById || {}

    const { data: recdata } = useQuery(GET_GENRES, {
        variables: { genre: querySong.genre },
    })
    const recList = Object.values(recdata?.songByGenre || [])

    const { data: userPlaylists, refetch } = useQuery(GET_USER_PLAYLIST, {
        variables: { owner: username },
    })
    const usersPlaylists = userPlaylists?.userPlaylists || []

    const [addComment] = useMutation(ADD_COMMENT)
    const [createPlaylist] = useMutation(CREATEPLAYLIST)
    const [addToPlaylist] = useMutation(ADDTOPLAYLIST)

    const [commentText, setCommentText] = useState("")
    const [list, setList] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [likes, setLikes] = useState(getLikes())
    const isLiked = likes.includes(querySong._id)

    const { onChange, values } = useForm(() => {}, { playlistname: "" })

    // Playing here does NOT happen on mount (that would interrupt whatever is
    // already playing). Only this button changes playback.
    const isThisPlaying = currentSong === querySong.link && isPlaying
    const playThis = () => {
        if (!querySong.link) return
        if (currentSong === querySong.link) {
            setIsPlaying(!isPlaying)
            return
        }
        setCurrentSong(querySong.link)
        getSongInfo({ title: querySong.title, artist: querySong.artist })
        setSinglePL([])
        setIsPlaying(true)
    }

    // Build a shuffled list of recommendations (excluding this track).
    useEffect(() => {
        if (recList.length) {
            const shuffled = [...recList]
            shuffleArray(shuffled)
            const recs = shuffled
                .filter((s) => s && s.title !== querySong.title)
                .slice(0, 6)
            setList(recs)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recList.length])

    const addCommentHandler = async () => {
        if (!commentText.trim()) return
        try {
            await addComment({
                variables: {
                    songId,
                    token: localStorage.getItem("token"),
                    commentText,
                    commentAuthor: username,
                },
            })
            setCommentText("")
            toast.success("Comment posted.")
        } catch (err) {
            toast.error("Couldn't post comment.")
        }
    }

    const handleCreatePlaylist = async () => {
        if (!values.playlistname.trim()) return toast.error("Give the playlist a name.")
        await createPlaylist({
            variables: {
                playlistname: values.playlistname,
                username,
                songId: querySong._id,
            },
        })
        setIsModalVisible(false)
        await refetch()
        toast.success("Playlist created.")
    }

    const handleAddToPlaylist = async (e) => {
        await addToPlaylist({
            variables: { _id: e.currentTarget.id, songId: querySong._id },
        })
        setIsModalVisible(false)
        await refetch()
        toast.success("Added to playlist.")
    }


    if (loading) {
        return (
            <div className="sf-detail-loading">
                <div className="sf-spinner" />
            </div>
        )
    }

    return (
        <div className="sf-detail">
            <button className="sf-detail-back" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
            </button>

            <section className="sf-detail-hero">
                {querySong.cover ? (
                    <img
                        className="sf-detail-cover"
                        src={querySong.cover}
                        alt={querySong.title}
                    />
                ) : (
                    <div className="sf-detail-cover sf-detail-cover-ph" />
                )}

                <div className="sf-detail-info">
                    {querySong.genre && (
                        <span className="sf-eyebrow">{querySong.genre}</span>
                    )}
                    <h1 className="sf-detail-title">{querySong.title}</h1>
                    <p className="sf-detail-artist">{querySong.artist}</p>
                    <div className="sf-detail-actions">
                        <button className="sf-play-btn" onClick={playThis}>
                            {isThisPlaying ? (
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
                                "sf-ghost-round" + (isLiked ? " liked" : "")
                            }
                            onClick={() => setLikes(toggleLike(querySong._id))}
                            aria-label="Like"
                        >
                            {isLiked ? <BsHeartFill /> : <BsHeart />}
                        </button>
                        <button
                            className="sf-chip"
                            onClick={() => setIsModalVisible(true)}
                        >
                            <FiPlus /> Add to playlist
                        </button>
                    </div>
                </div>
            </section>

            {list.length > 0 && (
                <section className="sf-sec">
                    <div className="sf-sec-head">
                        <h2>You might also like</h2>
                    </div>
                    <div className="sf-cards">
                        {list.map((item) => (
                            <div className="sf-card2" key={item._id}>
                                <div className="sf-card2-art-wrap">
                                    {item.cover ? (
                                        <img
                                            className="sf-card2-art"
                                            src={item.cover}
                                            alt={item.title}
                                        />
                                    ) : (
                                        <div className="sf-card2-art sf-grad-art" />
                                    )}
                                </div>
                                <div
                                    className="sf-card2-title"
                                    onClick={() => navigate(`/song/${item._id}`)}
                                >
                                    {item.title}
                                </div>
                                <div className="sf-card2-sub">{item.artist}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="sf-detail-comments">
                <h2 className="sf-detail-h2">
                    {querySong.comments?.length || 0} comments
                </h2>
                <div className="sf-comment-compose">
                    <input
                        className="sf-input"
                        value={commentText}
                        onChange={(e) =>
                            e.target.value.length <= 240 &&
                            setCommentText(e.target.value)
                        }
                        placeholder="Add a comment…"
                        onKeyDown={(e) =>
                            e.key === "Enter" && addCommentHandler()
                        }
                    />
                    <button
                        className="sf-btn sf-btn-primary"
                        onClick={addCommentHandler}
                    >
                        Post
                    </button>
                </div>
                <CommentSection comments={querySong.comments} songId={songId} />
            </section>

            {isModalVisible && (
                <div
                    className="sf-m2-overlay"
                    onClick={() => setIsModalVisible(false)}
                >
                    <div className="sf-m2" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="sf-m2-close"
                            onClick={() => setIsModalVisible(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="sf-m2-title">Add to playlist</h2>

                        <div className="sf-m2-song">
                            {querySong.cover ? (
                                <img
                                    className="sf-m2-song-art"
                                    src={querySong.cover}
                                    alt={querySong.title}
                                />
                            ) : (
                                <div className="sf-m2-song-art sf-grad-art" />
                            )}
                            <div className="sf-m2-song-meta">
                                <span className="sf-m2-song-title">
                                    {querySong.title}
                                </span>
                                <span className="sf-m2-song-artist">
                                    {querySong.artist}
                                </span>
                            </div>
                        </div>

                        <div className="sf-m2-create">
                            <input
                                className="sf-m2-input"
                                name="playlistname"
                                value={values.playlistname}
                                onChange={onChange}
                                placeholder="New playlist name…"
                            />
                            <button
                                className="sf-m2-create-btn"
                                onClick={handleCreatePlaylist}
                            >
                                <FiPlus /> Create
                            </button>
                        </div>

                        <div className="sf-m2-pllist">
                            {usersPlaylists.length === 0 ? (
                                <div className="sf-m2-empty">
                                    No playlists yet — create one above.
                                </div>
                            ) : (
                                usersPlaylists.map((pl, i) => (
                                    <button
                                        key={pl._id}
                                        id={pl._id}
                                        className="sf-m2-plrow"
                                        onClick={handleAddToPlaylist}
                                    >
                                        <span
                                            className="sf-m2-pl-tile"
                                            style={{
                                                background: playlistGradient(i),
                                            }}
                                        />
                                        <span className="sf-m2-pl-name">
                                            {pl.plTitle}
                                        </span>
                                        <span className="sf-m2-pl-add">
                                            <FiPlus />
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SongDetails
