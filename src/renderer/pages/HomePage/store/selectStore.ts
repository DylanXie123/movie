import { writable } from "svelte/store";
import type FileTree from "@/store/fileTree";

const selectedStore = writable<FileTree | undefined>(undefined);

export default selectedStore;