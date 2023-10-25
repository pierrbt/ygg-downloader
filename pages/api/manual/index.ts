import {NextApiRequest, NextApiResponse} from "next";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const filePath = join(__dirname.substring(0, __dirname.indexOf(".next")), "public", "manual.json");
    console.log(filePath)
    if (!existsSync(filePath)) {
      res.status(200).json({ ok: true, message: "ok", results: [] });
    } else {
      const data = JSON.parse(await readFile(filePath, "utf-8")) as string[];
      res.status(200).json({ ok: true, message: "ok", results: data });
    }
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}
