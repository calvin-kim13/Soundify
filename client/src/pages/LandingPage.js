import React, { useContext } from "react"
import "./styles/LandingPage.css"
import { Hero } from "../components"
import { AuthContext } from "../context/authContext"
import landingPageImg from "../assets/landingPage.svg"
import Dashboard2 from "../components/Dashboard/Dashboard2"

const LandingPage = ({
    setCurrentSong,
    getSongInfo,
    currentPlayer,
    setIsPlaying,
    isPlaying,
    currentSong,
}) => {
    const { user } = useContext(AuthContext)

    return (
        <>
            {user ? (
                <>
                    <Dashboard2
                        currentSong={currentSong}
                        setIsPlaying={setIsPlaying}
                        currentPlayer={currentPlayer}
                        getSongInfo={getSongInfo}
                        setCurrentSong={setCurrentSong}
                        isPlaying={isPlaying}
                    />
                </>
            ) : (
                <div className="landing-page-wrapper">
                    <Hero />
                    <div className="landing-img-container">
                        <img src={landingPageImg} alt="Landing Page Image" />
                    </div>
                </div>
            )}
        </>
    )
}

export default LandingPage
