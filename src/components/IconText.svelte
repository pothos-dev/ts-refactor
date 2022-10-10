<script lang="ts">
  import Icon from '@iconify/svelte'
  import { Icons, type IconType } from '$constants/Icons'

  export let leftIcon: IconType | null = null
  export let rightIcon: IconType | null = null
  export let text: string | number
  let className: string = ''
  export { className as class }
</script>

<div class="flex flex-row items-center {className}">
  {#if leftIcon}
    <Icon class="mr-1" icon={Icons[leftIcon]} />
  {/if}

  {text}

  {#if rightIcon}
    <Icon class="ml-1" icon={Icons[rightIcon]} />
  {/if}
</div>
