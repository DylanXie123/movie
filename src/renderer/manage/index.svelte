<script lang="ts">
  import gridViewStore from "../store/gridViewStore";
  import AccordionItem from "./components/accordionItem.svelte";

  let nodes = $gridViewStore.filter(n => n.media === undefined);
</script>

<div class="accordion" id="accordionExample">
  {#each nodes as node}
    <AccordionItem title={node.parsed.base} />
  {/each}
</div>
