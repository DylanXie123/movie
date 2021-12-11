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

export class CastInfo {

  constructor(prop: {
    id: number;
    name: string;
    department: string;
    gender?: number;
    profile?: string;
    credit_id: string;
  }) {
    this.id = prop.id;
    this.name = prop.name;
    this.department = prop.department;
    this.gender = prop.gender;
    this.profile = prop.profile;
    this.credit_id = prop.credit_id;
  }

  id: number;
  name: string;
  department: string;
  gender?: number;
  profile?: string;
  credit_id: string;

  /**
   * image's intrinsic width in pixels:
   * "w45",
   * "w185",
   * "h632",
   * "original"
   */
  profileURL = (resolution: "w45" | "w185" | "h632" | "original" = "w185") => {
    return this.profile ? `https://image.tmdb.org/t/p/${resolution}${this.profile}` : undefined;
  }

}

export default class FileNode {
  constructor(prop: FileNodeProp) {
    this.fullPath = prop.fullPath;
    this.parsed = parse(this.fullPath);
    this.blocks = prop.blocks;
    this.blksize = prop.blksize;
    this.size = prop.size;
    this.movie = prop.movie;
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
   * image's intrinsic width in pixels:
   * "w92",
   * "w154",
   * "w185",
   * "w342",
   * "w500",
   * "w780",
   * "original"
   */
  posterURL = (resolution: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w185") => {
    if (this.movie && this.movie.posterURL) {
      return `https://image.tmdb.org/t/p/${resolution}${this.movie.posterURL}`;
    } else {
      return undefined
    }
  }

  /**
   * image's intrinsic width in pixels:
   * "w300",
   * "w780",
   * "w1280",
   * "original"
   */
  backgroundURL = (resolution: "w300" | "w780" | "w1280" | "original" = "w780") => {
    if (this.movie && this.movie.backgroundURL) {
      return `https://image.tmdb.org/t/p/${resolution}${this.movie.backgroundURL}`;
    } else {
      return undefined;
    }
  }
}