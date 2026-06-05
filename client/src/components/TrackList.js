import { BsPlayFill, BsPauseFill } from "react-icons/bs"

// Shared compact track list used on Home, Profile, and Playlists.
// `onPlay(song, index)` plays it; `onOpen(song)` opens its detail page;
// `trailing(song)` renders the row's right-side action (like / remove).
const TrackList = ({
    songs = [],
    currentSong,
    isPlaying,
    onPlay,
    onOpen,
    trailing,
}) => (
    <div className="sf-tracks">
        {songs.map((song, i) => {
            const id = song.id || song._id
            const playingThis = currentSong === song.link && isPlaying
            return (
                <div
                    className={"sf-trk" + (playingThis ? " playing" : "")}
                    key={id || i}
                    onClick={() => onPlay(song, i)}
                >
                    <span className="sf-trk-num">
                        {playingThis ? (
                            <BsPauseFill />
                        ) : (
                            <span className="sf-trk-idx">{i + 1}</span>
                        )}
                        <BsPlayFill className="sf-trk-hoverplay" />
                    </span>
                    {song.cover ? (
                        <img
                            className="sf-trk-art"
                            src={song.cover}
                            alt={song.title}
                        />
                    ) : (
                        <div className="sf-trk-art sf-grad-art" />
                    )}
                    <div className="sf-trk-info">
                        <span
                            className="sf-trk-title"
                            onClick={(e) => {
                                e.stopPropagation()
                                onOpen && onOpen(song)
                            }}
                        >
                            {song.title}
                        </span>
                        <span className="sf-trk-artist">{song.artist}</span>
                    </div>
                    <span className="sf-trk-genre">{song.genre}</span>
                    <span className="sf-trk-action">
                        {trailing ? trailing(song) : null}
                    </span>
                </div>
            )
        })}
    </div>
)

export default TrackList
