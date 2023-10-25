import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { title } = req.query as { title: string };
    const filePath = join(__dirname.substring(0, __dirname.indexOf(".next")), "public", "manual.json");
    console.log(filePath)

    if (!existsSync(filePath)) {
      await writeFile(filePath, JSON.stringify([title]));
    } else {
      const data = JSON.parse(await readFile(filePath, "utf-8")) as string[];
      if (req.method === "DELETE") {
        if (data.includes(title)) {
          data.splice(data.indexOf(title), 1);
          await writeFile(filePath, JSON.stringify(data));
        }
      } else {
        if (!data.includes(title)) {
          data.push(title);
          await writeFile(filePath, JSON.stringify(data));
        }
      }
    }
    res.status(200).json({ ok: true, message: "ok" });
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}
