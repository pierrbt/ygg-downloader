import { NextApiRequest, NextApiResponse } from "next";
import { ygg } from "../../_document";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");

export interface SearchResponse {
  ok: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>,
) {
  try {
    const { url } = req.query as { url: string };
    console.log(url);

    const { body } = (await ygg.download(url)) as any;

    const filePath = `/media/Freebox/Torrents/${uuidv4()}.torrent`;

    const stream = fs.createWriteStream(filePath);
    await finished(Readable.fromWeb(body).pipe(stream));

    res.status(200).json({ ok: true, message: "ok" });
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}
