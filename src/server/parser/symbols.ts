import ts from 'typescript'
import { parseAstFromFile, walkAst } from '$server/parser/util/typescript'
import { find } from 'lodash'
import type { Symbol } from '$types/Symbol'

export async function parseSymbols(path: string): Promise<Symbol[]> {
  const symbols: Symbol[] = []
  try {
    const sourceFile = await parseAstFromFile(path)

    // First pass: collect all top-level symbols
    walkAst(sourceFile, node => {
      // Entry node is a SourceFile, we should walk into it
      if (ts.isSourceFile(node)) return true

      // type or interface
      if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
        symbols.push({
          kind: 'type',
          name: node.name.text,
          isExported: nodeIsExported(node),
        })
        return false
      }

      // named function
      if (ts.isFunctionDeclaration(node) && node.name) {
        symbols.push({
          kind: 'function',
          name: node.name.text,
          isExported: nodeIsExported(node),
        })
        return false
      }

      // named class
      if (ts.isClassDeclaration(node)) {
        if (node.name) {
          symbols.push({
            kind: 'class',
            name: node.name.text,
            isExported: nodeIsExported(node),
          })
        } else {
          throw Error('Class declaration without name')
        }
        return false
      }

      // variable(s)
      if (ts.isVariableStatement(node)) {
        // A variable statement can export multiple symbols at once.
        // All of them share the `isExported` flag of the statement.
        const isExported = nodeIsExported(node)
        node.declarationList.forEachChild(node => {
          if (ts.isVariableDeclaration(node)) {
            if (ts.isIdentifier(node.name)) {
              symbols.push({
                kind: 'variable',
                name: node.name.text,
                isExported,
              })
            } else {
              throw new Error(`Unexpected variable declaration`)
            }
          }
        })
        return false
      }

      // This will be handled in second pass
      if (ts.isExportAssignment(node)) return false
      if (ts.isExportDeclaration(node)) return false

      // These we don't are about
      if (ts.isExpressionStatement(node)) return false
      if (ts.isModuleDeclaration(node)) return false
      if (ts.isImportDeclaration(node)) return false
      if (ts.isToken(node)) return false
      if (ts.isLabeledStatement(node)) return false

      throw Error(`Unhandled node`)
    })

    // Second pass: find named or default exports
    walkAst(sourceFile, node => {
      // Entry node is a SourceFile, we should walk into it
      if (ts.isSourceFile(node)) return true

      // This is the default export
      if (ts.isExportAssignment(node)) {
        node.forEachChild(node => {
          if (ts.isIdentifier(node)) {
            symbols.push({
              kind: 'variable', // TODO could be something else
              name: 'default',
              isExported: true,
            })
          }
        })
      }

      // This exports one or more existing symbols
      if (ts.isExportDeclaration(node)) return true
      if (ts.isNamedExports(node)) return true
      if (ts.isExportSpecifier(node)) {
        if (node.propertyName) {
          // This is an export like `export { foo as bar }`
          const name = node.propertyName.text
          const symbol = find(symbols, { name })
          if (!symbol) throw Error(`Exported symbol ${name} not found`)
          symbol.isExported = true
          symbol.exportedName = node.name.text
        } else {
          // This is an export like `export { foo }`
          const name = node.name.text
          const symbol = find(symbols, { name })
          if (!symbol) throw Error(`Exported symbol ${name} not found`)
          symbol.isExported = true
        }
      }

      return false
    })
  } catch (error) {
    throw Error(`Parsing symbols in ${path}:\n${error}`)
  }
  return symbols
}

function nodeIsExported(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false
  const mods = ts.getModifiers(node) ?? []
  return mods.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
}
