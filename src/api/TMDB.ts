export default class TMDBAPI {
  static baseURL = "https://api.themoviedb.org/";
  static movies = async (movie_id: string) => {
    const url = new URL(`3/movie/${movie_id}`, this.baseURL);
    const response = await authFetch(url);
    return response.json();
  }
  static searchCompany = async (companyName: string) => {
    const url = new URL('3/search/company', this.baseURL);
    url.searchParams.append('query', companyName);
    const response = await authFetch(url);
    return response.json();
  }
  static searchMovie = async (movieName: string) => {
    const url = new URL('3/search/company', this.baseURL);
    url.searchParams.append('query', movieName);
    const response = await authFetch(url);
    return response.json();
  }
}

const authFetch = (url: URL) => {
  const api_key = window.api_key.TMDB;
  url.searchParams.append('api_key', api_key);
  return fetch(url.href);
}