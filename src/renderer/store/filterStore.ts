import { writable } from "svelte/store";
import type FileTree from "./fileTree";

export enum Sort {
  Random = "Random",
  Title = "Title",
  ReleaseDate = "Release Date",
  TMDBRating = "TMDB Rating",
}

export enum Order {
  Asc = "Ascending",
  Desc = "Descending",
}

const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const resort = (nodes: FileTree[], newSort: Sort, newOrder: Order) => {
  const compareTitle = (a: FileTree, b: FileTree) => {
    if (a.media === undefined || b.media === undefined) {
      return 0;
    }
    if (a.media.title < b.media.title) {
      return newOrder === Order.Asc ? -1 : 1;
    }
    if (a.media.title > b.media.title) {
      return newOrder === Order.Asc ? 1 : -1;
    }
    return 0;
  };

  const compareDate = (a: FileTree, b: FileTree) => {
    if (a.media === undefined || b.media === undefined) {
      return 0;
    }
    if (newOrder === Order.Asc) {
      return a.media.releaseDate.getTime() - b.media.releaseDate.getTime();
    } else {
      return b.media.releaseDate.getTime() - a.media.releaseDate.getTime();
    }
  };

  const compareRating = (a: FileTree, b: FileTree) => {
    if (a.media === undefined || b.media === undefined) {
      return 0;
    }
    if (newOrder === Order.Asc) {
      return a.media.tmdbRating - b.media.tmdbRating;
    } else {
      return b.media.tmdbRating - a.media.tmdbRating;
    }
  };

  switch (newSort) {
    case Sort.Random:
      return shuffle(nodes);
    case Sort.Title:
      return nodes.sort(compareTitle);
    case Sort.ReleaseDate:
      return nodes.sort(compareDate);
    case Sort.TMDBRating:
      return nodes.sort(compareRating);
  }
};

const queryNodes = (nodes: FileTree[], queryStr: string) => nodes.filter((node) =>
  node.fullPath.toLowerCase().includes(queryStr.toLowerCase()) || node.media?.title.toLowerCase().includes(queryStr.toLowerCase())
);

const filterOnDisk = (nodes: FileTree[], onlyOnDisk: boolean) => {
  if (onlyOnDisk) {
    return nodes.filter((node) => node.onDisk);
  } else {
    return nodes;
  }
};

export interface FilterProp {
  sort: Sort;
  order: Order;
  queryStr: string;
  onlyOnDisk: boolean;
}

export const recalcNodes = (
  originalNode: FileTree[],
  prop: FilterProp,
) => {
  let newNodes = filterOnDisk(originalNode, prop.onlyOnDisk);
  newNodes = queryNodes(newNodes, prop.queryStr);
  return resort(newNodes, prop.sort, prop.order);
};

const createFilterStore = () => {
  const filterProp = writable<FilterProp>({
    sort: Sort.Title, order: Order.Asc, queryStr: "", onlyOnDisk: false
  });

  function setFilterProp(prop: Partial<FilterProp>) {
    filterProp.update(oldProp => ({ ...oldProp, ...prop }));
  }

  return {
    subscribe: filterProp.subscribe,
    setFilterProp,
  }
}

const filterStore = createFilterStore();

export default filterStore;