import { useSearchParams } from "react-router-dom"

import FileExplorer from "$activities/editor/components/file-explorer"
import FileNotSelected from "$activities/editor/components/file-not-selected"
import FileNotSupported from "$activities/editor/components/file-not-supported"
import { useCurrentFileAssociation } from "$activities/editor/hooks/use-current-file-association"

import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace"

import { Either } from "$core/utils/either"

import "$activities/editor/index.css"

export default function Editor() {
  const [query] = useSearchParams()

  const association = useCurrentFileAssociation()
  const Workspace = useWorkspaceWithSidebar()

  const Component = Either.fromNullable(association).fold(
    () => FileNotSupported,
    ({ Component }) => Component,
  )

  return (
    <Workspace sidebarChildren={<FileExplorer />}>
      <div className="editor">
        {Either.fromBoolean(Boolean(query.get("path"))).fold(
          () => (
            <FileNotSelected />
          ),
          () => (
            <Component />
          ),
        )}
      </div>
    </Workspace>
  )
}
