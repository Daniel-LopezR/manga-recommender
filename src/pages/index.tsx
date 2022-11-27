import { getRandomManga } from "@/utils/getRandomManga";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import MangaStand from "./components/MangaStand";
import OptionsGenerator from "./components/OptionsGenerator"

export default function Home() {
  const [mangaId, setMangaId] = useState(() => getRandomManga());
  const { data, isLoading } = trpc["get-manga-by-id"].useQuery({ id: mangaId });
  const genres = trpc["get-all-genres"].useQuery();
  const demographics = trpc["get-all-demographics"].useQuery();
  const dataLoaded = !isLoading && data !== undefined;
  const genreLoaded = !genres.isLoading && genres.data !== undefined;
  const demogLoaded = !demographics.isLoading && demographics.data !== undefined;

  const recommendMe = () => {
    setMangaId(() => getRandomManga(mangaId));
    // Actually recommend based on genres included or excluded
  };

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
          <div onClick={recommendMe} className="py-2 px-4 border rounded-full hover:bg-red-900 transition cursor-pointer">Recommend me!</div>
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
