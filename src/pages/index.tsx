import { getRandomMangaId } from "@/utils/getRandomMangaId";
import { transformOptions } from "@/utils/transformOptions";
import { trpc } from "@/utils/trpc";
import React, { useEffect, useState } from "react";
import MangaStand from "../components/MangaStand";
import OptionsGenerator from "../components/OptionsGenerator";
import { prisma } from "@/backend/utils/prisma";

type options = {
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
  const [genreOpt, setGenreOpt] = useState<options | undefined>(() => undefined);
  const [demographicsOpt, setDemographicsOpt] = useState<options | undefined>(() => undefined);
  const { data, isLoading } = 
    genreOpt || demographicsOpt
      ? trpc["get-manga-by-options"].useQuery({
          genres: genreOpt,
          demographics: demographicsOpt,
          lastMangaId: mangaId
        })
      : trpc["get-manga-by-id"].useQuery({ id: mangaId });
  const genres = trpc["get-all-genres"].useQuery();
  const demographics = trpc["get-all-demographics"].useQuery();
  const dataLoaded = !isLoading && data !== undefined;
  const genreLoaded = !genres.isLoading && genres.data !== undefined;
  const demogLoaded =
    !demographics.isLoading && demographics.data !== undefined;

  const recommendMe = () => {
    setGenreOpt(
      transformOptions(document.getElementById("menuOptions-Genres")!)
    );
    setDemographicsOpt(
      transformOptions(document.getElementById("menuOptions-Demographics")!)
    );
    if (!genreOpt && !demographicsOpt) {
      setMangaId(() => getRandomMangaId(mangaCount, mangaId));
    }
  };
  // TODO: Rethink how i get manga by id/options and state of mangaId to better design the logic and stop getting back to back the same manga
  if(dataLoaded && data.manga && ( genreOpt || demographicsOpt)){
    setMangaId(data.manga.id);
    setGenreOpt(undefined);
    setDemographicsOpt(undefined);
  }

  return (
    <div className="w-screen flex flex-col items-center overflow-x-hidden">
      <div className="text-4xl text-center p-4">Manga Recommender</div>
      <div className="p-2" />
      <div className="w-screen flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-3 w-2/4">
          {genreLoaded && <OptionsGenerator dataFS={genres.data} />}
          {demogLoaded && <OptionsGenerator dataFS={demographics.data} />}
        </div>
        <div className="p-2" />
        <button
          onClick={recommendMe}
          className="py-2 px-4 border rounded-full hover:bg-red-900 transition cursor-pointer"
        >
          Recommend me!
        </button>
      </div>
      <div className="p-1" />
      <div className="w-96 h-full p-4 flex flex-col justify-center items-center">
        {dataLoaded && <MangaStand mangaFS={data} />}
        {!dataLoaded && (
          <div className="flex flex-col justify-center items-center h-full">
            <img className="" src="ball-triangle.svg" />
          </div>
        )}
      </div>
      <div className="text-1xl text-center p-2 fixed bottom-0 bg-gray-900 w-screen">
        <a
          href="https://github.com/Daniel-LopezR/manga-recommender"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
