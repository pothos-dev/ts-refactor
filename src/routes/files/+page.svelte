<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
</script>

<div class="flex flex-col p-4 space-y-1">
  {#each data.fileNames as fileName}
    <div class="border border-solid border-black p-1">{fileName}</div>
  {/each}
</div>
