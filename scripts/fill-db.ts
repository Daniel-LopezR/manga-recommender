import { prisma } from "../src/backend/utils/prisma";

type MangaFound = {
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
  genres: [{ name: string }];
  nsfw: string;
  mean: number;
};

const genres = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Avant Garde" },
  { name: "Award Winning" },
  { name: "Boys Love" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Fantasy" },
  { name: "Girls Love" },
  { name: "Gourmet" },
  { name: "Horror" },
  { name: "Mystery" },
  { name: "Romance" },
  { name: "Sci-Fi" },
  { name: "Slice of Life" },
  { name: "Sports" },
  { name: "Supernatural" },
  { name: "Suspense" },
  { name: "N/A" },
];

const demographics = [
  { name: "Josei" },
  { name: "Kids" },
  { name: "Seinen" },
  { name: "Shoujo" },
  { name: "Shounen" },
  { name: "N/A" },
];

const MAX_APROXIMATE_ID = 160000;

require("dotenv").config();

async function malApiCall<T>(id: number): Promise<T> {
  return fetch(
    `https://api.myanimelist.net/v2/manga/${id}?fields=id,title,main_picture,alternative_titles,nsfw,genres,mean`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-MAL-CLIENT-ID": `${process.env.MAL_CLIENT_ID}`,
      },
    }
  ).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return "none";
    }
  });
}

const doBackFill = async () => {
  // Genres
  console.log("genres?", genres);
  const genresCreation = await prisma.genre.createMany({ data: genres });
  console.log("Genre_Creation?", genresCreation);

  //Demographics
  console.log("demographics?", demographics);
  const demographicsCreation = await prisma.demographic.createMany({
    data: demographics,
  });
  console.log("Demographic_Creation?", demographicsCreation);

  //Manga
  for (let id = 1; id <= MAX_APROXIMATE_ID; id++) {
    console.log("ID -> ?", id);
    const mangaFound = await malApiCall<MangaFound>(id);
    if (
      mangaFound.title !== "none" &&
      mangaFound.nsfw === "white" &&
      mangaFound.mean >= 7.0
    ) {
      console.log("Manga Found ?", mangaFound);
      let mangaGenres: { id: number }[] = [];
      let mangaDemographic: { id: number } = { id: 6 };
      if (mangaFound.genres) {
        for (const genre of mangaFound.genres) {
          if (
            genres.find((genreFromList) => genreFromList.name === genre.name)
          ) {
            let queryGenre = await prisma.genre.findUnique({
              where: { name: genre.name },
              select: { id: true },
            });
            if (queryGenre != null) mangaGenres.push(queryGenre);
          } else if (
            demographics.find(
              (demographicsFromList) => demographicsFromList.name === genre.name
            )
          ) {
            let queryResult = await prisma.demographic.findUnique({
              where: { name: genre.name },
              select: { id: true },
            });
            if (queryResult !== null) mangaDemographic = { id: queryResult.id };
          }
        }
      } else {
        mangaGenres.push({ id: 19 });
      }

      const mangaCreation = await prisma.manga.create({
        data: {
          title: mangaFound.title,
          title_ja: mangaFound.alternative_titles.ja,
          img_medium: mangaFound.main_picture.medium,
          img_large: mangaFound.main_picture.large,
          demographic: { connect: mangaDemographic },
        },
      });
      console.log("Manga_Creation?", mangaCreation);

      for (const genre of mangaGenres) {
        const mangaGenresCreation = await prisma.genresOnMangas.create({
          data: {
            manga: { connect: { id: mangaCreation.id } },
            genre: { connect: genre },
          },
        });
        console.log("Manga_Genres_Creation?", mangaGenresCreation);
      }
    } else {
      console.log(mangaFound, " is not valid");
    }
  }
};

doBackFill();
