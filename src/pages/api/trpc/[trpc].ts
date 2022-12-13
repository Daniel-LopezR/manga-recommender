import * as trpcNext from "@trpc/server/adapters/next";
import { MangaRouter, mangaRouter } from "@/backend/router/manga";
import { inferProcedureOutput } from "@trpc/server";
// export API handler
export default trpcNext.createNextApiHandler({
  router: mangaRouter,
  createContext: () => ({}),
});

export type inferQueryResponse<
  TRouteKey extends keyof MangaRouter["_def"]["procedures"]
> = inferProcedureOutput<MangaRouter["_def"]["procedures"][TRouteKey]>;
