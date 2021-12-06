import { writable } from "svelte/store";
import type FileNode from "./fileNode";

const selectedStore = writable<FileNode | undefined>();
export default selectedStore;