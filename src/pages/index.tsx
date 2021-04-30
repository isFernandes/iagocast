import React, { useContext } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "../services/api";
import {
  convertDurationToTimeString,
  formatDatePublishToString,
} from "../utils/formatingDataForUse";

import styles from "./home.module.scss";
import { PlayerContext } from "../contexts/PlayerContext";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext);
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((ep) => {
            return (
              <li key={ep.id}>
                <Image
                  src={ep.thumbnail}
                  width={192}
                  height={192}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <Link href={`episodes/${ep.id}`}>
                    <a>{ep.title}</a>
                  </Link>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAt}</span>
                  <span>{ep.durationAsString}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    play(ep);
                  }}
                >
                  <img src="/play-green.svg" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episodeos</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((ep) => {
              return (
                <tr key={ep.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      src={ep.thumbnail}
                      width={120}
                      height={120}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`episodes/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  <td>{ep.members}</td>
                  <td style={{ width: 100 }}>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        play(ep);
                      }}
                    >
                      <img src="/play-green.svg" />
                    </button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((ep) => {
    return {
      id: ep.id,
      title: ep.title,
      thumbnail: ep.thumbnail,
      members: ep.members,
      publishedAt: formatDatePublishToString(ep.published_at),
      duration: Number(ep.file.duration),
      durationAsString: convertDurationToTimeString(Number(ep.file.duration)),
      url: ep.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
