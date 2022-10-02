import fs from 'fs/promises'
import JSON5 from 'json5'

export async function readJsonFile<T>(path: string): Promise<T> {
  const content = await fs.readFile(path, 'utf8')
  return JSON5.parse(content)
}
