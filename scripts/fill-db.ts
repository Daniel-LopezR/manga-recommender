import { prisma } from "../src/backend/utils/prisma";

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
];

const demographics = [
    { name: "Josei" },
    { name: "Kids" },
    { name: "Seinen" },
    { name: "Shoujo" },
    { name: "Shounen" }
  ];

function malApiCall<T>(id: number): Promise<T> {
  return fetch(
    `https://api.myanimelist.net/v2/manga/${id}?fields=id,title,main_picture,alternative_titles`,
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
    console.log("genres?", genres)
    const genresCreation = await prisma.genre.createMany({data: genres});
    console.log("Genre_Creation?", genresCreation)

    //Demographics
    console.log("demographics?", demographics)
    const demographicsCreation = await prisma.demographic.createMany({data: demographics});
    console.log("Demographic_Creation?", demographicsCreation)

    //Manga

};

doBackFill();
