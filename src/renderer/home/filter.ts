import type FileNode from "../store/fileNode";

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

const resort = (nodes: FileNode[], newSort: Sort, newOrder: Order) => {
  const compareTitle = (a: FileNode, b: FileNode) => {
    if (a.movie === undefined || b.movie === undefined) {
      return 0;
    }
    if (a.movie.title < b.movie.title) {
      return newOrder === Order.Asc ? -1 : 1;
    }
    if (a.movie.title > b.movie.title) {
      return newOrder === Order.Asc ? 1 : -1;
    }
    return 0;
  };

  const compareDate = (a: FileNode, b: FileNode) => {
    if (a.movie === undefined || b.movie === undefined) {
      return 0;
    }
    if (newOrder === Order.Asc) {
      return a.movie.releaseDate.getTime() - b.movie.releaseDate.getTime();
    } else {
      return b.movie.releaseDate.getTime() - a.movie.releaseDate.getTime();
    }
  };

  const compareRating = (a: FileNode, b: FileNode) => {
    if (a.movie === undefined || b.movie === undefined) {
      return 0;
    }
    if (newOrder === Order.Asc) {
      return a.movie.tmdbRating - b.movie.tmdbRating;
    } else {
      return b.movie.tmdbRating - a.movie.tmdbRating;
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

const queryNodes = (nodes: FileNode[], queryStr: string) => {
  if (queryStr.length === 0) {
    return nodes;
  } else {
    return nodes.filter((node) => {
      if (node.movie === undefined) {
        return false;
      }
      return node.movie.title.toLowerCase().includes(queryStr.toLowerCase());
    });
  }
};

const filterOnDisk = (nodes: FileNode[], onlyOnDisk: boolean) => {
  if (onlyOnDisk) {
    return nodes.filter((node) => node.onDisk);
  } else {
    return nodes;
  }
};

export const recalcNodes = (
  originalNode: FileNode[],
  onlyOnDisk: boolean,
  query: string,
  sort: Sort,
  order: Order
) => {
  let newNodes = filterOnDisk(originalNode, onlyOnDisk);
  newNodes = queryNodes(newNodes, query);
  return resort(newNodes, sort, order);
};
