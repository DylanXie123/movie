import { writable } from "svelte/store";

export enum View {
  Grid,
  Column,
}

const viewState = writable(View.Column);

export default viewState;