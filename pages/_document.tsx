import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import YggTorrentApi from "../lib/yggtorrent";
import MovieDB from "node-themoviedb";
const getInitialProps = createGetInitialProps();

require("dotenv").config();

const mdb = new MovieDB("20ec7933568851941b674e9d1948c572", {
  language: "fr-FR",
});

if (!process.env.YGG_USER || !process.env.YGG_PASS) {
  console.error("Missing YGG_USER or YGG_PASS in .env");
  throw new Error("Missing YGG_USER or YGG_PASS in .env");
}
const ygg = new YggTorrentApi({
  host: process.env.YGG_HOST as string,
  searchHost: process.env.YGG_SEARCH as string,
  username: process.env.YGG_USER as string,
  password: process.env.YGG_PASS as string,
});

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export { ygg, mdb };
