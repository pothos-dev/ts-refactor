import {
  findTsConfig,
  findIncludedSourcePaths,
  parseTsConfig,
} from '$server/parser/tsconfig'
import { describe, it, expect } from 'vitest'

describe('tsconfig', () => {
  it('finds tsconfig.json', async () => {
    const path = await findTsConfig(process.cwd())
    expect(path).toMatch(/tsconfig.json$/)
  })

  it('parses tsconfig.json', async () => {
    const path = await findTsConfig(process.cwd())
    const tsConfig = await parseTsConfig(path)
    expect(tsConfig).toMatchObject({
      compilerOptions: {
        baseUrl: expect.any(String),
        paths: expect.any(Object),
      },
      include: expect.any(Array),
      exclude: expect.any(Array),
    })
  })

  it('finds included files', async () => {
    const path = await findTsConfig(process.cwd())
    const tsConfig = await parseTsConfig(path)
    const files = await findIncludedSourcePaths(tsConfig)
    expect(files.length).toBeGreaterThan(0)
  })
})
