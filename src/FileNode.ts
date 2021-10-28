import { parse, ParsedPath } from 'path';

export interface FileNodeProp {
  fullPath: string;
  blocks: number;
  blksize: number;
  size: number;
  isDirectory: boolean;
  isFile: boolean;

  children?: FileNode[];
  movie?: MovieProp;
}

export interface MovieProp {
  title: string;
  tmdb_id: string;
  imdb_id: string;
  poster_url: string;
  background_url: string;

  overview?: string;
  language?: string;
  release_date?: Date;
  tmdb_rating?: number;
  imdb_rating?: number;
}

export interface DBNode {
  fullPath: string;
  title: string;
  TMDB_ID: number;
  IMDB_ID: number;
  poster_URL: string;
  background_URL: string;
  overview?: string;
  language?: string;
  release_Date?: number;
  TMDB_Rating?: number;
  IMDB_Rating?: number;
}

export default class FileNode {
  constructor(props: FileNodeProp) {
    this.fullPath = props.fullPath;
    this.parsed = parse(this.fullPath);
    this.blocks = props.blocks;
    this.blksize = props.blksize;
    this.size = props.size;
    this.isDirectory = props.isDirectory;
    this.isFile = props.isFile;
    this.children = props.children;
    this.movie = props.movie;
  }

  fullPath: string;
  parsed: ParsedPath;
  blocks: number;
  blksize: number;
  size: number;
  isDirectory: boolean;
  isFile: boolean;

  children?: FileNode[];
  movie?: MovieProp;
}