export default class IMDBAPI {
  static baseURL = "https://imdb-api.com";
  static apiKey = window.api_key.IMDB;
  static searchTitle = async (name: string) => {
    const url = new URL(`API/Search/${this.apiKey}/${name}`, this.baseURL);
    const response = await fetch(url.href);
    return response.json();
  }
}
