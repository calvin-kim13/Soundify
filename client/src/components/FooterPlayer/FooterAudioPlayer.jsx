import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import FooterAudioControls from "./FooterAudioControls";
import "./styles/FooterMusicPlayer.css";
import { FiVolume1, FiVolume2 } from "react-icons/fi";
let count = 0;
const AudioPlayer = ({
  currentSong,
  oneSongClick,
  genreClickCount,
  prevCount,
  currentPlayer,
  isPlaying,
  setIsPlaying,
  songInfo,
  trackIndex,
  getTrackIndex,
  trackProgress,
  setTrackProgress,
  singlePL,
  setCurrentSong,
  getSongInfo,
  volume,
  setVolume,
}) => {
  // State
  const location = useLocation();

  const [song, setSong] = useState({ title: "", artist: "" });
  // Destructure for conciseness
  useEffect(() => {}, []);

  // Refs
  let audioRef = currentPlayer;

  const isReady = useRef(false);
  const intervalRef = useRef();

  const [duration, setDuration] = useState(0);
  const [trackStyle, setTrackStyle] = useState(`
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${0}, #fff), color-stop(${0}, #777))`);
  const [currentPercent, setCurrentPercent] = useState(0);

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef) {
        if (audioRef.current && audioRef.current.ended) toNextTrack();
        else if (audioRef.ended) toNextTrack();
        else {
          if (audioRef.current) setTrackProgress(audioRef.current.currentTime);
          else setTrackProgress(audioRef.currentTime);
        }
      }
    }, [100]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const toPrevTrack = () => {
    if (!singlePL.songs || singlePL.songs.length === 0) return;
    if (trackIndex - 1 < 0) {
      getTrackIndex(singlePL.songs.length - 1);
    } else {
      getTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (!singlePL.songs || singlePL.songs.length === 0) return;
    if (trackIndex < singlePL.songs.length - 1) {
      getTrackIndex(trackIndex + 1);
    } else {
      getTrackIndex(0);
    }
  };

  const onVolumeChange = (event, value) => {
    // MUI Slider passes the value as the second argument, not event.target.value.
    const newVolume = typeof value === "number" ? value : +event?.target?.value;
    if (!Number.isFinite(newVolume)) return;
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    if (genreClickCount > prevCount) {
      audioRef.current.pause();
    }
  }, [genreClickCount, prevCount, currentSong]);

  // Handles cleanup and setup when changing tracks

  useEffect(() => {
    if (location.pathname.split("/")[1] !== "") count++;
    if (location.pathname.split("/")[1] !== "song") {
      if (audioRef.current !== undefined) {
        if (genreClickCount > prevCount) {
          audioRef.current.pause();
        }

        if (isReady.current && !isPlaying && count < 1) {
          count++;
        } else {
          // Set the isReady ref as true for the next pass
          isReady.current = true;
        }

        if (isPlaying) {
          startTimer();
        }
      }
    } else {
      if (audioRef.current) {
        if (audioRef.current.src !== currentSong && currentSong) {
          audioRef.current.src = currentSong;
        }
        if (isReady.current && !isPlaying && count < 1) {
          count++;
        } else {
          // Set the isReady ref as true for the next pass
          isReady.current = true;
        }
        if (isPlaying) {
          startTimer();
        }
      }
    }
  }, [isPlaying, genreClickCount, currentSong]);

  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.volume = volume;
      // Destructure for conciseness
      setDuration(audioRef.current.duration);

      setCurrentPercent(
        duration ? `${(trackProgress / duration) * 100}%` : "0%"
      );
      setTrackStyle(`
            -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercent}, #fff), color-stop(${currentPercent}, #777))`);

      setTrackProgress(audioRef.current.currentTime);
    }
  }, [trackIndex, oneSongClick, location.pathname, trackProgress]);

  useEffect(() => {
    if (singlePL.length !== 0) {
      setCurrentSong(singlePL.songs[trackIndex].link);
      getSongInfo({
        title: singlePL.songs[trackIndex].title,
        artist: singlePL.songs[trackIndex].artist,
      });
    }
  }, [trackIndex]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      if (audioRef.current) audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  let h,
    m,
    s,
    hDisplay,
    mDisplay,
    sDisplay,
    ch,
    cm,
    cs,
    chDisplay,
    cmDisplay,
    csDisplay;
  if (audioRef.current) {
    if (audioRef.current.currentTime === undefined)
      audioRef.current.currentTime = 0;

    ch = Math.floor(audioRef.current.currentTime / 3600);
    cm = Math.floor((audioRef.current.currentTime % 3600) / 60);
    cs = Math.floor((audioRef.current.currentTime % 3600) % 60);

    chDisplay = ch > 0 ? ch + (ch === 1 ? ":" : ":") : "";
    cmDisplay = cm > 0 ? cm + (cm === 1 ? ":" : ":") : "0:";
    csDisplay = cs < 10 ? "0" + cs : cs;

    h = Math.floor(audioRef.current.duration / 3600);
    m = Math.floor((audioRef.current.duration % 3600) / 60);
    s = Math.floor((audioRef.current.duration % 3600) % 60);

    hDisplay = h > 0 ? h + (h === 1 ? ":" : ":") : "";
    mDisplay = m > 0 ? m + (m === 1 ? ":" : ":") : "0:";
    sDisplay = s > 0 ? s + (s === 1 ? "" : "") : "00";
  }

  const displayTime = `${chDisplay}${cmDisplay}${csDisplay}`;

  const endTime = `${hDisplay}${mDisplay}${sDisplay}`;

  return (
    <div className="footer-audio-player sf-player">
      {/* left: track info */}
      <div className="sf-player-left">
        <div className="sf-player-meta">
          <span className="footer-title sf-player-title">{songInfo.title}</span>
          <span className="footer-artist sf-player-artist">
            {songInfo.artist}
          </span>
        </div>
        <FooterAudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          onPlayPauseClick={setIsPlaying}
        />
      </div>

      {/* center: progress / time */}
      <div className="sf-player-center">
        <div className="sf-player-progress">
          <span className="sf-player-time">{displayTime}</span>
          <input
            type="range"
            value={trackProgress}
            max={duration ? duration : `${duration}`}
            className="footer-progress sf-player-bar"
            id="footerTimerBar"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          />
          <span className="sf-player-time">{endTime}</span>
        </div>
      </div>

      {/* right: volume */}
      <div className="sf-player-right volContainer">
        <FiVolume1 className="sf-vol-icon" />
        <input
          type="range"
          className="sf-volume"
          aria-label="Volume"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
