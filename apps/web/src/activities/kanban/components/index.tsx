import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoFile, OrdoDirectoryPath } from "@ordo-pink/fs-entity"
import { Null, useWorkspaceWithSidebar } from "@ordo-pink/react"
import { useEffect, useState } from "react"
import Kanban from "./kanban"
import KanbanFileReference from "./kanban-file-reference"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { getFiles } from "../../../core/utils/fs-helpers"

export default function KanbanActivity() {
  const Workspace = useWorkspaceWithSidebar()

  const tree = useAppSelector((state) => state.app.personalProject)

  const [kanbans, setKanbans] = useState(
    {} as Record<OrdoDirectoryPath, IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]>,
  )
  const [currentKanban, setCurrentKanban] = useState<Nullable<OrdoDirectoryPath>>(null)

  useEffect(() => {
    if (!tree) return

    const files = getFiles(tree) as IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]

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
  }, [tree])

  // TODO: Move kanban selection to URL
  return (
    <Workspace
      sidebarChildren={
        <div className="p-2">
          {Object.keys(kanbans).map((kanban) => (
            <KanbanFileReference
              key={kanban}
              isCurrent={kanban === currentKanban}
              kanban={kanban as OrdoDirectoryPath}
              setCurrentKanban={setCurrentKanban}
              files={kanbans[kanban as OrdoDirectoryPath]}
            />
          ))}
        </div>
      }
    >
      {Either.fromNullable(currentKanban).fold(Null, (path) => (
        <div className="h-[calc(100vh-10rem)]">
          <Kanban directoryPath={path} />
        </div>
      ))}
    </Workspace>
  )
}
