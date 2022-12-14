import { useParams } from "react-router-dom"

import EmptyEditor from "$activities/editor/components/empty-editor"
import FileExplorer from "$activities/editor/components/file-explorer"
import { useFileAssociation } from "$activities/editor/hooks/use-file-association.hook"
import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace.hook"

import "$activities/editor/index.css"

export default function Editor() {
  const { path } = useParams()

  const association = useFileAssociation()

  // TODO: EmptyEditor vs UnsupportedFile
  const Component = association ? association.Component : EmptyEditor

  const Workspace = useWorkspaceWithSidebar()

  return (
    <Workspace sidebarChildren={<FileExplorer />}>
      <div className="editor">
        <div className="pl-2 w-full">{path ? <Component /> : <EmptyEditor />}</div>
      </div>
    </Workspace>
  )
}
