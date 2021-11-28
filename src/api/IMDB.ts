export default class IMDBAPI {
  static baseURL = "https://imdb-api.com";
  static apiKey = window.api_key.IMDB;
  static searchTitle = async (name: string): Promise<string[] | undefined> => {
    const url = new URL(`API/Search/${this.apiKey}/${name}`, this.baseURL);
    const response = await fetch(url.href);
    const json = await response.json();
    if (json && json.results && json.results.length) {
      return json.results.map((result: any) => result.id);
    } else {
      return undefined;
    }
  }
}
