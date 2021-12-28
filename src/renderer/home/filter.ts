import type FileTree from "../store/fileTree";

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

const queryNodes = (nodes: FileTree[], queryStr: string) => {
  if (queryStr.length === 0) {
    return nodes;
  } else {
    return nodes.filter((node) => {
      if (node.media === undefined) {
        return false;
      }
      return node.media.title.toLowerCase().includes(queryStr.toLowerCase());
    });
  }
};

const filterOnDisk = (nodes: FileTree[], onlyOnDisk: boolean) => {
  if (onlyOnDisk) {
    return nodes.filter((node) => node.onDisk);
  } else {
    return nodes;
  }
};

export const recalcNodes = (
  originalNode: FileTree[],
  onlyOnDisk: boolean,
  query: string,
  sort: Sort,
  order: Order
) => {
  let newNodes = filterOnDisk(originalNode, onlyOnDisk);
  newNodes = queryNodes(newNodes, query);
  return resort(newNodes, sort, order);
};
