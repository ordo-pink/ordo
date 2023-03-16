import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoFile, OrdoDirectoryPath } from "@ordo-pink/fs-entity"
import { ActionListItem, Null, useWorkspaceWithSidebar } from "@ordo-pink/react"
import { useEffect, useState } from "react"
import Kanban from "./kanban"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { getFiles } from "../../../core/utils/fs-helpers"

export default function KanbanActivity() {
  const Workspace = useWorkspaceWithSidebar()

  const tree = useAppSelector((state) => state.app.personalProject)

  const [kanbanFiles, setKanbanFiles] = useState<IOrdoFile[]>([])
  const [currentKanbanDirectory, setCurrentKanbanDirectory] =
    useState<Nullable<OrdoDirectoryPath>>(null)

  useEffect(() => {
    if (!tree) return

    const files = getFiles(tree)

    setKanbanFiles(files.filter((file) => Boolean(file.metadata.kanbans)))
  }, [tree])

  // TODO: Move kanban selection to URL
  return (
    <Workspace
      sidebarChildren={
        <div className="p-2">
          {kanbanFiles.map((kanbanFile) =>
            (kanbanFile.metadata.kanbans as OrdoDirectoryPath[]).map((directory, index) => (
              <ActionListItem
                key={kanbanFile.path}
                Icon={() => null}
                isCurrent={directory === currentKanbanDirectory}
                text={`${kanbanFile.readableName} ${index + 1}`}
                onClick={() => setCurrentKanbanDirectory(directory)}
              />
            )),
          )}
        </div>
      }
    >
      {Either.fromNullable(currentKanbanDirectory).fold(Null, (path) => (
        <Kanban directoryPath={path} />
      ))}
    </Workspace>
  )
}
