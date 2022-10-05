import { parseAllSourceModules } from '$server/parser/FileSystem'
import { it } from 'vitest'
import fs from 'fs/promises'

it('parses all source modules', async () => {
  const modules = await parseAllSourceModules(__dirname)
  fs.writeFile('test/modules.json', JSON.stringify(modules, null, 2))
})
