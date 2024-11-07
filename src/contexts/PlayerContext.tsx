import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    url: string;
}

type PlayerContextProps = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    play: (episode: Episode) => void,
    playList: (list: Episode[], index: number) => void,
    setPlayingState: (statePlaying: boolean) => void,
    togglePlayButton: () => void,
    toggleLoopButton: () => void,
    toggleShuffleButton: () => void,
    playNext: () => void,
    playPervious: () => void,
    clearPlayer: () => void,
    isPlaying: boolean;
    isLoop: boolean;
    isShuffle: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextProps);

type PlayerContextProviderProps = {
    children: ReactNode;
}


export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    const play = (episode: Episode) => {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true)
    };

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true)
    };

    const togglePlayButton = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleLoopButton = () => {
        setIsLoop(!isLoop);
    };

    const toggleShuffleButton = () => {
        setIsShuffle(!isShuffle);
    };

    const setPlayingState = (statePlaying: boolean) => {
        setIsPlaying(statePlaying);
    };

    const clearPlayer = () => {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(false)
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffle || (currentEpisodeIndex + 1) < episodeList.length;

    const playNext = () => {
        const nextEpisodeIndex = currentEpisodeIndex + 1;

        if (isShuffle) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(nextEpisodeIndex);
        }
    }

    const playPervious = () => {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                currentEpisodeIndex,
                episodeList,
                play,
                playList,
                playNext,
                playPervious,
                togglePlayButton,
                toggleLoopButton,
                toggleShuffleButton,
                setPlayingState,
                isPlaying,
                isLoop,
                isShuffle,
                hasNext,
                hasPrevious,
                clearPlayer,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}