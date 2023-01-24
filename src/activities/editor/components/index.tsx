import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import FileExplorer from "$activities/editor/components/file-explorer"
import FileNotSelected from "$activities/editor/components/file-not-selected"
import FileNotSupported from "$activities/editor/components/file-not-supported"
import { useCurrentFileAssociation } from "$activities/editor/hooks/use-current-file-association"
import { selectFile } from "$activities/editor/store"

import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"
import { findOrdoFile } from "$core/utils/fs-helpers"

import "$activities/editor/index.css"

export default function Editor() {
  const dispatch = useAppDispatch()

  const [query] = useSearchParams()

  const tree = useAppSelector((state) => state.app.personalProject)

  const association = useCurrentFileAssociation()
  const Workspace = useWorkspaceWithSidebar()

  const path = query.get("path")

  useEffect(() => {
    if (!path || !tree || !dispatch) return

    const file = findOrdoFile(path, tree)

    if (!file) return

    dispatch(selectFile(file))
  }, [path, tree, dispatch])

  const Component = Either.fromNullable(association).fold(
    () => FileNotSupported,
    ({ Component }) => Component,
  )

  return (
    <Workspace sidebarChildren={<FileExplorer />}>
      <div className="editor">
        {Either.fromBoolean(Boolean(path)).fold(
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
