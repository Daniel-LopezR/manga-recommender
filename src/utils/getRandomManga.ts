const MAX_MANGA_ID = 11384;

export const getRandomManga: (notThisOne?: number) => number = (
  notThisOne?: number
) => {
  const mangaId = Math.floor(Math.random() * MAX_MANGA_ID) + 1;

  if (mangaId !== notThisOne) return mangaId;

  return getRandomManga(mangaId);
};
