import fs from 'fs/promises'
import path from 'path'

const rootDir = process.cwd()

export async function getFileNames(): Promise<string[]> {
  const fileNames: string[] = []
  for await (const fileName of walk(rootDir)) {
    fileNames.push(fileName)
  }
  return fileNames
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
