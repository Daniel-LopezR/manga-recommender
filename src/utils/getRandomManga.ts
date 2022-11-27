export const getRandomManga: (
  maxMangaId: number,
  notThisOne?: number
) => number = (maxMangaId: number, notThisOne?: number) => {
  const mangaId = Math.floor(Math.random() * maxMangaId) + 1;

  if (mangaId !== notThisOne) return mangaId;

  return getRandomManga(maxMangaId, mangaId);
};
