interface FileNodeProp {
  name: string;
  blocks: number;
  blksize: number;
  size: number;
  isDirectory: boolean;
  isFile: boolean;

  children?: FileNodeProp[];
}

export default class FileNode {
  constructor(prop: FileNodeProp) {
    this.name = prop.name;
    this.blocks = prop.blocks;
    this.blksize = prop.blksize;
    this.size = prop.size;
    this.isDirectory = prop.isDirectory;
    this.isFile = prop.isFile;
    this.children = prop.children;
  }

  name: string;
  blocks: number;
  blksize: number;
  size: number;
  isDirectory: boolean;
  isFile: boolean;

  children?: FileNodeProp[];
}