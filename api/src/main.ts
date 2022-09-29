import fs from "fs/promises"
import path from "path"
import { rootPath } from "./args"

foreachFile(rootPath, console.log)

async function foreachFile(folder: string, callback: (filePath: string) => void) {
  const dirents = await fs.readdir(folder, { withFileTypes: true })
  for (const dirent of dirents) {
    const filePath = path.join(folder, dirent.name)
    if (dirent.isDirectory()) {
      await foreachFile(filePath, callback)
    } else if (dirent.isFile()) {
      callback(filePath)
    }
  }
}
