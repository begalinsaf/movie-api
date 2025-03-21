import { Request, Response } from "express";
import { axiosClient } from "../utils/axiosClient";
import * as cheerio from 'cheerio';

interface GenreListTypes {
  id: string | null;
  genre: string;
}

export const genreList = async (req: Request, res: Response) => {
  try {
    const data: GenreListTypes[] = [];

    const resp = await axiosClient.get('/home');
    const $ = cheerio.load(resp.data);

    $("#sidebar_subs_genre .nav-item").each(function () {
      data.push({
        id: $(this).find("a").attr("href")?.split('/').pop()?.trim() || null,
        genre: $(this).find('a').text().trim()
      })
    })

    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}