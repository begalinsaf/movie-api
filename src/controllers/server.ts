import { Request, Response } from "express";
import * as cheerio from 'cheerio';
import { axiosClient } from "../utils/axiosClient";

interface ServerTypes {
  id: string | undefined;
  serverName: string;
}

export const server = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params

    const data: ServerTypes[] = [];

    const response = await axiosClient.get(`/ajax/episode/${type === 'movie' ? 'list' : 'servers'}/${id}`);
    const $ = cheerio.load(response.data);

    $('.nav-item').each(function () {
      const id = $(this).find('a').attr(type === "movie" ? "data-linkid" : "data-id");
      const serverName = $(this).find("a span").text();
      data.push({ id, serverName })
    })

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}