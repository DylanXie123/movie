<script lang="ts">
  import { push } from "svelte-spa-router";

  import gridViewStore from "../../store/gridViewStore";

  const handleClick = () => {
    push("/manage");
  };

  let emptyCount = $gridViewStore.filter((n) => !n.onDisk).length;
</script>

{#if emptyCount > 0}
  <div class="notification-box" on:click={handleClick}>
    {`${emptyCount} empty movies`}
  </div>
{/if}

<style lang="scss">
  @import "../../scss/index.scss";

  .notification-box {
    @extend .position-fixed;
    bottom: 10px;
    right: 0;
    background-color: $primary;
  }
</style>
