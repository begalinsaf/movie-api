import { Request, Response } from "express";
import { axiosClient } from "../utils/axiosClient";
import * as cheerio from 'cheerio';

interface LatestMovieTypes {
  id: string | null;
  img: string | null;
  title: string;
  type: string | null;
  filmInfo: string[];
}

export const latestMovie = async (req: Request, res: Response) => {
  try {
    const data: LatestMovieTypes[] = []

    const resp = await axiosClient.get('/home');
    const $ = cheerio.load(resp.data);

    $('.section-id-02 .flw-item').each(function () {
      const href = $(this).find('a').attr("href")?.split('/').filter((str: string) => str !== '');
      const type = href?.[0] || null;

      const filmInfo: string[] = [];
      $(this).find(".film-infor span").each(function () {
        filmInfo.push($(this).text().trim());
      })

      data.push({
        id: $(this).find('a').attr("href") || null,
        img: $(this).find("img").attr("data-src") || null,
        title: $(this).find(".film-name a").text().trim(),
        type,
        filmInfo
      })
    });

    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}