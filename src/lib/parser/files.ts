import { resolveGlobs } from '$lib/parser/pathUtils'
import { findTsConfig, parseTsConfig } from '$lib/parser/tsconfig'
import fs from 'fs/promises'
import path from 'path'

const rootDir = process.cwd()

export async function getFileNames(): Promise<string[]> {
  const tsConfigPath = await findTsConfig(rootDir)
  const tsConfig = await parseTsConfig(tsConfigPath)
  const files = await resolveGlobs(rootDir, tsConfig.include)
  return files
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(res)
    } else {
      yield res
    }
  }
}
