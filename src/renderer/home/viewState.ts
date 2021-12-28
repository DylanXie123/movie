import { writable } from "svelte/store";

export enum View {
  Grid,
  Column,
}

const viewState = writable(View.Grid);

export default viewState;