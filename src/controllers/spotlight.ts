import { Request, Response } from "express";
import * as cheerio from 'cheerio';
import { axiosClient } from "../utils/axiosClient";

interface SpotlightTypes {
  id: string | null;
  img: string | null;
  title: string;
  type: string | null;
  filmInfo: string[];
}

export const spotlight = async (req: Request, res: Response) => {
  try {
    const data: SpotlightTypes[] = [];

    const response = await axiosClient.get('/home');
    const $ = cheerio.load(response.data);

    $("#slide-big .flw-item").each(function () {
      const href = $(this).find('a').attr("href")?.split('/').filter((str: string) => str !== '');
      const type = href?.[0] || null;

      const filmInfo: string[] = [];
      $(this).find(".film-infor span").each(function () {
        filmInfo.push($(this).text().trim());
      })

      data.push({
        id: $(this).find('a').attr("href") || null,
        img: $(this).find("img").attr("src") || null,
        title: $(this).find(".film-name a").text().trim(),
        type,
        filmInfo
      })
    })

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}