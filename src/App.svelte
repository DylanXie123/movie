<script lang="ts">
  const basePath = "D:\\OneDrive - stu.xjtu.edu.cn\\Downloads";
  let dirs = readFileNode(basePath);

  function readDir(path: string) {
    return window.fsAPI.readDir(path);
  }

  function readStat(path: string) {
    return window.fsAPI.statSync(path);
  }

  function readFileNode(path: string) {
    console.log(window.fsAPI.readFileNode(path));
    return window.fsAPI.readFileNode(path);
  }
</script>

<ol>
  {#each dirs as dir}
    <li>
      <ul>
        <li>{dir.name}</li>
        <li>{dir.blocks}</li>
        <li>{dir.size}</li>
        <li>{dir.children}</li>
      </ul>
    </li>
  {/each}
</ol>
