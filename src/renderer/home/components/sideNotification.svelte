<script lang="ts">
  import { push } from "svelte-spa-router";

  import gridViewStore from "../../store/gridViewStore";

  const handleClick = () => {
    push("/manage");
  };

  let emptyCount = $gridViewStore.filter((n) => !n.onDisk).length;
</script>

{#if emptyCount > 0}
  <div class="fixed bottom-0 right-0" on:click={handleClick}>
    {`${emptyCount} empty movies`}
  </div>
{/if}
