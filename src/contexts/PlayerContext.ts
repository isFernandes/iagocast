import { createContext } from 'react';

type Episode = {
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    url: string;
}

type PlayerContextProps = {
    episodeList: Episode[],
    currentEpisodeIndex:number,
    play:(episode:Episode)=>void,
    setPlayingState:(statePlaying:boolean)=>void,
    togglePlayButton:()=>void,
    isPlaying: boolean;
}

export const PlayerContext = createContext({} as PlayerContextProps);