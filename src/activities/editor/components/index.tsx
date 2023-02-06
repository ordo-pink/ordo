import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import FileExplorer from "$activities/editor/components/file-explorer"
import FileNotSelected from "$activities/editor/components/file-not-selected"
import FileNotSupported from "$activities/editor/components/file-not-supported"
import { selectFile } from "$activities/editor/store"
import { EditorActivityState } from "$activities/editor/types"

import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace"
import { useCurrentFileAssociation } from "$core/hooks/use-current-file-association"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { findOrdoFile } from "$core/utils/fs-helpers"

import "$activities/editor/index.css"

export default function Editor() {
  const dispatch = useAppDispatch()

  const [query] = useSearchParams()

  const editorSelector = useExtensionSelector<EditorActivityState>()

  const tree = useAppSelector((state) => state.app.personalProject)
  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

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

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-editor/title")

  return (
    <Workspace sidebarChildren={<FileExplorer />}>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {currentFile ? currentFile.readableName : translatedTitle}
        </title>
      </Helmet>

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
