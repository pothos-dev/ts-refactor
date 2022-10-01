import {
  findTsConfig,
  findIncludedSourcePaths,
  parseTsConfig,
} from '$lib/parser/tsconfig'

export type SourceFile = {
  path: string
}

export async function findAllSourceFiles(
  searchPath: string
): Promise<SourceFile[]> {
  const tsConfigPath = await findTsConfig(searchPath)
  const tsConfig = await parseTsConfig(tsConfigPath)
  const paths = await findIncludedSourcePaths(tsConfig)
  return paths.map((path) => ({ path }))
}
