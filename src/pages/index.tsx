import React, { useState } from "react";
import MangaStand from "../components/MangaStand";
import OptionsGenerator from "../components/OptionsGenerator";
import Head from "next/head";
import Image from "next/image";
import { prisma } from "@/backend/utils/prisma";
import { trpc } from "@/utils/trpc";
import { getRandomMangaId } from "@/utils/getRandomMangaId";
import { transformOptions } from "@/utils/transformOptions";

type Options = {
  optionsIncluded: number[] | undefined;
  optionsExcluded: number[] | undefined;
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const mangaCount: number = await prisma.manga.count();
  return { props: { mangaCount } };
}

export default function Home({ mangaCount }: { mangaCount: number }) {
  const [mangaId, setMangaId] = useState(() => getRandomMangaId(mangaCount));
  const [lastMangaId, setLastMangaId] = useState<number | undefined>();
  const [genreOpt, setGenreOpt] = useState<Options | undefined>();
  const [demographicsOpt, setDemographicsOpt] = useState<Options | undefined>();
  const { data, isLoading } =
    lastMangaId !== undefined
      ? trpc["get-manga-by-options"].useQuery({
          genres: genreOpt,
          demographics: demographicsOpt,
          lastMangaId: lastMangaId,
        })
      : trpc["get-manga-by-id"].useQuery({ id: mangaId });
  const genres = trpc["get-all-genres"].useQuery();
  const demographics = trpc["get-all-demographics"].useQuery();
  const dataLoaded = !isLoading && data !== undefined;
  const genreLoaded = !genres.isLoading && genres.data !== undefined;
  const demogLoaded =
    !demographics.isLoading && demographics.data !== undefined;

  function recommendMe() {
    const genres = transformOptions(
      document.getElementById("menuOptions-Genres")!
    );
    const demographics = transformOptions(
      document.getElementById("menuOptions-Demographics")!
    );
    setGenreOpt(genres);
    setDemographicsOpt(demographics);
    if (genres || demographics) {
      setLastMangaId(mangaId);
    } else {
      setMangaId(() => getRandomMangaId(mangaCount, mangaId));
    }
  }
  //Still not happy with this system, at least now it's impossible to get back to back the same manga
  if (dataLoaded && data.manga && lastMangaId !== undefined) {
    setMangaId(data.manga.id);
    setLastMangaId(undefined);
  }

  return (
    <>
      <Head>
        <title>Manga Recommender</title>
        <meta property="og:title" content="Manga Recommender" key="title" />
        <meta
          name="description"
          content="Manga recommender app, select between multiple genres and demographics or not and let the app decide a random manga for you"
          key="desc"
        />
      </Head>
      <div className="md:flex-grow flex flex-col justify-center items-center overflow-x-hidden p-2">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-3 md:w-2/4 w-3/4">
            {genreLoaded && <OptionsGenerator dataFS={genres.data} />}
            {demogLoaded && <OptionsGenerator dataFS={demographics.data} />}
          </div>
          <div className="p-2" />
          {dataLoaded ? (
            <button
              onClick={recommendMe}
              className="py-2 px-4 border rounded-full hover:bg-red-900 transition cursor-pointer"
            >
              Recommend me!
            </button>
          ) : (
            <button className="py-2 px-4 border rounded-full bg-red-900 transition cursor-pointer">
              Recommending...
            </button>
          )}
        </div>
        <div className="p-1" />
        <div className="w-96 h-full p-4 flex flex-col justify-center items-center">
          {dataLoaded ? (
            <MangaStand mangaFS={data} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <Image
                className="h-auto w-auto"
                src="/ball-triangle.svg"
                width={0}
                height={0}
                alt="Loading Image..."
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
