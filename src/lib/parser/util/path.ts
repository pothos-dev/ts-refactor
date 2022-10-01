import path from 'path'
import glob from 'glob'
import { uniq } from 'lodash'

// Converts a relative path to an absolute path, relative to the given basePath.
export function resolvePath(basePath: string, relativePath: string): string {
  return path.resolve(path.dirname(basePath), relativePath)
}

// Finds all paths matching the given glob pattern, relative to the given basePath.
export async function resolveGlobs(
  basePath: string,
  patterns: string[]
): Promise<string[]> {
  const matches = await Promise.all(
    patterns.map(
      (pattern) =>
        new Promise<string[]>((resolve, reject) => {
          const absolutePattern = resolvePath(basePath, pattern)
          return glob(absolutePattern, {}, (error, matches) => {
            if (error) reject(error)
            else resolve(matches)
          })
        })
    )
  )
  return uniq(matches.flat())
}

// Returns the paths of all ancestor directories of the given path.
// First element is the parent directory, last element is the root directory.
export function getAncestorDirectoryPaths(filePath: string): string[] {
  const directories = []

  let currentPath = path.dirname(filePath)
  directories.push(currentPath)
  while (currentPath != '/') {
    currentPath = path.dirname(currentPath)
    directories.push(currentPath)
  }

  return directories
}
