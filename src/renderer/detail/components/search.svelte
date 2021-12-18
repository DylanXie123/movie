<script lang="ts">
  import TMDBAPI from "../../../api/TMDB";
import Image from "../../common/image.svelte";
  import type { MovieInfo } from "../../store/fileNode";
  import type FileNode from "../../store/fileNode";
  import fileNodeStore from "../../store/fileNodeStore";
  import getDateString from "./getDateString";

  enum Status {
    Init,
    Loading,
    Loaded,
    Error,
  }

  export let node: FileNode;
  let status = Status.Init;
  let query = node.parsed.name;
  let results: MovieInfo[] = [];

  const search = () => {
    status = Status.Loading;
    TMDBAPI.useIMDBSearch(query)
      .then((res) => {
        results = res;
        status = Status.Loaded;
      })
      .catch(() => (status = Status.Error));
  };

  const clear = () => {
    results = [];
  };

  const updateStore = (movie: MovieInfo, fullPath: string) => {
    fileNodeStore.updateNode(movie, fullPath);
    clear();
    status = Status.Init;
  };

  const clickOutside = (node: HTMLElement) => {
    const handleClick = (event: any) => {
      if (!node.contains(event.target)) {
        status = Status.Init;
        clear();
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
</script>

<div use:clickOutside>
  <form on:submit|preventDefault={search}>
    <div class="position-relative">
      <input
        class="form-control rounded-pill my-2"
        placeholder="Search"
        type="search"
        value={node.parsed.name}
        on:input={(e) => (query = e.currentTarget.value)}
      />
      {#if status === Status.Loading}
        <div class="position-absolute top-50 end-0 translate-middle">
          <div class="spinner-border spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      {/if}
    </div>
  </form>

  <div class="position-relative">
    <div class="position-absolute w-100" style="z-index: 1;">
      <ul
        class="list-group"
        on:focus={() => {
          console.log("focus ul");
        }}
      >
        {#if status === Status.Error}
          <li class="list-group-item">Error...</li>
        {:else if status === Status.Loaded}
          {#if results.length === 0}
            <li class="list-group-item">Empty</li>
          {:else}
            {#each results as movie}
              <li
                on:click={() => updateStore(movie, node.fullPath)}
                class="list-group-item d-flex p-1"
                style="height: 100px;"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w92${movie.posterURL}`}
                  alt={movie.title}
                  classStr="shadow rounded img-fluid h-100"
                />
                <div class="ms-2 d-flex flex-column justify-content-between py-2">
                  <span class="fw-bold">{movie.title}</span>
                  <span>{getDateString(movie.releaseDate)}</span>
                </div>
              </li>
            {/each}
          {/if}
        {/if}
      </ul>
    </div>
  </div>
</div>
