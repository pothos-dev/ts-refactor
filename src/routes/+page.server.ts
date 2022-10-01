import { parseFileSystemNode } from '$lib/parser/files'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  return {
    fileSystemNode: await parseFileSystemNode(process.cwd()),
  }
}
