import { parse, ParsedPath, join } from 'path';

interface FileNodeProp {
  fullPath: string;
  blocks: number;
  blksize: number;
  size: number;
  movie?: MovieInfo;
}

export class MovieInfo {
  constructor(prop: {
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
  }) {
    this.title = prop.title;
    this.tmdbID = prop.tmdbID;
    this.imdbID = prop.imdbID;
    this.posterURL = prop.posterURL;
    this.backgroundURL = prop.backgroundURL;
    this.overview = prop.overview;
    this.language = prop.language;
    this.releaseDate = prop.releaseDate;
    this.tmdbRating = prop.tmdbRating;
    this.imdbRating = prop.imdbRating;
    this.runtime = prop.runtime;
    this.genres = prop.genres;
    this.credits = prop.credits;
  }

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
  getPosterURL = (resolution: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w185") => {
    if (this.posterURL) {
      return `https://image.tmdb.org/t/p/${resolution}${this.posterURL}`;
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
  getBackgroundURL = (resolution: "w300" | "w780" | "w1280" | "original" = "w780") => {
    if (this.backgroundURL) {
      return `https://image.tmdb.org/t/p/${resolution}${this.backgroundURL}`;
    } else {
      return undefined;
    }
  }
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
}

export class FileTree extends FileNode {
  constructor(root: FileNodeProp, children?: FileTree[]) {
    super(root);
    if (children && children.length > 0) {
      this.children = new Map<string, FileTree>();
      children.forEach(child => this.children!.set(child.fullPath, child));
    }
  }

  children?: Map<string, FileTree> = undefined;

  query(path: string): FileTree | undefined {
    if (path.includes(this.fullPath)) {
      const subPath = path.replace(this.fullPath, '');
      const indexList = subPath.slice(1).split('/').filter(Boolean);

      let parent: FileTree | undefined = this;
      let result: FileTree | undefined = this;
      let queryStr = this.fullPath;

      for (let index = 0; index < indexList.length; index++) {
        parent = result;
        queryStr = join(queryStr, indexList[index]);
        if (parent && !parent.isLeaf) {
          result = parent.children!.get(queryStr);
        } else {
          return undefined;
        }
      }
      return result;
    } else {
      return undefined;
    }
  }

  forEach(callback: (node: FileTree) => void) {
    callback(this);
    if (!this.isLeaf) this.children!.forEach(child => child.forEach(callback));
  }

  map<T>(callback: (node: FileTree) => T): T[] {
    const result: T[] = [];
    result.push(callback(this));
    if (this.children) {
      this.children.forEach(child => result.push(...child.map(callback)));
    }
    return result;
  }

  /**
   * stop traversing when the callback returns false
   * @param predict return `true` to go deeper in the tree
   */
  forEachWithStop(predict: (node: FileTree) => boolean) {
    const result = predict(this);
    if (result && !this.isLeaf) {
      this.children!.forEach(child => child.forEachWithStop(predict));
    }
  }

  get flatToList() {
    const result: FileNode[] = [];
    this.forEach(node => result.push(node));
    return result;
  }


  get isLeaf() {
    return this.children === undefined || this.children.size === 0;
  }
}