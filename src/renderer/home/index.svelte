<script lang="ts">
  import { onDestroy } from "svelte";
  import type FileNode from "../store/fileNode";
  import fileNodeStore from "../store/fileNodeStore";
  import selectedStore from "../store/selectStore";
  import { shuffle } from "../store/utils";
  import MovieContainer from "./movieContainer.svelte";

  enum Sort {
    Random,
    Title,
    ReleaseDate,
    TMDBRating,
  }

  let fileNodes: FileNode[] = [];
  let sort: Sort = Sort.Title;
  let ascending: boolean = true;

  const resort = (method: Sort, ascending: boolean) => {
    const compareTitle = (a: FileNode, b: FileNode) => {
      if (a.movie === undefined || b.movie === undefined) {
        return 0;
      }
      if (a.movie.title < b.movie.title) {
        return ascending ? -1 : 1;
      }
      if (a.movie.title > b.movie.title) {
        return ascending ? 1 : -1;
      }
      return 0;
    };

    const compareDate = (a: FileNode, b: FileNode) => {
      if (a.movie === undefined || b.movie === undefined) {
        return 0;
      }
      if (ascending) {
        return a.movie.releaseDate.getTime() - b.movie.releaseDate.getTime();
      } else {
        return b.movie.releaseDate.getTime() - a.movie.releaseDate.getTime();
      }
    };

    const compareRating = (a: FileNode, b: FileNode) => {
      if (a.movie === undefined || b.movie === undefined) {
        return 0;
      }
      if (ascending) {
        return a.movie.tmdbRating - b.movie.tmdbRating;
      } else {
        return b.movie.tmdbRating - a.movie.tmdbRating;
      }
    };

    switch (method) {
      case Sort.Random:
        return shuffle(fileNodes);
      case Sort.Title:
        return fileNodes.sort(compareTitle);
      case Sort.ReleaseDate:
        return fileNodes.sort(compareDate);
      case Sort.TMDBRating:
        return fileNodes.sort(compareRating);
    }
  };

  const unsubscribeFileNode = fileNodeStore.subscribe((newData) => {
    fileNodes = newData;
    fileNodes = resort(sort, ascending);
  });

  const changeSort = (newSort: Sort) => {
    sort = newSort;
    fileNodes = resort(sort, ascending);
  };

  const toASC = (isascending: boolean) => {
    ascending = isascending;
    fileNodes = resort(sort, ascending);
  };

  onDestroy(unsubscribeFileNode);
</script>

<div class="d-flex h-100">
  <div class="flex-grow-1 d-flex flex-column col-lg-8 col-sm-7">
    <div class="container-fluid py-3 bg-dark sticky-top">
      <div class="d-flex justify-content-end">
        <div class="dropdown pe-3">
          <button
            class="btn btn-transparent dropdown-toggle rounded-pill"
            type="button"
            id="sortBy"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort By
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
          </ul>
        </div>
        <div class="dropdown pe-3">
          <button
            class="btn btn-transparent dropdown-toggle rounded-pill"
            type="button"
            id="order"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Order
          </button>
          <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="order">
            <li>
              <button class="dropdown-item" on:click={() => toASC(true)}>
                <i class="bi bi-sort-numeric-down me-2" />ascending
              </button>
            </li>
            <li>
              <button class="dropdown-item" on:click={() => toASC(false)}>
                <i class="bi bi-sort-numeric-down-alt me-2" />descending
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-fluid flex-grow-1 overflow-auto">
      <div class="row g-4">
        {#each fileNodes as node (node.fullPath)}
          <MovieContainer {node} />
        {/each}
      </div>
    </div>
  </div>

  {#if $selectedStore}
    <div class="container-fluid col-lg-4 col-sm-5">
      <img class="img-fluid" src={$selectedStore.backgroundURL} alt="poster" />
    </div>
  {/if}
</div>
