<script lang="ts">
  import filterStore, { Order, Sort } from "../store/filterStore";

  const handleCheck = (e: any) => {
    const checked = e.target.checked;
    if (checked !== undefined) {
      filterStore.setFilterProp({ onlyOnDisk: checked });
    }
  };

  const handleInput = (e: any) => {
    const value = e.target.value;
    if (value !== undefined) {
      filterStore.setFilterProp({ queryStr: value });
    }
  };

  let dropdownExpand = false;
</script>

<div class="flex flex-row justify-between my-2 container mx-auto">
  <div class="self-center">
    <slot name="head" />
  </div>
  <div class="flex flex-row justify-end gap-3">
    <div class="relative z-10">
      <button
        class="btn rounded-full relative px-5"
        on:focus={() => {
          dropdownExpand = true;
        }}
        on:blur={() => {
          dropdownExpand = false;
        }}
      >
        <span>
          {$filterStore.sort.toString()}
        </span>
        <span class="absolute -top-2 -right-2">
          {#if $filterStore.order === Order.Asc}
            <i class="bi bi-arrow-up-circle" />
          {:else}
            <i class="bi bi-arrow-down-circle" />
          {/if}
        </span>
      </button>
      <ul class="absolute border rounded-lg" class:hidden={!dropdownExpand}>
        <li class="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-t-lg">
          <button
            class="inline-flex"
            on:click={() => filterStore.setFilterProp({ sort: Sort.Random })}
          >
            <i class="bi bi-shuffle mr-2" />
            <span> Random </span>
          </button>
        </li>
        <li class="px-2 py-1 bg-slate-800 hover:bg-slate-700">
          <button
            class="inline-flex"
            on:click={() => filterStore.setFilterProp({ sort: Sort.Title })}
          >
            <i class="bi bi-type mr-2" />Title
          </button>
        </li>
        <li class="px-2 py-1 bg-slate-800 hover:bg-slate-700">
          <button
            class="inline-flex"
            on:click={() =>
              filterStore.setFilterProp({ sort: Sort.ReleaseDate })}
          >
            <i class="bi bi-calendar-date mr-2" />Release
          </button>
        </li>
        <li class="px-2 py-1 bg-slate-800 hover:bg-slate-700">
          <button
            class="inline-flex"
            on:click={() =>
              filterStore.setFilterProp({ sort: Sort.TMDBRating })}
          >
            <i class="bi bi-bar-chart mr-2" />Rating
          </button>
        </li>
        <hr class="dropdown-divider" />
        <li class="px-2 py-1 bg-slate-800 hover:bg-slate-700">
          <button
            class="inline-flex"
            on:click={() => filterStore.setFilterProp({ order: Order.Asc })}
          >
            <i class="bi bi-arrow-up mr-2" />ascending
          </button>
        </li>
        <li class="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-b-lg">
          <button
            class="inline-flex"
            on:click={() => filterStore.setFilterProp({ order: Order.Desc })}
          >
            <i class="bi bi-arrow-down mr-2" />descending
          </button>
        </li>
      </ul>
    </div>

    <div class="m-auto">
      <input
        type="checkbox"
        checked={$filterStore.onlyOnDisk}
        on:input={handleCheck}
        id="checkOnDisk"
      />
      <label for="checkOnDisk"> Disk </label>
    </div>
    <input
      class="border-0 outline-none bg-transparent border-b-2 border-b-gray-500 hover:border-b-gray-100"
      type="text"
      value={$filterStore.queryStr}
      on:input={handleInput}
    />
  </div>
</div>
