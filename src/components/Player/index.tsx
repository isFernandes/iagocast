import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/formatingDataForUse";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlayButton,
    toggleLoopButton,
    toggleShuffleButton,
    setPlayingState,
    playNext,
    playPervious,
    clearPlayer,
    hasPrevious,
    hasNext,
    isLoop,
    isShuffle,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

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

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayer();
    }
  };

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" />
        <strong>Ouvindo agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            alt="gg"
            src={episode.thumbnail}
            className={styles.image}
            width={360}
            height={592}
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
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#84d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#84d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLoop}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={() => {
              toggleShuffleButton();
            }}
            className={isShuffle ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={() => {
              playPervious();
            }}
          >
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
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={() => {
              playNext();
            }}
          >
            <img src="/play-next.svg" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={() => {
              toggleLoopButton();
            }}
            className={isLoop ? styles.isActive : ""}
          >
            <img src="/repeat.svg" />
          </button>
        </div>
      </footer>
    </div>
  );
}
