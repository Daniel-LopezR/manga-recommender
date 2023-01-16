import StatusButton from "@/components/StatusButton";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { trpc } from "@/utils/trpc";
import { prisma } from "@/backend/utils/prisma";
import { useSession } from "next-auth/react";
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


const statuses = [
  {
    id: "reading",
    name: "Reading",
    color: {
      border: "border-green-500",
      bg: "bg-green-500",
      hoverBg: "hover:bg-green-500",
    },
  },
  {
    id: "completed",
    name: "Completed",
    color: {
      border: "border-blue-500",
      bg: "bg-blue-500",
      hoverBg: "hover:bg-blue-500",
    },
  },
  {
    id: "on_hold",
    name: "On hold",
    color: {
      border: "border-amber-500",
      bg: "bg-amber-500",
      hoverBg: "hover:bg-amber-500",
    },
  },
  {
    id: "dropped",
    name: "Dropped",
    color: {
      border: "border-red-500",
      bg: "bg-red-500",
      hoverBg: "hover:bg-red-500",
    },
  },
  {
    id: "plan_to_read",
    name: "Plan to read",
    color: {
      border: "border-gray-500",
      bg: "bg-gray-500",
      hoverBg: "hover:bg-gray-500",
    },
  },
];

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
  const [userStatus, setUserStatus] = useState("");
  const { data: session } = useSession();
  const { data, isLoading } = session?.user?.token
    ? trpc["get-manga-info"].useQuery({
        mal_api_id: props.id,
        access_token: session.user.token,
        userStatus: userStatus,
      })
    : trpc["get-manga-info"].useQuery({
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

  const updateStatus = (statusClicked: string) => {
    if (
      (userStatus === "" && data?.my_list_status?.status !== statusClicked) ||
      userStatus !== statusClicked
    ) {
      setUserStatus(statusClicked);
    }
  };

  return (
    <>
      <Head>
        <title>Info - Manga Recommender</title>
        <meta
          property="og:title"
          content="Info - Manga Recommender"
          key="title"
        />
      </Head>
      <div className="h-full flex flex-col items-center justify-center overflow-x-hidden">
        {dataLoaded ? (
          <>
            <div className="p-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-4/6">
              <div className="md:col-span-4 text-3xl text-center pb-4">
                {data.title}
              </div>
              <div className="md:col-span-2 md:row-span-5 xl:col-span-1 xl:row-span-5 flex flex-col items-center justify-center gap-5 cursor-pointer">
                <Link
                  className="h-auto"
                  href={`https://myanimelist.net/manga/${data.id}`}
                  target={"_blank"}
                >
                  <Image
                    className="shadow-md shadow-white rounded-lg"
                    width={360}
                    height={0}
                    src={data.main_picture.large}
                    alt={data.title + " manga cover"}
                  />
                </Link>

                {session && (
                  <div className="flex justify-center items-center">
                    <StatusButton
                      status={{
                        id: data.my_list_status ? "delete" : "notOnList",
                        name: data.my_list_status
                          ? "Delete from your list"
                          : "Not on your list",
                        color: {
                          border: "border-rose-500",
                          bg: "",
                          hoverBg: data.my_list_status
                            ? "hover:bg-rose-500"
                            : "bg-rose-500 disabled cursor-default",
                        },
                      }}
                      statusSelected={data.my_list_status?.status}
                      mangaId={props.id}
                      updateStatus={updateStatus}
                      deleteButton={true}
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 xl:col-span-3 p-4 md:pl-11 text-lg">{`Japanese Title: ${data.alternative_titles.ja}`}</div>
              <div className="md:col-span-2 p-4 md:pl-11 text-lg capitalize">
                {`Authors: ${data.authors.map(
                  (author: {
                    node: { first_name: string; last_name: string };
                    role: string;
                  }) => {
                    return `${author.node.first_name} ${author.node.last_name} (${author.role})`;
                  }
                )}`}
              </div>
              <div className="p-4 md:pl-11 text-lg capitalize">{`Status: ${data.status.replace(
                "_",
                " "
              )}`}</div>
              <div className="xl:col-span-2 p-4 md:pl-11 text-lg">
                {`Genres: ${
                  props.genres
                    ? props.genres.map((genre) => {
                        return genre.name;
                      })
                    : "None"
                }`}
              </div>
              <div className="p-4 md:pl-11 text-lg">{`Demographic: ${props.demographic}`}</div>
              <div className="p-4 md:pl-11 text-lg">{`Serialization: ${
                data.serialization.length
                  ? data.serialization.map(
                      (serialization: { node: { name: string } }) => {
                        return `${serialization.node.name}`;
                      }
                    )
                  : "None"
              }`}</div>
              <div className="p-4 md:pl-11 text-lg">{`Rank in MAL: ${data.rank}`}</div>
              <div className="p-4 md:pl-11 text-lg">{`Mean: ${data.mean}`}</div>
              <div
                onClick={showSynopsis}
                className="md:col-span-4 xl:col-span-3 p-4 md:pl-11 text-lg cursor-pointer relative "
              >
                <div>
                  Synopsis:{" "}
                  <span className="blur-sm transition">{data.synopsis}</span>
                </div>
                <img
                  className="absolute top-1/2 left-1/2 w-10 invert"
                  src="/blind.svg"
                  alt="click_to_blur_out"
                />
              </div>
              {session && (
                <>
                  <div className="md:col-span-4 text-xl text-center flex items-center justify-center gap-2">
                    <img
                      className="invert h-4 inline-block "
                      src="/arrowDown.svg"
                    />
                    {data.my_list_status
                      ? ` ${data.title} is currently on your list, you can change the status below `
                      : ` ${data.title} is not on your list, select any status to add it in your list `}
                    <img
                      className="invert h-4 inline-block "
                      src="/arrowDown.svg"
                    />
                  </div>
                  <div className="md:col-span-4 flex flex-row flex-wrap items-center justify-evenly gap-3">
                    {statuses.map((status) => {
                      return (
                        <StatusButton
                          status={status}
                          statusSelected={data.my_list_status?.status}
                          mangaId={props.id}
                          updateStatus={updateStatus}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="h-5/6 flex items-center justify-center">
            <img className="p-8" src="/ball-triangle.svg" />
          </div>
        )}
        <div className="flex flex-col items-center justify-center p-4">
          <Link
            href={"/"}
            className=" border rounded-xl bg-cyan-700 p-2 hover:bg-cyan-600 transition"
          >
            Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default InfoPage;
