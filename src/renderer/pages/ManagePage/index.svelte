<script lang="ts">
  import AccordionItem from "renderer/components/AccordionItem.svelte";
  import gridViewStore from "renderer/store/gridViewStore";

  let nodes = $gridViewStore.filter((n) => n.media === undefined);
</script>

<div class="accordion" id="accordionExample">
  {#each nodes as node}
    <AccordionItem title={node.parsed.base} />
  {/each}
</div>
