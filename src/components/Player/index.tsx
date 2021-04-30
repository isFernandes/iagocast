import Image from "next/image";
import { useContext, useEffect, useRef } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import styles from "./styles.module.scss";

export default function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlayButton,
    setPlayingState,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" />
        <strong>Ouvindo agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            src={episode.thumbnail}
            width={592}
            height={592}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#84d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#84d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={() => {
              togglePlayButton();
            }}
          >
            {isPlaying ? <img src="/pause.svg" /> : <img src="/play.svg" />}
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" />
          </button>
        </div>
      </footer>
    </div>
  );
}
