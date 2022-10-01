import ts from 'typescript'
import fs from 'fs/promises'

export async function parseAstFromFile(path: string): Promise<ts.SourceFile> {
  let fileContent = await fs.readFile(path, 'utf-8')

  // if (path.endsWith('.svelte')) {
  //   fileContent =
  //     fileContent.match(/<script(| lang="ts")>(.*)<\/script>/s)?.[2] || ''

  //   console.log(fileContent)
  // }

  const sourceFile = ts.createSourceFile(
    path,
    fileContent,
    ts.ScriptTarget.Latest
  )

  return sourceFile
}

export function walkAst(
  ast: ts.Node,
  visitor: (node: ts.Node) => boolean
): void {
  const cont = visitor(ast)
  if (!cont) return

  ts.forEachChild(ast, (child) => {
    walkAst(child, visitor)
  })
}
