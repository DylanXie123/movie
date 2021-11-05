import type { MovieProp } from "../fileNode";
import IMDBAPI from "./IMDB";

export default class TMDBAPI {
  static baseURL = "https://api.themoviedb.org/";

  static movies = async (movie_id: string): Promise<MovieProp> => {
    const url = new URL(`3/movie/${movie_id}`, this.baseURL);
    const response = await authFetch(url);
    const json = await response.json();
    return {
      title: json.title,
      tmdbID: json.id,
      imdbID: parseInt(json.imdb_id.slice(2)),
      posterURL: json.poster_path,
      backgroundURL: json.backdrop_path,
      overview: json.overview,
      language: json.original_language,
      releaseDate: json.release_date ? new Date(json.release_date) : undefined,
      tmdbRating: json.vote_average,
    };
  }

  static findMovie = async (external_id: string): Promise<MovieProp | undefined> => {
    const url = new URL(`3/find/${external_id}`, this.baseURL);
    url.searchParams.append('external_source', 'imdb_id');
    const response = await authFetch(url);
    const json = await response.json();
    try {
      const elm = json.movie_results[0];
      return {
        title: elm.title,
        tmdbID: elm.id,
        imdbID: parseInt(external_id.slice(2)),
        posterURL: elm.poster_path,
        backgroundURL: elm.backdrop_path,
        overview: elm.overview,
        language: elm.original_language,
        releaseDate: elm.release_date ? new Date(elm.release_date) : undefined,
        tmdbRating: elm.vote_average,
      };
    } catch (error) {
      return undefined;
    }
  }

  static searchMovie = async (movieName: string): Promise<MovieProp[]> => {
    const url = new URL('3/search/movie', this.baseURL);
    url.searchParams.append('query', movieName);
    const response = await authFetch(url);
    const json = await response.json();
    const elms = json.results as [];
    const ids = elms.map((elm: any) => elm.id as string);
    return await Promise.all(ids.map(id => this.movies(id)));
  }

  static useIMDBSearch = async (movieName: string): Promise<MovieProp | undefined> => {
    const results = await IMDBAPI.searchTitle(movieName);
    if (results) {
      return await this.findMovie(results[0]);
    } else {
      return undefined;
    }
  }
}

const authFetch = (url: URL) => {
  const api_key = window.api_key.TMDB;
  url.searchParams.append('api_key', api_key);
  return fetch(url.href);
}