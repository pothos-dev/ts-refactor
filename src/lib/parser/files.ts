import { parseModule, type Module } from '$lib/parser/modules'
import {
  findTsConfig,
  findIncludedSourcePaths,
  parseTsConfig,
} from '$lib/parser/tsconfig'

export async function findAllSourceFiles(
  searchPath: string
): Promise<string[]> {
  const tsConfigPath = await findTsConfig(searchPath)
  const tsConfig = await parseTsConfig(tsConfigPath)
  return await findIncludedSourcePaths(tsConfig)
}

export async function parseAllSourceModules(
  searchPath: string
): Promise<Module[]> {
  const sourceFilePaths = await findAllSourceFiles(searchPath)
  return Promise.all(sourceFilePaths.map(parseModule))
}
