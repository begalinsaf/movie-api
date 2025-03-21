import { getSources } from "./megacloud.getsrcs";

export type track = {
  file: string;
  label?: string;
  kind: string;
  default?: boolean;
};

export type unencryptedSrc = {
  file: string;
  type: string;
};

export type extractedSrc = {
  sources: string | unencryptedSrc[];
  tracks: track[];
  t: number;
  server: number;
};

type ExtractedData = Pick<extractedSrc, "tracks" | "t" | "server"> & {
  sources: { file: string; type: string }[];
};

export class MegaCloud {
  // https://megacloud.tv/embed-2/e-1/1hnXq7VzX0Ex?k=1
  async extract2(embedIframeURL: URL): Promise<ExtractedData> {
    try {
      const extractedData: ExtractedData = {
        sources: [],
        tracks: [],
        t: 0,
        server: 0,
      };

      const xrax = embedIframeURL.pathname.split("/").pop() || "";

      const resp = await getSources(xrax);
      if (!resp) return extractedData;

      if (Array.isArray(resp.sources)) {
        extractedData.sources = resp.sources.map((s) => ({
          file: s.file,
          type: s.type,
        }));
      }
      extractedData.tracks = resp.tracks;
      extractedData.t = resp.t;
      extractedData.server = resp.server;


      return extractedData
    } catch (err: any) {
      console.log("Error " + err.message);
      throw new Error(err.message);
    }
  }
}