import Header from "../components/Header";
import "../styles/global.scss";

import styles from "../styles/app.module.scss";
import Player from "../components/Player";
import { PlayerContext } from "../contexts/PlayerContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true)
  };

  const togglePlayButton = () => {
    setIsPlaying(!isPlaying);
  };

  const setPlayingState = (statePlaying: boolean) => {
    setIsPlaying(statePlaying);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        play,
        togglePlayButton,
        isPlaying,
        setPlayingState,
      }}
    >
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp;
