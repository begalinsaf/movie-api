import axios from "axios";
import { Request, Response } from "express";
import { LineTransform } from "../utils/line-transform";

export const m3u8Proxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json("url is required");

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: { Accept: "*/*", Referer: "https://megacloud.store/" }
    });

    const headers = { ...response.headers };
    if (url.endsWith('.m3u8')) delete headers['content-length'];
    res.set(headers);

    if (!url.endsWith('.m3u8')) {
      return response.data.pipe(res);
    }

    const transform = new LineTransform();
    return response.data.pipe(transform).pipe(res);
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
}