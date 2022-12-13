import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/backend/utils/prisma";
import { getRandomMangaId } from "@/utils/getRandomMangaId";

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
  ],
  rank: number,
  mean: number,
  serialization: [
    {
      node: {
        name: string
      }
    }
  ];
};

const infoFields =
  "title,alternative_titles,synopsis,mean,rank,status,authors{first_name,last_name},serialization{name}";

async function malMangaApiCall<T>(id: number, fields: string): Promise<T> {
  return fetch(`https://api.myanimelist.net/v2/manga/${id}?fields=${fields}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-MAL-CLIENT-ID": `${process.env.MAL_CLIENT_ID}`,
    },
  }).then(async (response) => {
    console.log(id);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(response.statusText);
    }
  });
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
    .input(z.object({ mal_api_id: z.number(),}))
    .query(async ({input}) => {
      return await malMangaApiCall<MangaInfo>(input.mal_api_id, infoFields);
  })
});
// export type definition of API
export type MangaRouter = typeof mangaRouter;