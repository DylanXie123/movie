import { CastInfo } from "../renderer/store/fileNode";
import type { MovieInfo } from "../renderer/store/fileNode";
import IMDBAPI from "./IMDB";

/**
 * In API request, bad internet connection will throw an error.
 */
export default class TMDBAPI {
  static baseURL = "https://api.themoviedb.org/";

  /**
   * undefined if not found
   */
  static movies = async (movie_id: string): Promise<MovieInfo | undefined> => {
    const url = new URL(`3/movie/${movie_id}`, this.baseURL);
    url.searchParams.append('append_to_response', 'credits');
    const response = await authFetch(url);
    const json = await response.json();

    const parseCast = (casts: any) => {
      return casts.map((c: any) => {
        return new CastInfo({
          id: c.id,
          name: c.name,
          department: c.department,
          gender: c.gender,
          profile: c.profile_path,
          credit_id: c.credit_id,
        });
      });
    }
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
        runtime: json.runtime,
        genres: json.genres.map((g: any) => g.name),
        credits: parseCast(json.credits.cast),
      };
    } else {
      return undefined;
    }
  }

  /**
   * undefined if not found
   */
  static findMovie = async (external_id: string): Promise<MovieInfo | undefined> => {
    const url = new URL(`3/find/${external_id}`, this.baseURL);
    url.searchParams.append('external_source', 'imdb_id');
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.movie_results && json.movie_results.length) {
      const elm = json.movie_results[0];
      const tmdbID = elm.id;
      return await TMDBAPI.movies(tmdbID);
    } else {
      return undefined;
    }
  }

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static searchMovie = async (movieName: string): Promise<MovieInfo[]> => {
    const url = new URL('3/search/movie', this.baseURL);
    url.searchParams.append('query', movieName);
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.results) {
      if (json.results.length) {
        const ids = json.results.map((elm: any) => elm.id) as string[];
        const results = await Promise.all(ids.map(id => this.movies(id)));
        return results.filter(elm => elm !== undefined) as MovieInfo[];
      } else {
        return [];
      }
    } else {
      throw new Error(`TMDBAPI.searchMovie: ${json}`);
    }
  }

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static useIMDBSearch = async (movieName: string): Promise<MovieInfo[]> => {
    const results = await IMDBAPI.searchTitle(movieName);
    if (results.length) {
      const movies = await Promise.all(results.map(id => this.findMovie(id)));
      return movies.filter(movie => movie !== undefined) as MovieInfo[];
    } else {
      return [];
    }
  }
}

const authFetch = (url: URL) => {
  const api_key = window.api_key.TMDB;
  url.searchParams.append('api_key', api_key);
  return fetch(url.href);
}