// Script to update the new field for every entrie that doesn't have his respective mal api id in the db
import { prisma } from "../src/backend/utils/prisma";

/* I use IMG url to know if the manga is the correct one because for some reason 
there are cases that two mangas have the same title or some other name appears before 
the exact one y queryed */
async function malApiQueryIdByName<T>(name: string, img_url: string): Promise<number> {
  return fetch(`https://api.myanimelist.net/v2/manga?q=${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-MAL-CLIENT-ID": `${process.env.MAL_CLIENT_ID}`,
    },
  }).then(async (response) => {
    const mangasFound = await response.json();
    if (response.ok) {
      for (const manga of mangasFound.data) {
        if (manga.node.main_picture.large === img_url) {
          return manga.node.id;
        }
      }
    }
    return 0;
  });
}

const updateMalIdField = async () => {
  const mangasToUpdate = await prisma.manga.findMany({
    where: { mal_api_id: 0 },
  });
  for (const manga of mangasToUpdate) {
    const mal_api_id = await malApiQueryIdByName(manga.title, manga.img_large);
    console.log(`Manga ${manga.title} has id ${manga.id} in bd and id ${mal_api_id} in API`);
    const malIdUpdate = await prisma.manga.update({where: {id: manga.id}, data: { mal_api_id: mal_api_id}})
    console.log(malIdUpdate);
  }
};

updateMalIdField();
