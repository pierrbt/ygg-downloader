import { NextApiRequest, NextApiResponse } from "next";
import { ygg } from "../../_document";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

//import nodefetch from 'node-fetch';

const fs = require("fs");

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


    const response = (await ygg.download(url)) as Response;
    const buffer = await response.arrayBuffer();
    console.log(buffer.byteLength);

    const filePath = `/media/Freebox/Torrents/${uuidv4()}.torrent`;
    console.log(filePath);
    await writeFile(filePath, Buffer.from(buffer));
    console.log("ok");

    res.status(200).json({ ok: true, message: "ok" });
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}
