import { resolvePath, resolveGlobs } from '$lib/parser/util/path'
import fs from 'fs/promises'
import path from 'path'
import { logger } from '$lib/logger'
import { readJsonFile } from '$lib/parser/util/file'

const log = logger('tsconfig', false)

type TSConfig = {
  extends: string

  compilerOptions: {
    baseUrl: string
    paths: Record<string, string[]>
  }
  include?: string[]
  exclude?: string[]
}

// Given a path (file or directory), finds the nearest tsconfig.json file
// in the directory tree above it, or throws an Error.
export async function findTsConfig(searchPath: string): Promise<string> {
  const parts = path.normalize(searchPath).split(path.sep)
  while (parts.length > 0) {
    const tsConfigPath = path.join(parts.join(path.sep), 'tsconfig.json')
    log(`searching for tsconfig.json at "${tsConfigPath}"`)
    try {
      const stats = await fs.stat(tsConfigPath)
      if (stats.isFile()) {
        log(`found tsconfig.json at "${tsConfigPath}"`)
        return tsConfigPath
      }
    } catch (error) {
      // file does not exist or is not readable
    }
    parts.pop()
  }
  throw Error(`No tsconfig.json found at ${path} or any parent directory`)
}

// Parses a subset of the tsconfig.json found at `tsConfigPath`, while
// applying any `extends` clauses found in the file.
export async function parseTsConfig(tsConfigPath: string): Promise<TSConfig> {
  try {
    const tsConfig = await readJsonFile<TSConfig>(tsConfigPath)
    log(`parsed tsconfig at "${tsConfigPath}":`, tsConfig)

    // Paths in tsconfig.json are relative to the tsconfig.json file itself.
    // Before we merge this config with any other configs that extend from it,
    // convert those relative paths into absolute ones.
    if (tsConfig.include) {
      tsConfig.include = tsConfig.include.map((relPath) =>
        resolvePath(tsConfigPath, relPath)
      )
      log('converted include paths to absolute ones', tsConfig.include)
    }

    if (tsConfig.extends) {
      log("tsconfig extends from another tsconfig, let's merge them")

      const extendedPath = resolvePath(tsConfigPath, tsConfig.extends)
      const extendedTsConfig = await parseTsConfig(extendedPath)
      return mergeConfigs(extendedTsConfig, tsConfig)
    } else {
      return tsConfig
    }
  } catch (error) {
    throw Error(`Failed to parse ${tsConfigPath}: ${error}`)
  }

  function mergeConfigs(config: TSConfig, extendsConfig: TSConfig) {
    return {
      ...extendsConfig,
      ...config,
      compilerOptions: {
        ...extendsConfig.compilerOptions,
        ...config.compilerOptions,
      },
      include: [...(extendsConfig.include ?? []), ...(config.include ?? [])],
    }
  }
}

export async function findIncludedSourcePaths(
  config: TSConfig
): Promise<string[]> {
  const files = await resolveGlobs('', config.include ?? [])
  log('Resolving include globs from Config', files)
  return files
}
