import { inferQueryResponse } from "../api/trpc/[trpc]";

import Image from "next/image";

type MangaFromServer = inferQueryResponse<"get-manga-by-id">;

const MangaStand: React.FC<{ mangaFS: MangaFromServer }> = (props) => {

  return (
    <>
      {props.mangaFS.manga === null ? (
        <div className="flex flex-col justify-center items-center w-full">
          <div>There was a problem loading the manga</div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center pb-9">
          <div className="text-2xl text-center overflow-hidden text-ellipsis whitespace-nowrap p-2 w-72">
            {props.mangaFS.manga.title_ja === ""
              ? props.mangaFS.manga.title
              : props.mangaFS.manga.title +
                " - " +
                props.mangaFS.manga.title_ja}
          </div>
          <div className="relative w-5/6 flex justify-center max-h-96">
            {props.mangaFS.manga.img_large !== undefined ? (
              <Image
                className="shadow-md shadow-white rounded-lg"
                width={260}
                height={0}
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
    </>
  );
};

export default MangaStand;