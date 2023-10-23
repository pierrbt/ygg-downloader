import { NextApiRequest, NextApiResponse } from "next";
import { Media } from "../../../lib/yggtorrent";
import { ygg, mdb } from "../../_document";

export interface SearchResponse {
  ok: boolean;
  message: string;
  results?: Media[];
  details?: {
    title: string;
    stars: number;
    image: string;
    description: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>,
) {
  try {
    const { name } = req.query as { name: string };
    const movie: SearchResponse["details"] = {
      title: name,
      stars: 0,
      image:
        "https://png.pngtree.com/png-vector/20190816/ourlarge/pngtree-film-logo-design-template-vector-isolated-illustration-png-image_1693431.jpg",
      description: "Description introuvable",
    };
    const index =
      name.toLowerCase().indexOf("s0") > -1
        ? name.toLowerCase().indexOf("s0")
        : name.length;
    const TMDBName = name.slice(0, index);

    const [moviesResults, yggResults] = await Promise.all([
      mdb.search.multi({ query: { query: TMDBName } }),
      ygg.search(name),
    ]);

    const movies = moviesResults.data.results as any[];

    for (let i = 0; i < movies.length; i++) {
      console.log(i, movies[i]);
    }

    if (movies.length > 0) {
      movie.title = movies[0].name || name;
      movie.stars = movies[0].vote_average.toFixed(0);
      movie.image = `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`;
      movie.description = movies[0].overview;
    }

    res
      .status(200)
      .json({ ok: true, message: "ok", results: yggResults, details: movie });
  } catch (e: any) {
    res.status(500).json({ ok: false, message: e.message });
  }
}
