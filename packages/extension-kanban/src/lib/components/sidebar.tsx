import { OrdoDirectoryPath, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useDrive, useRouteParams } from "@ordo-pink/react-utils"
import { useState, useEffect } from "react"
import KanbanFileReference from "./kanban-file-reference"

export default function Sidebar() {
  const drive = useDrive()
  const params = useRouteParams<"board">()

  const [kanbans, setKanbans] = useState(
    {} as Record<OrdoDirectoryPath, IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]>,
  )

  useEffect(() => {
    if (!drive) return

    const files = OrdoDirectory.getFilesDeep(drive.root) as IOrdoFile<{
      kanbans: OrdoDirectoryPath[]
    }>[]

    setKanbans(
      files
        .filter((file) => Boolean(file.metadata.kanbans))
        .reduce((acc, file) => {
          file.metadata.kanbans.forEach((kanban) => {
            if (!acc[kanban]) {
              acc[kanban] = []
            }

            acc[kanban].push(file)
          })

          return acc
        }, {} as Record<OrdoDirectoryPath, IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]>),
    )
  }, [drive])

  return (
    <div className="p-2">
      {Object.keys(kanbans).map((kanban) => (
        <KanbanFileReference
          key={kanban}
          isCurrent={!!params && `/${params.board}` === kanban}
          kanban={kanban as OrdoDirectoryPath}
          files={kanbans[kanban as OrdoDirectoryPath]}
        />
      ))}
    </div>
  )
}
