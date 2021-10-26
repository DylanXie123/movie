import { writable } from "svelte/store";
import type FileNode from "../../fileNode";

/**
 * read data from database
 * 
 * @returns FileNode data read from database
 */
const init = () => {
  const fileTree = window.fsAPI.initFileTree("D:\\OneDrive - stu.xjtu.edu.cn\\Media\\Movies\\Marvel");
  const fileList = window.fsAPI.flatFileTree(fileTree);
  return fileList;
}

/**
 * persist data
 * @param data FileNode data to be saved
 * @returns save result, true or false
 */
const save = async (data: FileNode) => {
  return true;
}

/**
 * compare oldTree and newTree, only update needed part
 * @param oldTree 
 * @param newTree 
 * @returns diff result
 */
const diffTree = (oldTree: FileNode, newTree: FileNode) => {
  return newTree;
}

const fileTreeStore = writable<FileNode[]>(init());

export default fileTreeStore;