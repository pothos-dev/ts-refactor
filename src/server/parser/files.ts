import { getMetadata, mergeMetadata, parseModule } from '$server/parser/modules'
import {
  findTsConfig,
  findIncludedSourcePaths,
  parseTsConfig,
} from '$server/parser/tsconfig'
import { getAncestorDirectoryPaths } from '$server/parser/util/path'
import path from 'path'
import type { DirectoryNode, FileNode, FileSystemNode } from '$types/FileSystem'
import type { Module } from '$types/Module'

// Given a path, finds a tsconfig file and parses all included
// sourcefiles into modules, arranging them in a filesystem tree structure.
export async function parseFileSystemNode(
  searchPath: string
): Promise<DirectoryNode> {
  const directories: Record<string, DirectoryNode> = {}

  // Find and parse project
  const modules = await parseAllSourceModules(searchPath)

  for (const module of modules) {
    // Each module is converted into a FileNode
    const fileNode: FileNode = {
      type: 'file',
      module,

      path: module.path,
      relPath: path.basename(module.path),
      parent: null as any, //  Will be set once parent is created

      meta: getMetadata(module),
    }

    // Then all ancestor directories are created and added to the tree,
    // linking up parents and children.
    let currentNode: FileSystemNode = fileNode
    for (const dirPath of getAncestorDirectoryPaths(fileNode.path)) {
      let parentNode = directories[dirPath]

      if (parentNode) {
        // Existing node just gets updated with the new child
        parentNode.meta = mergeMetadata(parentNode.meta, currentNode.meta)
        parentNode.children.push(currentNode)
        currentNode.parent = parentNode
        break
      }

      if (!parentNode) {
        // New node gets created and added to the tree
        parentNode = {
          type: 'directory',
          children: [currentNode],

          path: dirPath,
          relPath: path.basename(dirPath),
          parent: null,

          meta: currentNode.meta,
        }
        directories[dirPath] = parentNode
        currentNode.parent = parentNode
      }

      currentNode = parentNode
    }
  }

  // Return a pointer to the directory that was passed as `searchPath`
  // Or if it was a file, return it's parent directory.
  const rootDir =
    directories[searchPath] ?? directories[path.dirname(searchPath)]

  rootDir.parent = null

  return rootDir
}

export async function parseAllSourceModules(
  searchPath: string
): Promise<Module[]> {
  const sourceFilePaths = await findAllSourceFiles(searchPath)
  return Promise.all(sourceFilePaths.map(parseModule))
}

async function findAllSourceFiles(searchPath: string): Promise<string[]> {
  const tsConfigPath = await findTsConfig(searchPath)
  const tsConfig = await parseTsConfig(tsConfigPath)
  return await findIncludedSourcePaths(tsConfig)
}
