"use server";

import { load } from "cheerio";
import { log } from "util";

interface YggProps {
  host: string;
  searchHost: string;
  username: string;
  password: string;
}

export interface Media {
  url: string;
  name: string;
  size: string;
  completed: number;
  seeders: number;
  downloadUrl: string;
}

const fetchHeaders = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
  },
};

class YggTorrentApi {
  private host: string;
  private searchHost: string;
  private username: string;
  private password: string;
  private cookie: string;

  constructor(config: YggProps) {
    this.host = config.host;
    this.searchHost = config.searchHost;
    this.username = config.username;
    this.password = config.password;
    this.cookie = "";
  }

  async login(): Promise<string> {
    try {
      const loginResponse = await fetch(`${this.host}/user/login`, {
        method: "POST",
        headers: {
          ...fetchHeaders.headers,
        },
        redirect: "follow",
        body: new URLSearchParams({
          id: this.username,
          pass: this.password,
        }),
        credentials: "include",
      });

      if (loginResponse.status >= 400) {
        throw new Error(`Error while logging in: ${loginResponse.statusText}`);
      }

      const body = await loginResponse.text();
      loginResponse.headers.forEach((value, name) => {
        if (name === "set-cookie") {
          this.cookie = value;
        }
      });
      console.log(body);
      return body;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Error while logging in: ${error.message}`);
    }
  }

  async download(url: string): Promise<Response | undefined> {
    try {
      await this.login();
      const response = await fetch(`${url}`, {
        method: "GET",
        ...fetchHeaders,
        redirect: "follow",
        credentials: "include",
        headers: {
          Cookie: this.cookie,
        },
      });

      return response;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  async search(name: string): Promise<Array<Media>> {
    try {
      console.log(
        `${this.searchHost}/engine/search?name=${encodeURIComponent(
          name,
        )}&description=&file=&uploader=&category=2145&sub_category=all&do=search&order=desc&sort=completed`,
      );
      const response = await fetch(
        `${this.searchHost}/engine/search?name=${encodeURIComponent(
          name,
        )}&description=&file=&uploader=&category=2145&sub_category=all&do=search&order=desc&sort=completed`,
        {
          method: "GET",
          ...fetchHeaders,
          redirect: "follow",
        },
      );

      if (!response.ok) {
        throw new Error(`Error while searching: ${response.statusText}`);
      }

      const body = await response.text();
      const $ = load(body);
      const results: Media[] = [];

      $(".table-responsive.results tbody tr").each((i, tr) => {
        const seeders = Number($($(tr).find("td")[7]).text().trim());

        if (!isNaN(seeders) && seeders > 0) {
          results.push({
            url: $(tr).find("#torrent_name").attr("href") || "",
            name: $(tr).find("#torrent_name").text().trim(),
            size: $($(tr).find("td")[5]).text(),
            completed: Number($($(tr).find("td")[6]).text().trim()),
            seeders: seeders,
            downloadUrl: `${this.searchHost}/engine/download_torrent?id=${$(tr)
              .find("#get_nfo")
              .attr("target")}`,
          });
        }
      });

      return results;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

export default YggTorrentApi;