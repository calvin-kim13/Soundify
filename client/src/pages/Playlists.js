import { useState, useEffect } from "react"
import AudioPlayerContainer from "../components/MusicPlayer/AudioPlayerContainer"

import "./styles/Playlists.css"
import { Row, Col } from "antd"
import { useQuery } from "@apollo/client"
import { GET_USER_PLAYLIST } from "../utils/queries/songQueries"
import { useLocation } from "react-router-dom"
import PlaylistList from "../components/PlaylistLists"

const Playlists = ({ currentPlayer }) => {
    const [singlePL, setSinglePL] = useState([])
    const username = localStorage.getItem("username")
    const [playlistClicked, setPlaylistClicked] = useState(false)
    const [title, setPlTitle] = useState("")
    const [playlistSong, setPlaylistSong] = useState()
    const [selectedSong, setSelectedSong] = useState(false)
    const [newTitle, setTitle] = useState()

    const [r, setR] = useState(false)
    const location = useLocation()
    let audioList = []

    const {
        loading: playlistloading,
        data,
        refetch,
    } = useQuery(GET_USER_PLAYLIST, {
        variables: { owner: username },
    })
    let currentPlaylists = data?.userPlaylists || []
    useEffect(() => {
        if (data !== undefined)
            localStorage.setItem("playlists", JSON.stringify(currentPlaylists))
    }, [currentPlaylists])

    useEffect(() => {
        return setPlaylistClicked(false) && setSinglePL([])
    }, [])

    useEffect(() => {
        const fetchPlaylists = async () => {
            await refetch()
        }
        fetchPlaylists()
    }, [location.pathname])

    useEffect(() => {
        localStorage.setItem("singlePL", JSON.stringify(singlePL))
    }, [singlePL])

    const switchPlaylist = (e) => {
        e.preventDefault()
        setPlTitle(e.currentTarget.outerText)
        setPlaylistClicked(true)

        for (let i = 0; i < currentPlaylists.length; i++) {
            if (currentPlaylists[i]._id === e.currentTarget.id) {
                setSinglePL(currentPlaylists[i])
            }
        }
    }

    const handleClick = (e) => {
        e.preventDefault()
        console.log(
            e.currentTarget,
            e.currentTarget.attributes.name,
            e.currentTarget.attributes.songTitle,
        )
        if (setPlaylistSong !== undefined && setSelectedSong !== undefined) {
            setSelectedSong(true)
            setPlaylistSong(e.currentTarget.attributes.name)
            setTitle(e.currentTarget.attributes.songTitle)
            let title = e.currentTarget.parentNode
            console.log(e.currentTarget.parentNode)
            let find = document.querySelectorAll(".active")
            find.forEach((find) => {
                find.classList.remove("active")
            })
            title.classList.add("active")
            setR(true)
        }
    }

    return playlistloading ? (
        <div>Loading...</div>
    ) : (
        <div style={{ marginBottom: 100, height: "100vh" }}>
            <div style={{ display: "flex" }}>
                <aside className="playlistNames">
                    <h2
                        style={{
                            color: "white",
                            fontWeight: "bolder",
                        }}
                    >
                        Playlists:
                    </h2>
                    {currentPlaylists.map((playlist) => {
                        return (
                            <button
                                style={{
                                    color: "white",
                                    fontWeight: "bolder",
                                    padding: 5,
                                }}
                                key={playlist.title}
                                id={playlist._id}
                                onClick={switchPlaylist}
                                className="playlist-List"
                            >
                                {playlist.plTitle}
                            </button>
                        )
                    })}
                </aside>
                <div className="Playlist-container">
                    <AudioPlayerContainer
                        playlistSong={playlistSong}
                        selectedSong={selectedSong}
                        setSelectedSong={setSelectedSong}
                        newTitle={newTitle}
                        r={r}
                        setR={setR}
                        currentPlayer={currentPlayer}
                        singlePL={singlePL}
                    />
                    <div className="item">
                        <div className="content">
                            <h2 className="playlist-title">
                                Playlist Name: {title}
                            </h2>

                            {playlistClicked ? (
                                <PlaylistList
                                    data={singlePL.songs}
                                    handleClick={handleClick}
                                />
                            ) : (
                                // singlePL.songs.map((song) => {
                                //     return (
                                //         <Row key={song._id}>
                                //             <button
                                //                 name={song.link}
                                //                 title={song.title}
                                //                 onClick={handleClick}
                                //             >
                                //                 <Col span={8}>
                                //                     <h2 className="playlist-header">
                                //                         {song.title}
                                //                     </h2>
                                //                 </Col>
                                //             </button>
                                //             <Col span={8}>
                                //                 <h2 className="playlist-header">
                                //                     {song.artist}
                                //                 </h2>
                                //             </Col>
                                //             <Col span={8}>
                                //                 <button id="removeBtn">
                                //                     <div>
                                //                         <span
                                //                             className="trashcan"
                                //                             style={{
                                //                                 color: "red",
                                //                                 marginTop:
                                //                                     "7px",
                                //                             }}
                                //                         >
                                //                             <AiFillCloseCircle />
                                //                         </span>
                                //                     </div>
                                //                 </button>
                                //             </Col>
                                //         </Row>
                                //     )
                                // })
                                <div style={{ color: "white" }}>
                                    NO PLAYLIST DATA
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Playlists
