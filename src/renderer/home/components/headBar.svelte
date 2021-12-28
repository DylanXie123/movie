<script lang="ts">
  import filterStore, { Order, Sort } from "../../store/filterStore";

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
</script>

<div
  class="container-xxl my-3 bg-dark sticky-top d-flex justify-content-between"
>
  <slot name="head">
    <div />
  </slot>
  <div class="d-flex justify-content-end gap-3">
    <div class="dropdown">
      <button
        class="btn btn-transparent dropdown-toggle rounded-pill"
        type="button"
        id="sortBy"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="m-0 me-2 position-relative">
          {$filterStore.sort.toString()}
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill ms-1"
          >
            {#if $filterStore.order === Order.Asc}
              <i class="bi bi-arrow-up-circle" />
            {:else}
              <i class="bi bi-arrow-down-circle" />
            {/if}
          </span>
        </span>
      </button>
      <ul
        class="dropdown-menu dropdown-menu-dark rounded"
        aria-labelledby="sortBy"
      >
        <li>
          <button
            class="dropdown-item"
            on:click={() => filterStore.setFilterProp({ sort: Sort.Random })}
          >
            <i class="bi bi-shuffle me-2" />Random
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            on:click={() => filterStore.setFilterProp({ sort: Sort.Title })}
          >
            <i class="bi bi-type me-2" />Title
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            on:click={() =>
              filterStore.setFilterProp({ sort: Sort.ReleaseDate })}
          >
            <i class="bi bi-calendar-date me-2" />Release
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            on:click={() =>
              filterStore.setFilterProp({ sort: Sort.TMDBRating })}
          >
            <i class="bi bi-bar-chart me-2" />Rating
          </button>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <button
            class="dropdown-item"
            on:click={() => filterStore.setFilterProp({ order: Order.Asc })}
          >
            <i class="bi bi-arrow-up me-2" />ascending
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            on:click={() => filterStore.setFilterProp({ order: Order.Desc })}
          >
            <i class="bi bi-arrow-down me-2" />descending
          </button>
        </li>
      </ul>
    </div>
    <div class="form-check m-auto">
      <input
        class="form-check-input bg-dark"
        type="checkbox"
        checked={$filterStore.onlyOnDisk}
        on:input={handleCheck}
        id="checkOnDisk"
      />
      <label class="form-check-label" for="checkOnDisk"> Disk </label>
    </div>
    <input
      class="form-control rounded-pill"
      value={$filterStore.queryStr}
      on:input={handleInput}
    />
  </div>
</div>
