import { Request, Response } from "express";
import { axiosClient } from "../utils/axiosClient";
import * as cheerio from 'cheerio';

interface InfoTypes {
  id: string | null;
  img: string | null;
  cover: string | null;
  title: string | null;
  otherTitles: string[];
  description: string | null;
  quality: string | null;
  IMDBRate: string | null;
  trailer: string | null;
  otherInfo: {
    released: string | null;
    duration: string | null;
    genres: {
      id: string | null,
      genre: string | null,
    }[];
    countries: {
      id: string | null,
      country: string | null,
    }[];
    casts: {
      id: string | null;
      cast: string | null;
    }[];
    productions: {
      id: string | null;
      production: string | null;
    }[];
  },
  youMayAlsoLike: {
    id: string | null;
    img: string | null;
    title: string;
    type: string | null;
    filmInfo: string[];
  }[]
}

export const info = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const showId = id.split('-').pop();

    const data: InfoTypes = {
      id: id || null,
      img: null,
      cover: null,
      title: null,
      otherTitles: [],
      description: null,
      quality: null,
      IMDBRate: null,
      trailer: null,
      otherInfo: {
        released: null,
        duration: null,
        genres: [],
        countries: [],
        casts: [],
        productions: []
      },
      youMayAlsoLike: [],
    }

    const resp = await axiosClient.get(`/${type}/${id}`);
    const $ = cheerio.load(resp.data);

    const scrape = $(`#main-wrapper .container [data-id=${showId}]`);

    data.img = scrape.find(".dp-i-c-poster img").attr("src") || null;
    data.cover = scrape.find(".dp-w-cover").attr("style")?.split('url(').pop()?.split(')').shift() || null;
    data.title = scrape.find(".heading-name a").text().trim() || null;
    $('.detail-tags h2').each(function () {
      data.otherTitles.push($(this).text().trim())
    });
    data.description = scrape.find(".description").text().trim() || null;
    data.quality = scrape.find(".dp-i-stats .btn-quality").text().trim();
    data.IMDBRate = scrape.find(".dp-i-stats .btn-warning").text().trim().split(' ').pop() || null;
    data.trailer = $("#iframe-trailer").attr("data-src") || null;
    data.otherInfo.released = scrape.find(".elements .col-xl-7 div:nth-child(1)").text().trim().split(" ").pop() || null;
    const duration = scrape.find(".elements .col-xl-5 div:nth-child(1)")
    duration.find('span').remove() || null;
    data.otherInfo.duration = duration.text().trim().replace(/\s+/g, " ");
    scrape.find('.elements .col-xl-7 div:nth-child(2) a').each(function () {
      data.otherInfo.genres.push({
        id: $(this).attr("href")?.split("/").pop() || null,
        genre: $(this).text().trim() || null
      })
    })
    scrape.find(".elements .col-xl-5 div:nth-child(2) a").each(function () {
      data.otherInfo.countries.push({
        id: $(this).attr("href")?.split("/").pop() || null,
        country: $(this).text() || null
      })
    })
    scrape.find('.elements .col-xl-7 div:nth-child(3) a').each(function () {
      data.otherInfo.casts.push({
        id: $(this).attr("href")?.split("/").pop() || null,
        cast: $(this).text().trim() || null
      })
    })
    scrape.find(".elements .col-xl-5 div:nth-child(3) a").each(function () {
      data.otherInfo.productions.push({
        id: $(this).attr("href")?.split("/").pop() || null,
        production: $(this).text() || null
      })
    })

    $("#main-wrapper .block_area-content .film_list-wrap .flw-item").each(function () {
      const href = $(this).find('a').attr("href")?.split('/').filter((str: string) => str !== '');
      const type = href?.[0] || null;

      const filmInfo: string[] = [];
      $(this).find(".film-infor span").each(function () {
        filmInfo.push($(this).text().trim());
      })

      data.youMayAlsoLike.push({
        id: $(this).find('a').attr("href") || null,
        img: $(this).find("img").attr("data-src") || null,
        title: $(this).find(".film-name a").text().trim(),
        type,
        filmInfo
      })
    })

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}