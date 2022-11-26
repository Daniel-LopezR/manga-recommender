import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/backend/utils/prisma";

type Manga = {
  id: number;
  title: string;
  title_ja: string;
  img_medium: string;
  img_large: string;
};

type MangaInfo = {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  alternative_titles: {
    synonyms: [string[]];
    en: string;
    ja: string;
  };
  synopsis: string;
  status: string;
  genres: [
    {
      name: string;
    }
  ];
  my_list_status: {
    status: string;
    is_rereading: boolean;
    num_volumes_read: number;
    num_chapters_read: number;
    score: number;
    updated_at: Date;
  };
  authors: [
    {
      author: {
        first_name: string;
        last_name: string;
      };
      role: string;
    }
  ];
};

const infoFields =
  "id,title,main_picture,alternative_titles,synopsis,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name}";
const standFields = "id,title,main_picture,alternative_titles";

async function api<T>(id: number): Promise<T> {
  return fetch(
    `https://api.myanimelist.net/v2/manga/${id}?fields=${standFields}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-MAL-CLIENT-ID": `${process.env.MAL_CLIENT_ID}`,
      },
    }
  ).then(async (response) => {
    console.log(id);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else if (data.error === "not_found") {
      console.log("Id not found");
      return await api<Manga>(id + 1);
    } else {
      throw new Error(response.statusText);
    }
  });
}

export const appRouter = router({
  "get-manga-by-id": publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const manga = await prisma.manga.findFirst({ where: { id: input.id } }); //api<Manga>(input.id)
      return {
        manga: manga,
      };
    }),
  "get-all-genres": publicProcedure.query(async () => {
    return await prisma.genre.findMany();
  }),
  "get-all-demographics": publicProcedure.query(async () => {
    return await prisma.demographic.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
