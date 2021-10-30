import { parse, ParsedPath } from 'path';

export interface FileNodeProp {
  fullPath: string;
  blocks: number;
  blksize: number;
  size: number;
  movie?: MovieProp;
}

export interface MovieProp {
  title: string;
  tmdbID: number;
  imdbID: number;
  posterURL: string;
  backgroundURL: string;
  overview?: string;
  language?: string;
  releaseDate?: Date;
  tmdbRating?: number;
  imdbRating?: number;
}

export type DBNode = Omit<MovieProp, "releaseDate"> & { fullPath: string, releaseDate?: string };

export type UpdateType = Partial<Omit<DBNode, "fullPath">> & { fullPath: string };

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
  movie?: MovieProp;


  get onDisk() {
    return this.blocks === 0;
  }

  get diskSize() {
    return this.blocks * this.blksize;
  }
}