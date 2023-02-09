import { IOrdoDirectory, IOrdoDirectoryInitProps, OrdoDirectoryPath } from "../../types"
import { endsWithSlash, isValidPath } from "../common"

export const OrdoDirectory = {
  of: ({ path, children = [] }: IOrdoDirectoryInitProps): IOrdoDirectory => ({
    path,
    readableName: OrdoDirectory.getReadableName(path),
    children,
  }),
  isValidPath: (path: string) => isValidPath(path) && endsWithSlash(path),
  isOrdoDirectory: (x?: unknown): x is IOrdoDirectory =>
    Boolean(x) &&
    typeof (x as IOrdoDirectory).readableName === "string" &&
    Array.isArray((x as IOrdoDirectory).children) &&
    OrdoDirectory.isValidPath((x as IOrdoDirectory).path),
  sort: (directory: IOrdoDirectory) => {
    directory.children = directory.children.sort((a, b) => {
      if (OrdoDirectory.isOrdoDirectory(a)) {
        OrdoDirectory.sort(a)
      }

      if (OrdoDirectory.isOrdoDirectory(b)) {
        OrdoDirectory.sort(b)
      }

      if (!OrdoDirectory.isOrdoDirectory(a) && OrdoDirectory.isOrdoDirectory(b)) {
        return 1
      }

      if (OrdoDirectory.isOrdoDirectory(a) && !OrdoDirectory.isOrdoDirectory(b)) {
        return -1
      }

      return a.readableName.localeCompare(b.readableName)
    })

    return directory
  },
  getParentPath: (path: OrdoDirectoryPath): OrdoDirectoryPath => {
    const splittablePath = path.slice(0, -1)

    if (!splittablePath) return path

    const lastSeparatorPosition = splittablePath.lastIndexOf("/") + 1

    return splittablePath.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  getReadableName: (path: OrdoDirectoryPath): string => {
    const lastSeparatorPosition = path.slice(0, -1).lastIndexOf("/") + 1

    return path.slice(lastSeparatorPosition, -1)
  },
}
