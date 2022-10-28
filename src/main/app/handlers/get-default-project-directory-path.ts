import { app } from "electron"
import { join } from "path"

export const getDefaultProjectDirectoryPath = () => {
  const documentsPath = app.getPath("documents")

  return join(documentsPath, "Ordo")
}
