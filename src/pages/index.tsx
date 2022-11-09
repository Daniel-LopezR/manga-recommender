import { getRandomManga } from "@/utils/getRandomManga";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

export default function Home() {
  const [mangaId, setMangaId] = useState(() => getRandomManga());
  const { data, isLoading } = trpc["get-manga-by-id"].useQuery({ id: mangaId });
  const dataLoaded = !isLoading && data;

  const recommendMe = () => {
    setMangaId(() => getRandomManga(mangaId));
  }

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
      <button onClick={recommendMe} className="py-2 px-4 border rounded-full hover:bg-red-900 transition">
        Recommend me!
      </button>
      <div className="p-2" />
      <div className="flex-1 w-80 h-full pl-4 pr-4 pb-4">
        {dataLoaded && (
          <MangaStand manga={data}/>
        )}
        {!dataLoaded && (
          <div className="flex flex-col justify-center items-center h-full">
            <img className="" src="ball-triangle.svg"/>
          </div>
        )}
      </div>
      <div className="text-1xl text-center p-4 justify-self-end "><a href="https://github.com/Daniel-LopezR/manga-recommender" target="_blank">GitHub</a></div>
    </div>
  );
}


type MangaFromServer = inferQueryResponse<"get-manga-by-id">;

const MangaStand: React.FC<{manga: MangaFromServer}> = (props) => {
  return (<div className="flex flex-col justify-center items-center h-full">
  <div className="text-2xl text-center p-2">
    {props.manga.manga.alternative_titles.ja === ""
      ? props.manga.manga.title
      : props.manga.manga.title + " - " + props.manga.manga.alternative_titles.ja}
  </div>
  {props.manga.manga.main_picture !== undefined ? (
    <img
      className="shadow-md shadow-white rounded-lg h-full w-full"
      src={props.manga.manga.main_picture.large}
      alt={props.manga.manga.title + " manga cover"}
    />
  ) : (
    <img
      className="p-6 invert h-full w-full"
      src={"question-mark.svg"}
      alt={props.manga.manga.title + " doesn't have manga cover"}
    />
  )}
  <div className="p-2" />
  <a
    href={"/" + props.manga.manga.id}
    className="border rounded-xl bg-cyan-700 p-2 hover:bg-cyan-600 transition"
  >
    + Info
  </a>
</div>);
}