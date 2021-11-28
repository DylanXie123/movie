import type { MovieInfo } from "../renderer/store/fileNode";
import IMDBAPI from "./IMDB";

/**
 * In API request, bad internet connection will throw an error.
 * if API returns undefined, it means requested resource did not exist.
 */
export default class TMDBAPI {
  static baseURL = "https://api.themoviedb.org/";

  static movies = async (movie_id: string): Promise<MovieInfo | undefined> => {
    const url = new URL(`3/movie/${movie_id}`, this.baseURL);
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.imdb_id) {
      /**
       * imdb_id is an optinal field
       * use it to determine if requested data exists
       */
      const imdbID = parseInt(json.imdb_id.slice(2));
      return {
        title: json.title,
        tmdbID: json.id,
        imdbID: imdbID,
        posterURL: json.poster_path,
        backgroundURL: json.backdrop_path,
        overview: json.overview,
        language: json.original_language,
        releaseDate: new Date(json.release_date),
        tmdbRating: json.vote_average,
      };
    } else {
      return undefined;
    }
  }

  static findMovie = async (external_id: string): Promise<MovieInfo | undefined> => {
    const url = new URL(`3/find/${external_id}`, this.baseURL);
    url.searchParams.append('external_source', 'imdb_id');
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.movie_results && json.movie_results.length) {
      const elm = json.movie_results[0];
      const imdbID = parseInt(external_id.slice(2));
      return {
        title: elm.title,
        tmdbID: elm.id,
        imdbID: imdbID,
        posterURL: elm.poster_path,
        backgroundURL: elm.backdrop_path,
        overview: elm.overview,
        language: elm.original_language,
        releaseDate: new Date(elm.release_date),
        tmdbRating: elm.vote_average,
      };
    } else {
      return undefined;
    }
  }

  static searchMovie = async (movieName: string): Promise<MovieInfo[] | undefined> => {
    const url = new URL('3/search/movie', this.baseURL);
    url.searchParams.append('query', movieName);
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.results && json.results.length) {
      const ids = json.results.map((elm: any) => elm.id) as string[];
      const results = await Promise.all(ids.map(id => this.movies(id)));
      return results.filter(elm => elm !== undefined) as MovieInfo[];
    } else {
      return undefined;
    }
  }

  static useIMDBSearch = async (movieName: string): Promise<MovieInfo[] | undefined> => {
    const results = await IMDBAPI.searchTitle(movieName);
    if (results && results.length) {
      const movies = await Promise.all(results.map(id => this.findMovie(id)));
      return movies.filter(movie => movie !== undefined) as MovieInfo[];
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