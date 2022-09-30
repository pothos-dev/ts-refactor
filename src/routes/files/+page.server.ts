import { getFileNames } from '$lib/parser/files'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  return {
    fileNames: await getFileNames(),
  }
}
