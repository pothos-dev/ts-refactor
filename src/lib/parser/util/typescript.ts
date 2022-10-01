import ts from 'typescript'
import fs from 'fs/promises'

export async function parseAstFromFile(path: string): Promise<ts.SourceFile> {
  const fileContent = await fs.readFile(path, 'utf-8')

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
