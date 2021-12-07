import { parse, ParsedPath } from 'path';

interface FileNodeProp {
  fullPath: string;
  blocks: number;
  blksize: number;
  size: number;
  movie?: MovieInfo;
}

export interface MovieInfo {
  title: string;
  tmdbID: number;
  imdbID?: number;
  posterURL?: string;
  backgroundURL?: string;
  overview?: string;
  language: string;
  releaseDate: Date;
  tmdbRating: number;
  imdbRating?: number;
  runtime?: number;
  genres: string[];
  credits: CastInfo[];
}

export interface CastInfo {
  id: number;
  name: string;
  department: string;
  gender?: number;
  profile?: string;
  credit_id: string;
}

export default class FileNode {
  constructor(props: FileNodeProp) {
    this.fullPath = props.fullPath;
    this.parsed = parse(this.fullPath);
    this.blocks = props.blocks;
    this.blksize = props.blksize;
    this.size = props.size;
    this.movie = props.movie;
  }

  fullPath: string;
  parsed: ParsedPath;
  blocks: number;
  blksize: number;
  size: number;
  movie?: MovieInfo;


  get onDisk() {
    return !(this.blocks === 0);
  }

  get diskSize() {
    return this.blocks * this.blksize;
  }

  /**
   * "w92",
   * "w154",
   * "w185",
   * "w342",
   * "w500",
   * "w780",
   * "original"
   */
  get posterURL() {
    if (this.movie && this.movie.posterURL) {
      return "https://image.tmdb.org/t/p/original" + this.movie.posterURL;
    } else {
      return undefined
    }
  }

  /**
   * "w300",
   * "w780",
   * "w1280",
   * "original"
   */
  get backgroundURL() {
    if (this.movie && this.movie.backgroundURL) {
      return "https://image.tmdb.org/t/p/original" + this.movie.backgroundURL;
    } else {
      return undefined;
    }
  }

  /**
   * "w45",
   * "w185",
   * "h632",
   * "original"
   */
  get castProfileURLs() {
    if (this.movie && this.movie.credits.some(c => c.profile)) {
      return this.movie.credits.map(c =>
        c.profile ? "https://image.tmdb.org/t/p/original" + c.profile : undefined
      );
    } else {
      return undefined;
    }
  }
}