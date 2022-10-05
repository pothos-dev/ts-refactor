<script lang="ts">
  import Icon from '@iconify/svelte'

  export let leftIcon: string = ''
  export let rightIcon: string = ''
  export let text: string | number
  let className: string = ''
  export { className as class }
</script>

<div class="flex flex-row items-center {className}">
  <Icon class="mr-1" icon={leftIcon} />
  {text}
  <Icon class="ml-1" icon={rightIcon} />
</div>
