import axios from "axios";
import { Request, Response } from "express";
import { MegaCloud } from "../extractor/megacloud";

export const sources = async (req: Request, res: Response) => {
  try {
    const serverId = req.params.serverId

    const resp = await axios.get(`https://movieshdwatch.to/ajax/episode/sources/${serverId}`);
    const link = resp.data.link

    const serverUrl = new URL(link);
    const data = await new MegaCloud().extract2(serverUrl);

    res.json(data);
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error.message);
  }
};