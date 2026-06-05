import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import axios from "axios"
import { FiUploadCloud, FiTrash2, FiPlus, FiImage, FiMusic } from "react-icons/fi"
import { GET_USER_SONGS } from "../utils/queries/songQueries"
import { DELETE_SONG } from "../utils/mutations/songMutations"
import toast from "../utils/toast"

const GENRES = ["Rock", "RnB", "HipHop", "EDM", "Pop", "Country", "Classical", "International"]

const SongList = () => {
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")
    const { loading, data, refetch } = useQuery(GET_USER_SONGS, {
        variables: { username },
    })
    const usersSongs = data?.userSongs || []
    const [removeSong] = useMutation(DELETE_SONG)

    const [song, setSong] = useState({ title: "", genre: "", artist: "" })
    const [file, setFile] = useState(null)
    const [imgFile, setImgFile] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [uploading, setUploading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setSong((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setSong({ title: "", genre: "", artist: "" })
        setFile(null)
        setImgFile(null)
    }

    const handleUpload = async () => {
        if (!song.title || !song.artist || !song.genre || !file) {
            return toast.error("Fill out all fields and choose a file.")
        }
        const dup = usersSongs.some(
            (s) =>
                s.title === song.title &&
                s.artist === song.artist &&
                s.genre === song.genre,
        )
        if (dup) return toast.error("You already uploaded this song.")

        const tags = song.title.split(" ")
        tags.push(song.genre, song.artist.split(" "))
        const formData = new FormData()
        formData.append("username", username)
        formData.append("genre", song.genre)
        formData.append("artist", song.artist)
        formData.append("title", song.title)
        formData.append("tags", tags)
        formData.append("filename", file)
        if (imgFile) formData.append("imgFilename", imgFile)

        setUploading(true)
        const hide = toast.loading("Uploading song…")
        try {
            await axios.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            hide()
            setIsModalVisible(false)
            resetForm()
            await refetch()
            toast.success("Song uploaded.")
        } catch (err) {
            hide()
            toast.error("Upload failed.")
        }
        setUploading(false)
    }

    const doDelete = async (s) => {
        setConfirmDelete(null)
        try {
            await removeSong({
                variables: { songId: s._id, token, key: s.filename },
            })
            await refetch()
            toast.success("Song deleted.")
        } catch (err) {
            toast.error("Couldn't delete song.")
        }
    }

    useEffect(() => {
        refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (loading) {
        return (
            <div className="sf-detail-loading">
                <div className="sf-spinner" />
            </div>
        )
    }

    return (
        <div className="sf-upload">
            <div className="sf-upload-head">
                <div>
                    <h1 className="sf-detail-title" style={{ fontSize: "2rem" }}>
                        Your uploads
                    </h1>
                    <p className="sf-profile-stats">
                        {usersSongs.length}{" "}
                        {usersSongs.length === 1 ? "track" : "tracks"}
                    </p>
                </div>
                <button
                    className="sf-btn sf-btn-primary"
                    onClick={() => setIsModalVisible(true)}
                >
                    <FiPlus /> Upload
                </button>
            </div>

            {usersSongs.length === 0 ? (
                <div className="sf-upload-empty">
                    <FiUploadCloud />
                    <p>You haven't uploaded any songs yet.</p>
                    <button
                        className="sf-btn sf-btn-primary"
                        onClick={() => setIsModalVisible(true)}
                    >
                        Upload your first track
                    </button>
                </div>
            ) : (
                <div className="sf-pltracks-list">
                    {usersSongs.map((s) => (
                        <div className="sf-track-row" key={s._id}>
                            {s.cover ? (
                                <img
                                    className="sf-track-row-art"
                                    src={s.cover}
                                    alt={s.title}
                                />
                            ) : (
                                <div className="sf-track-row-art sf-card-art-ph" />
                            )}
                            <div className="sf-track-row-meta">
                                <span className="sf-track-row-title">
                                    {s.title}
                                </span>
                                <span className="sf-track-row-artist">
                                    {s.artist} · {s.genre}
                                </span>
                            </div>
                            <button
                                className="sf-track-row-del"
                                onClick={() => setConfirmDelete(s)}
                                aria-label="Delete song"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ---------- Upload modal ---------- */}
            {isModalVisible && (
                <div
                    className="sf-m2-overlay"
                    onClick={() => setIsModalVisible(false)}
                >
                    <div
                        className="sf-m2 sf-m2-wide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="sf-m2-close"
                            onClick={() => setIsModalVisible(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="sf-m2-title">Upload a track</h2>
                        <p className="sf-m2-sub">
                            Share your sound with the world.
                        </p>

                        <div className="sf-m2-ugrid">
                            <label className="sf-m2-cover">
                                {imgFile ? (
                                    <img
                                        className="sf-m2-cover-img"
                                        src={URL.createObjectURL(imgFile)}
                                        alt="cover preview"
                                    />
                                ) : (
                                    <div className="sf-m2-cover-empty">
                                        <FiImage />
                                        <span>Cover art</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImgFile(e.target.files[0] || null)
                                    }
                                />
                            </label>

                            <div className="sf-m2-fields">
                                <input
                                    className="sf-m2-input"
                                    name="title"
                                    value={song.title}
                                    onChange={handleChange}
                                    placeholder="Song title"
                                />
                                <input
                                    className="sf-m2-input"
                                    name="artist"
                                    value={song.artist}
                                    onChange={handleChange}
                                    placeholder="Artist"
                                />
                                <select
                                    className={
                                        "sf-m2-input sf-m2-select" +
                                        (song.genre ? "" : " placeholder")
                                    }
                                    name="genre"
                                    value={song.genre}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Choose a genre
                                    </option>
                                    {GENRES.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label
                            className={"sf-m2-audio" + (file ? " has-file" : "")}
                        >
                            <FiMusic />
                            <span>
                                {file ? file.name : "Choose an audio file"}
                            </span>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) =>
                                    setFile(e.target.files[0] || null)
                                }
                            />
                        </label>

                        <button
                            className="sf-m2-submit"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading…" : "Upload track"}
                        </button>
                    </div>
                </div>
            )}

            {/* ---------- Delete confirm ---------- */}
            {confirmDelete && (
                <div
                    className="sf-m2-overlay"
                    onClick={() => setConfirmDelete(null)}
                >
                    <div
                        className="sf-m2 sf-m2-confirm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="sf-m2-close"
                            onClick={() => setConfirmDelete(null)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="sf-m2-title">Delete song?</h2>
                        <p className="sf-m2-sub">
                            “{confirmDelete.title}” will be permanently removed.
                        </p>
                        <div className="sf-m2-actions">
                            <button
                                className="sf-m2-ghost"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="sf-m2-danger"
                                onClick={() => doDelete(confirmDelete)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SongList
