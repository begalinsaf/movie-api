import { Request, Response } from "express";
import { axiosClient } from "../utils/axiosClient";
import * as cheerio from 'cheerio';

interface CastTypes {
  currentPage: number;
  totalPages: number;
  data: {
    id: string | null;
    img: string | null;
    title: string;
    type: string | null;
    filmInfo: string[];
  }[]
}


export const cast = async (req: Request, res: Response) => {
  try {
    const { castId } = req.params;
    const page = req.query.page || 1

    const data: CastTypes = {
      currentPage: parseInt(String(page)),
      totalPages: 1,
      data: []
    }

    const resp = await axiosClient.get(`/cast/${castId}?page=${page}`);
    const $ = cheerio.load(resp.data);

    data.totalPages = parseInt(String($(".pre-pagination .page-item a[title='Last']").attr('href')?.split('=').pop() || $('.pre-pagination .pagination .page-item').last().find('a').text()));

    $(".block_area-content .flw-item").each(function () {
      const href = $(this).find('a').attr("href")?.split('/').filter((str: string) => str !== '');
      const type = href?.[0] || null;

      const filmInfo: string[] = [];
      $(this).find(".film-infor span").each(function () {
        filmInfo.push($(this).text().trim());
      })

      data.data.push({
        id: $(this).find('a').attr("href") || null,
        img: $(this).find("img").attr("data-src") || null,
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