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
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-4xl text-center p-4">Manga Recommender</div>
      <div className="p-4" />
      <div className="w-screen flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center gap-3 w-2/4">
          {genreLoaded && <OptionsGenerator dataFS={genres.data} />}
          {demogLoaded && <OptionsGenerator dataFS={demographics.data} />}
        </div>
          <div className="p-4" />
          <div onClick={recommendMe} className="py-2 px-4 border rounded-full hover:bg-red-900 transition cursor-pointer">Recommend me!</div>
      </div>
        
      <div className="p-2" />
      <div className="flex-1 w-96 h-2/3 pl-4 pr-4 pb-4">
        {dataLoaded && <MangaStand mangaFS={data} />}
        {!dataLoaded && (
          <div className="flex flex-col justify-center items-center h-full">
            <img className="" src="ball-triangle.svg" />
          </div>
        )}
      </div>
      <div className="text-1xl text-center p-4 bottom-0">
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
