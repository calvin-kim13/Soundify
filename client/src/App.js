import {
  LandingPage,
  Register,
  Login,
  SongList,
  Playlists,
  UserPage,
} from "./pages";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SongDetails from "./pages/SongDetails";
import { AuthContext } from "./context/authContext";
import { useContext, useEffect, useState, useRef } from "react";
import Footer from "./components/Footer";
import DashResults from "./components/Dashboard/DashResults";
import "./styles/auth-theme.css";
import "./styles/app-theme.css";

function App() {
  const [genreClickCount, setGenreClickCount] = useState(0);
  const currentPlayer = useRef(new Audio());
  const [prevCount, setPrevCount] = useState(0);
  const [songInfo, getSongInfo] = useState({
    title: "",
    artist: "",
  });
  const [trackProgress, setTrackProgress] = useState(0);
  const [oneSongClick, setOneSongClick] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [trackIndex, getTrackIndex] = useState(0);
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [dashSearchResults, setDashSearchResults] = useState();
  const [detailsPlaying, isDetailsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);

  const [singlePL, setSinglePL] = useState([]);
  const { user } = useContext(AuthContext);

  // Opening a song-details page starts paused so it doesn't inherit play state.
  useEffect(() => {
    if (location.pathname.split("/")[1] === "song") {
      setIsPlaying(false);
    }
  }, [location.pathname]);

  // Single source of truth for playback: only play/pause in response to the
  // isPlaying state — never on navigation. (Previously several effects called
  // play() on route changes, which made songs restart when returning to a page.)
  useEffect(() => {
    if (!currentPlayer.current) return;
    if (isPlaying) currentPlayer.current.play().catch(() => {});
    else currentPlayer.current.pause();
  }, [isPlaying]);

  // When the selected track changes, continue only if already playing.
  useEffect(() => {
    if (isPlaying && currentPlayer.current && currentPlayer.current.src) {
      currentPlayer.current.play().catch(() => {});
    }
  }, [currentSong]);

  // Keep the audio element's volume in sync with the global volume state.
  useEffect(() => {
    if (currentPlayer.current) currentPlayer.current.volume = volume;
  }, [volume]);
  const hideNav = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="sf-theme">
      {!hideNav && <Navbar setDashSearchResults={setDashSearchResults} />}
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              setSinglePL={setSinglePL}
              currentSong={currentSong}
              setIsPlaying={setIsPlaying}
              isPlaying={isPlaying}
              currentPlayer={currentPlayer}
              getSongInfo={getSongInfo}
              setCurrentSong={setCurrentSong}
              trackIndex={trackIndex}
              getTrackIndex={getTrackIndex}
            />
          }
        />
        <Route
          path="/DashResults"
          element={
            <DashResults
              setSinglePL={setSinglePL}
              getSongInfo={getSongInfo}
              setIsPlaying={setIsPlaying}
              currentPlayer={currentPlayer}
              dashSearchResults={dashSearchResults}
              setOneSongClick={setOneSongClick}
              setCurrentSong={setCurrentSong}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/uploads"
          element={user ? <SongList /> : <Navigate to="/" />}
        />
        <Route
          path="/song/:songId"
          element={
            <SongDetails
              setSinglePL={setSinglePL}
              setTrackProgress={setTrackProgress}
              trackProgress={trackProgress}
              isDetailsPlaying={isDetailsPlaying}
              getSongInfo={getSongInfo}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentPlayer={currentPlayer}
              setCurrentSong={setCurrentSong}
              volume={volume}
            />
          }
        />
        <Route
          path="/user/:username"
          element={
            user ? (
              <UserPage
                getSongInfo={getSongInfo}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                currentPlayer={currentPlayer}
                trackIndex={trackIndex}
                getTrackIndex={getTrackIndex}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/playlists"
          element={
            user ? (
              <Playlists
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                currentSong={currentSong}
                getSongInfo={getSongInfo}
                setCurrentSong={setCurrentSong}
                currentPlayer={currentPlayer}
                singlePL={singlePL}
                setSinglePL={setSinglePL}
                trackIndex={trackIndex}
                getTrackIndex={getTrackIndex}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      {user && (
        <Footer
          getSongInfo={getSongInfo}
          setCurrentSong={setCurrentSong}
          singlePL={singlePL}
          trackProgress={trackProgress}
          setTrackProgress={setTrackProgress}
          songInfo={songInfo}
          getTrackIndex={getTrackIndex}
          trackIndex={trackIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentPlayer={currentPlayer}
          genreClickCount={genreClickCount}
          prevCount={prevCount}
          currentSong={currentSong}
          oneSongClick={oneSongClick}
          setOneSongClick={setOneSongClick}
          volume={volume}
          setVolume={setVolume}
        />
      )}
      <div>
        <div>
          {" "}
          <audio
            id="audio-element"
            crossOrigin="anonymous"
            ref={currentPlayer}
            src={currentSong}
            allow="autoplay"
          ></audio>
        </div>
      </div>
    </div>
  );
}

export default App;
