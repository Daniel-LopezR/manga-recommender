export const getRandomMangaId: (
  maxMangaId: number,
  notThisOne?: number
) => number = (maxMangaId: number, notThisOne?: number) => {
  const mangaId = Math.floor(Math.random() * maxMangaId) + 1;

  if (mangaId !== notThisOne) return mangaId;

  return getRandomMangaId(maxMangaId, mangaId);
};
