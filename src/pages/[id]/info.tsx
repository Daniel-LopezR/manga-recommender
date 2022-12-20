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
      })
    : trpc["get-manga-info"].useQuery({
        mal_api_id: props.id,
      });
  const statuses = [
    {
      id: "reading",
      name: "Reading",
      color: "green",
    },
    {
      id: "completed",
      name: "Completed",
      color: "blue",
    },
    {
      id: "on_hold",
      name: "On hold",
      color: "amber",
    },
    {
      id: "dropped",
      name: "Dropped",
      color: "red",
    },
    {
      id: "plan_to_read",
      name: "Plan to read",
      color: "gray",
    },
  ];
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
      <div className="h-full w-screen flex flex-col items-center justify-center overflow-x-hidden">
        {dataLoaded && (
          <>
            {console.log(data)}
            <div className="p-4" />
            <div className="grid grid-cols-4 gap-4 w-4/6">
              <div className="col-span-4 text-3xl text-center">
                {data.title}
              </div>
              <div className="row-span-5 flex items-center">
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
                {`Authors: ${data.authors.map(
                  (author: {
                    node: { first_name: string; last_name: string };
                    role: string;
                  }) => {
                    return `${author.node.first_name} ${author.node.last_name} (${author.role})`;
                  }
                )}`}
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
              <div className="p-4 pl-11 text-lg">{`Serialization: ${
                data.serialization.length
                  ? data.serialization.map(
                      (serialization: { node: { name: string } }) => {
                        return `${serialization.node.name}`;
                      }
                    )
                  : "None"
              }`}</div>
              <div className="p-4 pl-11 text-lg">{`Rank in MAL: ${data.rank}`}</div>
              <div className="p-4 pl-11 text-lg">{`Mean: ${data.mean}`}</div>
              <div
                onClick={showSynopsis}
                className="col-span-3 p-4 pl-11 text-lg cursor-pointer relative "
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
                  <div className="flex justify-center items-center">
                    <StatusButton
                      status={{ id: "delete", name: "Delete from your list", color: "rose" }}
                      statusSelected={data.my_list_status?.status}
                      mangaId={props.id}
                      updateStatus={updateStatus}
                      deleteButton={true}
                    />
                  </div>
                  <div className="col-span-4 text-xl text-center">
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
                  <div className="col-span-4 flex flex-row justify-evenly">
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
        )}
        {!dataLoaded && <img className="p-8" src="/ball-triangle.svg" />}
        <div className="flex flex-col items-center justify-center h-full">
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
