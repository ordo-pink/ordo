import { useParams } from "react-router-dom"

import FileExplorer from "$activities/editor/components/file-explorer"
import FileNotSelected from "$activities/editor/components/file-not-selected"
import FileNotSupported from "$activities/editor/components/file-not-supported"
import { useFileAssociation } from "$activities/editor/hooks/use-file-association.hook"
import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace.hook"

import "$activities/editor/index.css"

export default function Editor() {
  const { path } = useParams()

  const association = useFileAssociation()

  // TODO: EmptyEditor vs UnsupportedFile
  const Component = association ? association.Component : FileNotSupported

  const Workspace = useWorkspaceWithSidebar()

  return (
    <Workspace sidebarChildren={<FileExplorer />}>
      <div className="editor">
        <div className="pl-2 w-full">{path ? <Component /> : <FileNotSelected />}</div>
      </div>
    </Workspace>
  )
}
