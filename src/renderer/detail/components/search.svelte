<script lang="ts">
  import TMDBAPI from "../../../api/TMDB";
  import Image from "../../common/image.svelte";
  import type FileTree from "../../store/fileTree";
  import fileTreeStore from "../../store/fileTreeStore";
  import type { MediaInfo } from "../../store/media";
  import getDateString from "./getDateString";

  enum Status {
    Init,
    Loading,
    Complete,
    Error,
  }

  export let node: FileTree;
  let status = Status.Init;
  let query = node.parsed.name;
  let results: MediaInfo[] = [];

  const search = () => {
    status = Status.Loading;
    TMDBAPI.searchMulti(query)
      .then((res) => {
        results = res;
        status = Status.Complete;
      })
      .catch(() => (status = Status.Error));
  };

  const clear = () => {
    results = [];
  };

  const updateStore = (node: FileTree, newData: MediaInfo) => {
    fileTreeStore.updateNode(node, newData);
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
    <div class="relative">
      <input
        class="w-full outline-none bg-transparent border-[1px] border-gray-500 hover:border-gray-100 rounded"
        type="search"
        value={node.parsed.base}
        on:input={(e) => (query = e.currentTarget.value)}
      />
      {#if status === Status.Loading}
        <div class="absolute top-1 right-1">
          <svg
            role="status"
            class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-purple-700"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      {/if}
    </div>
  </form>

  <div class="relative">
    <div class="absolute w-full z-10">
      <ul class="boder rounded divide-y bg-slate-800">
        {#if status === Status.Error}
          <li>Error...</li>
        {:else if status === Status.Complete}
          {#if results.length === 0}
            <li>Empty</li>
          {:else}
            {#each results as movie}
              <li
                on:click={() => updateStore(node, movie)}
                class="inline-flex p-1 h-20 w-full"
              >
                <Image
                  src={movie.getPosterURL()}
                  alt={movie.title}
                  classStr="shadow rounded h-full"
                />
                <div
                  class="mr-2 flex flex-col justify-between py-2"
                >
                  <span class="font-bold">{movie.title}</span>
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
