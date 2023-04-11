import { IOrdoDirectory, Nullable, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null, useContextMenu, useDrive, useRouteParams } from "@ordo-pink/react-utils"
import { MouseEvent, useEffect, useState } from "react"
import FSActivityDirectory from "./fs-activity-directory"
import FSActivityFile from "./fs-activity-file"

export default function FSActivity() {
  const drive = useDrive()
  const { path } = useRouteParams<"path">()
  const { showContextMenu } = useContextMenu()

  const [currentDirectory, setCurrentDirectory] = useState<Nullable<IOrdoDirectory>>()

  useEffect(() => {
    if (!drive) return setCurrentDirectory(null)
    if (!path) return setCurrentDirectory(drive.root)

    setCurrentDirectory(
      OrdoDirectory.findDirectoryDeep(`/${path}` as OrdoDirectoryPath, drive.root),
    )
  }, [path, drive])

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    showContextMenu({
      x: e.pageX,
      y: e.pageY,
      target: currentDirectory,
    })
  }

  return Either.fromNullable(currentDirectory).fold(Null, (root) => (
    <div
      className="p-4 h-full w-full"
      onContextMenu={handleContextMenu}
    >
      <div className="flex flex-wrap items-start">
        {root.children.map((child) =>
          OrdoDirectory.isOrdoDirectory(child) ? (
            <FSActivityDirectory
              key={child.path}
              directory={child}
            />
          ) : (
            <FSActivityFile
              key={child.path}
              file={child}
            />
          ),
        )}
      </div>
    </div>
  ))
}
