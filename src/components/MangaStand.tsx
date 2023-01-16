import Link from "next/link";
import Image from "next/image";
import { inferQueryResponse } from "../pages/api/trpc/[trpc]";

type MangaFromServer = inferQueryResponse<"get-manga-by-id">;

const MangaStand: React.FC<{ mangaFS: MangaFromServer }> = (props) => {
  const manga = props.mangaFS.manga;

  return (
    <>
      {manga === null ? (
        <div className="flex flex-col justify-center items-center w-full">
          <div className="text-center">
            There are no manga that satisfies the requested options
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="text-2xl text-center overflow-hidden text-ellipsis whitespace-nowrap p-2 w-72">
            {manga.title_ja === ""
              ? manga.title
              : manga.title +
                " - " +
                manga.title_ja}
          </div>
          <div className="relative w-5/6 flex justify-center max-h-96">
            {manga.img_large !== undefined ? (
              <Image
                className="shadow-md shadow-white rounded-lg"
                width={260}
                height={0}
                src={manga.img_large}
                alt={manga.title + " manga cover"}
              />
            ) : (
              <Image
                className="p-6 invert h-full w-full"
                src="/question-mark.svg"
                width={0}
                height={0}
                alt={manga.title + " doesn't have a manga cover"}
              />
            )}
          </div>

          <div className="p-2" />
          <Link
            href={`/${encodeURIComponent(manga.mal_api_id)}/info`}
            onClick={() => {
              document.getElementById("toast")?.classList.add("hidden");
            }}
            className="border rounded-xl bg-cyan-700 p-2 hover:bg-cyan-600 transition"
          >
            + Info
          </Link>
        </div>
      )}
    </>
  );
};

export default MangaStand;
