import React from "react"
import {
    BsPlayFill,
    BsPauseFill,
    BsSkipStartFill,
    BsSkipEndFill,
} from "react-icons/bs"
import "./styles/FooterMusicPlayer.css"

const AudioControls = ({
    isPlaying,
    onPlayPauseClick,
    onPrevClick,
    onNextClick,
}) => (
    <div className="footer-audio-controls sf-controls">
        <button
            type="button"
            className="sf-ctrl-side"
            aria-label="Previous"
            onClick={onPrevClick}
        >
            <BsSkipStartFill />
        </button>
        <button
            type="button"
            className="sf-ctrl-play"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={() => onPlayPauseClick(!isPlaying)}
        >
            {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
        </button>
        <button
            type="button"
            className="sf-ctrl-side"
            aria-label="Next"
            onClick={onNextClick}
        >
            <BsSkipEndFill />
        </button>
    </div>
)

export default AudioControls
