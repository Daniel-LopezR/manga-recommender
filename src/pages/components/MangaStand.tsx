import { inferQueryResponse } from "../api/trpc/[trpc]";

import Image from "next/image";

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

export default MangaStand;