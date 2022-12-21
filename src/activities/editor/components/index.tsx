import { FC } from "react"
import { useSearchParams } from "react-router-dom"

import FileExplorer from "$activities/editor/components/file-explorer"
import FileNotSelected from "$activities/editor/components/file-not-selected"
import FileNotSupported from "$activities/editor/components/file-not-supported"
import { useCurrentFileAssociation } from "$activities/editor/hooks/use-current-file-association.hook"
import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace.hook"

import "$activities/editor/index.css"

export default function Editor() {
  const [query] = useSearchParams()

  const association = useCurrentFileAssociation()
  const Workspace = useWorkspaceWithSidebar()

  const Component = (association ? association.Component : FileNotSupported) as FC

  return (
    <Workspace sidebarChildren={<FileExplorer />}>
      <div className="editor">
        <div className="pl-2 w-full">{query.get("path") ? <Component /> : <FileNotSelected />}</div>
      </div>
    </Workspace>
  )
}
