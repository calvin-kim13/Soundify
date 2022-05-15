import "./styles/LandingPage.css";
import { Playlist, Hero } from "../components";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Music Player</h1>

            <div className="lsItem">
              <label>Music Player</label>
            </div>

            <div className="musicplayer">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/1y6smkh6c-0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <button>Play</button>
          </div>
          <div className="listResult">
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
