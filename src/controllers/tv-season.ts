import { Request, Response } from "express";
import { axiosClient } from "../utils/axiosClient";
import * as cheerio from 'cheerio';

interface TvSeasonTypes {
  id: string | null;
  ssId: string | null;
  title: string;
}

export const tvSeason = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data: TvSeasonTypes[] = [];

    const resp = await axiosClient.get(`/ajax/season/list/${id}`);
    const $ = cheerio.load(resp.data);

    $(".dropdown-menu a").each(function () {
      data.push({
        id: $(this).attr("data-id") || null,
        ssId: $(this).attr("id") || null,
        title: $(this).text()
      })
    })

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}