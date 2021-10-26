import type { MovieProp } from "../fileNode";

export default class TMDBAPI {
  static baseURL = "https://api.themoviedb.org/";

  static movies = async (movie_id: string): Promise<MovieProp> => {
    const url = new URL(`3/movie/${movie_id}`, this.baseURL);
    const response = await authFetch(url);
    const json = await response.json();
    return {
      title: json.title,
      tmdb_id: json.id,
      imdb_id: json.imdb_id,
      poster_url: json.poster_path,
      background_url: json.backdrop_path,
      overview: json.overview,
      language: json.original_language,
      release_date: json.release_date,
      tmdb_rating: json.vote_average,
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
        tmdb_id: elm.id,
        imdb_id: elm.imdb_id,
        poster_url: elm.poster_path,
        background_url: elm.backdrop_path,
        overview: elm.overview,
        language: elm.original_language,
        release_date: elm.release_date,
        tmdb_rating: elm.vote_average,
      };
    } catch (error) {
      return undefined;
    }
  }

  static searchMovie = async (movieName: string): Promise<MovieProp[]> => {
    const url = new URL('3/search/company', this.baseURL);
    url.searchParams.append('query', movieName);
    const response = await authFetch(url);
    const json = await response.json();
    const elms = json.results as [];
    return elms.map((elm: any) => ({
      title: elm.title,
      tmdb_id: elm.id,
      imdb_id: elm.imdb_id,
      poster_url: elm.poster_path,
      background_url: elm.backdrop_path,
      overview: elm.overview,
      language: elm.original_language,
      release_date: elm.release_date,
      tmdb_rating: elm.vote_average,
    }));
  }
}

const authFetch = (url: URL) => {
  const api_key = window.api_key.TMDB;
  url.searchParams.append('api_key', api_key);
  return fetch(url.href);
}