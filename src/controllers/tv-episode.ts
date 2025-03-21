import { Request, Response } from "express";
import { axiosClient } from "../utils/axiosClient";
import * as cheerio from 'cheerio';

interface TvEpisodeTypes {
  id: string | null;
  title: string | null;
}

export const tvEpisode = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;

    const data: TvEpisodeTypes[] = [];

    const resp = await axiosClient.get(`/ajax/season/episodes/${seasonId}`);
    const $ = cheerio.load(resp.data);

    $(".nav-item a").each(function () {
      data.push({
        id: $(this).attr("data-id") || null,
        title: $(this).attr("title") || null,
      })
    })

    res.status(200).send(data)
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}