import ts from 'typescript'
import fs from 'fs/promises'

export async function parseAstFromFile(path: string): Promise<ts.SourceFile> {
  let fileContent = await fs.readFile(path, 'utf-8')

  if (path.endsWith('.svelte')) {
    // In Svelte Files, only parse the <script/> block
    fileContent =
      fileContent.match(/<script(| lang="ts")>(.*)<\/script>/s)?.[2] || ''
  }

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

  ts.forEachChild(ast, child => {
    try {
      walkAst(child, visitor)
    } catch (error) {
      const kind = ts.SyntaxKind[child.kind]
      const pos = `${child.pos}-${child.end}`
      throw Error(`Handling ${kind}[${pos}]:\n${error}`)
    }
  })
}
