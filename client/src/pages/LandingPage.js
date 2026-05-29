import React, { useContext } from "react";
import "./styles/LandingPage.css";
import { Hero } from "../components";
import { AuthContext } from "../context/authContext";
import Home from "../components/Home";

const LandingPage = ({
  setCurrentSong,
  getSongInfo,
  currentPlayer,
  setIsPlaying,
  isPlaying,
  currentSong,
  setSinglePL,
  trackIndex,
  getTrackIndex,
}) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <Home
          setSinglePL={setSinglePL}
          currentSong={currentSong}
          setIsPlaying={setIsPlaying}
          currentPlayer={currentPlayer}
          getSongInfo={getSongInfo}
          setCurrentSong={setCurrentSong}
          isPlaying={isPlaying}
          trackIndex={trackIndex}
          getTrackIndex={getTrackIndex}
        />
      ) : (
        <div className="landing-page-wrapper">
          <Hero />
        </div>
      )}
    </>
  );
};

export default LandingPage;
