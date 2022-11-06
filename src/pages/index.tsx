import { getRandomManga } from "@/utils/getRandomManga";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Home() {
  const [mangaId, setMangaId] = useState(() => getRandomManga());

  const { data, isLoading } = trpc["get-manga-by-id"].useQuery({ id: mangaId });

  if (isLoading) {
    return null;
  }

  console.log(data);

  const dataLoaded = !isLoading && data;

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
      <button className=" p-2 border rounded-2xl w-64 hover:bg-red-900 transition">
        Recommend me!
      </button>
      <div className="p-2" />
      {dataLoaded && (
        <div className="flex flex-col justify-center items-center">
          <div className="text-2xl text-center p-4 w-128">
            {data?.manga.title}
          </div>
          <img
            className="shadow-md shadow-white rounded-lg"
            src={data?.manga.main_picture.large}
            alt={data?.manga.title + " manga cover"}
            width={256}
          />

          <div className="p-2" />
          <a
            href=""
            className="border rounded-xl bg-cyan-700 p-2 hover:bg-cyan-600 transition"
          >
            + Info
          </a>
        </div>
      )}
      {!dataLoaded && (
        <div className="flex flex-col justify-center p-60">
          <img src="ball-triangle.svg" />
        </div>
      )}
    </div>
  );
}
