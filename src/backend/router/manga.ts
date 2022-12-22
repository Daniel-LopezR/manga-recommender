import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/backend/utils/prisma";
import { getRandomMangaId } from "@/utils/getRandomMangaId";
import axios from "axios";

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
  authors: [
    {
      node: {
        first_name: string;
        last_name: string;
      };
      role: string;
    }
  ];
  rank: number;
  mean: number;
  serialization: [
    {
      node: {
        name: string;
      };
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
};

const infoFields =
  "title,alternative_titles,synopsis,mean,rank,status,authors{first_name,last_name},serialization{name},my_list_status";

export async function malMangaApiCall<T>(
  method: string,
  url: string,
  access_token?: string,
  body?: any
): Promise<T> {
  if (method === "GET") {
    return axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "X-MAL-CLIENT-ID": `${process.env.MAL_CLIENT_ID}`,
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  } else if (method === "PATCH"){
    const status = new URLSearchParams({ status: body.status });
    return axios
      .patch(url, status, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  } else{
    return axios
      .delete(url,{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
}

export const mangaRouter = router({
  "get-manga-by-id": publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const manga = await prisma.manga.findFirst({ where: { id: input.id } });
      return {
        manga: manga,
      };
    }),
  "get-manga-by-options": publicProcedure
    .input(
      z.object({
        genres: z
          .object({
            optionsIncluded: z.array(z.number()).optional(),
            optionsExcluded: z.array(z.number()).optional(),
          })
          .optional(),
        demographics: z
          .object({
            optionsIncluded: z.array(z.number()).optional(),
            optionsExcluded: z.array(z.number()).optional(),
          })
          .optional(),
        lastMangaId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const noneGenres = input.genres?.optionsExcluded
        ? {
            genreId: {
              in: input.genres?.optionsExcluded,
            },
          }
        : undefined;

      const mangas = await prisma.manga.findMany({
        where: {
          AND: [
            {
              demographicId: {
                in: input.demographics?.optionsIncluded,
                notIn: input.demographics?.optionsExcluded,
              },
            },
            {
              genres: {
                some: {
                  genreId: {
                    in: input.genres?.optionsIncluded,
                  },
                },
                none: noneGenres,
              },
            },
          ],
        },
      });
      return {
        manga: mangas.length
          ? mangas[getRandomMangaId(mangas.length, input.lastMangaId) - 1]
          : null,
      };
    }),
  "get-all-genres": publicProcedure.query(async () => {
    return await prisma.genre.findMany({ orderBy: { id: "asc" } });
  }),
  "get-all-demographics": publicProcedure.query(async () => {
    return await prisma.demographic.findMany({ orderBy: { id: "asc" } });
  }),
  "get-manga-info": publicProcedure
    .input(
      z.object({ mal_api_id: z.number(), access_token: z.string().optional(), userStatus: z.string().optional() })
    )
    .query(async ({ input }) => {
      return await malMangaApiCall<MangaInfo>(
        "GET",
        `https://api.myanimelist.net/v2/manga/${input.mal_api_id}?fields=${infoFields}`,
        input.access_token
      );
    }),
});
// export type definition of API
export type MangaRouter = typeof mangaRouter;
