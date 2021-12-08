<script lang="ts">
  import { onDestroy } from "svelte";
  import type FileNode from "../store/fileNode";
  import fileNodeStore from "../store/fileNodeStore";
  import selectedStore from "../store/selectStore";
  import { shuffle } from "../store/utils";
  import MovieContainer from "./movieContainer.svelte";
  import SelectedBox from "./selectedBox.svelte";

  enum Sort {
    Random = "Random",
    Title = "Title",
    ReleaseDate = "Release Date",
    TMDBRating = "TMDB Rating",
  }

  enum Order {
    Asc = "Ascending",
    Desc = "Descending",
  }

  let fileNodes: FileNode[] = [];
  let filtered: FileNode[] = [];
  let sort = Sort.Title;
  let order = Order.Asc;
  let queryStr = "";

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
      return fileNodes;
    } else {
      return nodes.filter((node) => {
        if (node.movie === undefined) {
          return false;
        }
        return node.movie.title.toLowerCase().includes(queryStr.toLowerCase());
      });
    }
  };

  const unsubscribeFileNode = fileNodeStore.subscribe((newData) => {
    fileNodes = newData;
    filtered = queryNodes(fileNodes, queryStr);
    filtered = resort(filtered, sort, order);
  });

  const changeSort = (newSort: Sort) => {
    sort = newSort;
    filtered = queryNodes(fileNodes, queryStr);
    filtered = resort(filtered, sort, order);
  };

  const changeOrder = (newOrder: Order) => {
    order = newOrder;
    filtered = queryNodes(fileNodes, queryStr);
    filtered = resort(filtered, sort, newOrder);
  };

  const applyQuery = () => {
    filtered = queryNodes(fileNodes, queryStr);
  };

  onDestroy(unsubscribeFileNode);
</script>

<div class="d-flex h-100 container-xl">
  <div class="flex-grow-1 d-flex flex-column col-lg-8 col-sm-7">
    <div
      class="container-fluid py-3 bg-dark sticky-top d-flex justify-content-between"
    >
      <span>
        {queryStr.length
          ? `${filtered.length}/${fileNodes.length}`
          : filtered.length}
      </span>
      <div class="d-flex justify-content-end">
        <div class="dropdown pe-3">
          <button
            class="btn btn-transparent dropdown-toggle rounded-pill"
            type="button"
            id="sortBy"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort By {sort.toString()} in
            {order.toString()} Order
          </button>
          <ul
            class="dropdown-menu dropdown-menu-dark rounded"
            aria-labelledby="sortBy"
          >
            <li>
              <button
                class="dropdown-item"
                on:click={() => changeSort(Sort.Random)}
              >
                <i class="bi bi-shuffle me-2" />Random
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                on:click={() => changeSort(Sort.Title)}
              >
                <i class="bi bi-type me-2" />Title
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                on:click={() => changeSort(Sort.ReleaseDate)}
              >
                <i class="bi bi-calendar-date me-2" />Release
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                on:click={() => changeSort(Sort.TMDBRating)}
              >
                <i class="bi bi-bar-chart me-2" />Rating
              </button>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button
                class="dropdown-item"
                on:click={() => changeOrder(Order.Asc)}
              >
                <i class="bi bi-sort-numeric-down me-2" />ascending
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                on:click={() => changeOrder(Order.Desc)}
              >
                <i class="bi bi-sort-numeric-down-alt me-2" />descending
              </button>
            </li>
          </ul>
        </div>
        <input
          class="form-control rounded-pill"
          bind:value={queryStr}
          on:input={applyQuery}
        />
      </div>
    </div>
    <div class="container-fluid flex-grow-1 overflow-auto">
      <div class="row g-4">
        {#each filtered as node (node.fullPath)}
          <MovieContainer {node} />
        {/each}
      </div>
    </div>
  </div>

  {#if $selectedStore}
    <div class="container-fluid col-lg-4 col-sm-5">
      <SelectedBox node={$selectedStore} />
    </div>
  {/if}
</div>
