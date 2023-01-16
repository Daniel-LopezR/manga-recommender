import { malMangaApiCall } from "@/backend/router/manga";
import type { NextApiRequest, NextApiResponse } from "next";

type ListStatus = {
  status: string;
  is_rereading: boolean;
  num_volumes_read: number;
  num_chapters_read: number;
  score: number;
  updated_at: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH" && req.body.method === undefined) {
    const updateStatusAPI = await malMangaApiCall<ListStatus>(
      req.method,
      `https://api.myanimelist.net/v2/manga/${req.body.id}/my_list_status`,
      req.body.access_token,
      { status: req.body.status }
    );
    console.log(updateStatusAPI);
    res.status(200).json({ status: updateStatusAPI.status });
  } else if (req.body.method === "DELETE") {
    await malMangaApiCall<ListStatus>(
      req.body.method,
      `https://api.myanimelist.net/v2/manga/${req.body.id}/my_list_status`,
      req.body.access_token,
    );
    res.status(200).json({message: "Manga deleted from list succesfully"});
  } else {
    res.status(405);
  }
}
