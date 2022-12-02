import Link from "next/link";
import Image from "next/image";
import { MouseEventHandler } from "react";
import { trpc } from "@/utils/trpc";
import { prisma } from "@/backend/utils/prisma";

type GenreDemo = {
  genres: {
    genre: {
      name: string;
    };
  }[];
  demographic: {
    name: string;
  };
} | null;

type Genre =
  | {
      name: string;
    }[]
  | undefined;

type Demographic = string | undefined;

export async function getStaticPaths() {
  const allManga = await prisma.manga.findMany({
    select: { mal_api_id: true },
  });
  const params = allManga.map((manga) => {
    return { params: { id: manga.mal_api_id.toString() } };
  });
  return {
    paths: params,
    fallback: "blocking",
  };
}

export async function getStaticProps(params: { params: { id: string } }) {
  const id = Number(params.params.id);
  const genreDemo: GenreDemo = await prisma.manga.findFirst({
    where: { mal_api_id: id },
    select: {
      demographic: { select: { name: true } },
      genres: { select: { genre: { select: { name: true } } } },
    },
  });
  const genres = genreDemo
    ? genreDemo.genres.map((genresObj) => {
        return { name: genresObj.genre.name };
      })
    : undefined;

  return {
    props: {
      genres,
      demographic: genreDemo ? genreDemo.demographic.name : undefined,
      id,
    },
  };
}

function InfoPage(props: {
  genres: Genre;
  demographic: Demographic;
  id: number;
}) {
  const { data, isLoading } = trpc["get-manga-info"].useQuery({
    mal_api_id: props.id,
  });
  const dataLoaded = !isLoading && data !== undefined;

  const showSynopsis: MouseEventHandler<HTMLDivElement> = (event) => {
    event.currentTarget.classList.remove("cursor-pointer");
    event.currentTarget.children[0]
      .getElementsByTagName("span")[0]
      .classList.remove("blur-sm");
    event.currentTarget.children[1].classList.add("hidden");
  };

  return (
    <div className="w-screen h-full flex flex-col items-center justify-center overflow-x-hidden">
      <div className="text-4xl text-center p-4">Manga Recommender</div>

      {dataLoaded && (
        <>
          <div className="p-6" />
          <div className="grid grid-cols-4 gap-4 w-4/6">
            <div className="col-span-4 text-3xl text-center">{data.title}</div>
            <div className="row-span-6 flex items-center">
              <Image
                className="shadow-md shadow-white rounded-lg h-auto"
                width={360}
                height={0}
                src={data.main_picture.large}
                alt={data.title + " manga cover"}
              />
            </div>
            <div className="col-span-3 p-4 pl-11 text-lg">{`Japanese Title: ${data.alternative_titles.ja}`}</div>
            <div className="col-span-2 p-4 pl-11 text-lg capitalize">
              {`Authors: ${data.authors.map((author) => {
                return `${author.node.first_name} ${author.node.last_name} (${author.role})`;
              })}`}
            </div>
            <div className="p-4 pl-11 text-lg">{`Status: ${data.status}`}</div>
            <div className="col-span-2 p-4 pl-11 text-lg">
              {`Genres: ${
                props.genres
                  ? props.genres.map((genre) => {
                      return genre.name;
                    })
                  : "None"
              }`}
            </div>
            <div className="p-4 pl-11 text-lg">{`Demographic: ${props.demographic}`}</div>
            <div className="p-4 pl-11 text-lg">{`Serialization: ${(data.serialization.length) ? data.serialization.map((serialization) => {
                return `${serialization.node.name}`;
              }) : "None"}`}</div>
            <div className="p-4 pl-11 text-lg">{`Rank in MAL: ${data.rank}`}</div>
            <div className="p-4 pl-11 text-lg">{`Mean: ${data.mean}`}</div>
            <div
              onClick={showSynopsis}
              className="col-span-3 p-4 pl-11 text-lg cursor-pointer relative "
            >
              <div className="h-40 overflow-y-scroll">
                Synopsis:{" "}
                <span className="blur-sm transition">{data.synopsis}</span>
              </div>
              <img
                className="absolute top-1/2 left-1/2 w-10 invert"
                src="/blind.svg"
                alt="click_to_blur_out"
              />
            </div>
          </div>
        </>
      )}
      {!dataLoaded && (
        <>
          <img className="p-8" src="/ball-triangle.svg" />
          {/* <div className="text-3xl p-6">
            There was a prblem with the server. Please try again later!
          </div> */}
        </>
      )}
      <Link
        href={"/"}
        className="border rounded-xl bg-cyan-700 p-2 hover:bg-cyan-600 transition"
      >
        Home
      </Link>
    </div>
  );
}

export default InfoPage;
