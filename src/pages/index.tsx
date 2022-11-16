import { getRandomManga } from "@/utils/getRandomManga";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";

export default function Home() {
  const [mangaId, setMangaId] = useState(() => getRandomManga());
  const { data, isLoading } = trpc["get-manga-by-id"].useQuery({ id: mangaId });
  const dataLoaded = !isLoading && data !== undefined;

  const recommendMe = () => {
    setMangaId(() => getRandomManga(mangaId));
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-4xl text-center p-4">Manga Recommender</div>
      <div className="p-4" />
      <div className="flex flex-row justify-center gap-3 w-2/4">
        <div className="flex flex-col w-2/4">
          <div className="text-center p-2">Genres</div>
          <div className="flex flex-wrap flex-row justify-around gap-2">
            <div className="bg-gray-600 p-2 text-center border rounded-3xl hover:bg-slate-500 transition">
              Supernatural
            </div>
          </div>
        </div>
        <div className="flex flex-col w-2/4">
          <div className="text-center p-2">Demographic</div>
          <div className="flex flex-wrap flex-row justify-around gap-2">
            <div className="bg-gray-600 p-2 text-center border rounded-3xl hover:bg-slate-500 transition">
              Seinen
            </div>
          </div>
        </div>
      </div>
      <div className="p-4" />
      <button
        onClick={recommendMe}
        className="py-2 px-4 border rounded-full hover:bg-red-900 transition"
      >
        Recommend me!
      </button>
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

type MangaFromServer = inferQueryResponse<"get-manga-by-id">;

const MangaStand: React.FC<{ mangaFS: MangaFromServer }> = (props) => {

  return (
    <div className="h-full">
      {props.mangaFS.manga === null ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div>There was a problem loading the manga</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="text-2xl text-center p-2">
            {props.mangaFS.manga.title_ja === ""
              ? props.mangaFS.manga.title
              : props.mangaFS.manga.title +
                " - " +
                props.mangaFS.manga.title_ja}
          </div>
          <div className="relative w-80 h-5/6">
            {props.mangaFS.manga.img_large !== undefined ? (
              <Image
                className="shadow-md shadow-white rounded-lg"
                fill
                sizes="(max-height: 1200px) 50vw,
              (max-height: 768px) 100vw,
              33vw"
                src={props.mangaFS.manga.img_large}
                alt={props.mangaFS.manga.title + " manga cover"}
              />
            ) : (
              <img
                className="p-6 invert h-full w-full"
                src={"question-mark.svg"}
                alt={props.mangaFS.manga.title + " doesn't have manga cover"}
              />
            )}
          </div>

          <div className="p-2" />
          <a
            href={"/" + props.mangaFS.manga.id}
            className="border rounded-xl bg-cyan-700 p-2 hover:bg-cyan-600 transition"
          >
            + Info
          </a>
        </div>
      )}
    </div>
  );
};
