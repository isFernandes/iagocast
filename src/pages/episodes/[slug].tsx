import React from 'react';

import { useRouter } from 'next/router'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from "next/link";

import { api } from '../../services/api';
import { convertDurationToTimeString, formatDatePublishToString } from '../../utils/formatingDataForUse';


import styles from './episode.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode,
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img src='/arrow-left.svg' />
          </button>
        </Link>
        <Image
          src={episode.thumbnail}
          width={700}
          height={160}
          objectFit="cover"
        />
        <button>
          <img src='/play.svg' />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={
        {
          __html: episode.description,
        }
      } />

    </div>
  )
}


//Obrigatorio para paginas estaticas de dados dinamicos 
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("/episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });
  const paths = data.map(ep => {
    return {
      params: { 
        slug: ep.id,
      }
    }
  })

  //os paths permitem que determinados conteudos da pagina tambem sejam carregados de maneira estatica
  /**
   * Fallback
   * recebe alguns parametro 
   * - blocking: so     redireciona depois de carregar. 
   * - true: redireciona mas a pagina apresenta carregamento. 
   * -false: retorna erro 404 direto
   *  
   */
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: formatDatePublishToString(data.published_at),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, //24 horas 
  }
}