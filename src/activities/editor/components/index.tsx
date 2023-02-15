import { IOrdoFile, Nullable, OrdoFile, OrdoFilePath } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { createContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { AiOutlineLoading } from "react-icons/ai"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

import { EditorProps } from ".."
import { selectFile } from "../store"
import FileExplorer from "$activities/editor/components/file-explorer"
import FileNotSelected from "$activities/editor/components/file-not-selected"
import FileNotSupported from "$activities/editor/components/file-not-supported"
import { EditorActivityState } from "$activities/editor/types"
import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace"
import { useActionContext } from "$core/hooks/use-action-context"
import { useCurrentFileAssociation } from "$core/hooks/use-current-file-association"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { findOrdoFile } from "$core/utils/fs-helpers"

import "$activities/editor/index.css"

export const EditorContext = createContext({} as EditorProps)

export default function Editor(props: EditorProps) {
  const [path, setPath] = useState<Nullable<OrdoFilePath>>(null)

  const dispatch = useAppDispatch()

  const [query] = useSearchParams()
  const navigate = useNavigate()

  const editorSelector = useExtensionSelector<EditorActivityState>()

  const tree = useAppSelector((state) => state.app.personalProject)
  const isSaving = useAppSelector((state) => state.app.isSaving)
  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const association = useCurrentFileAssociation()

  const Workspace = useWorkspaceWithSidebar()

  const context = useActionContext()

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)

  useEffect(() => {
    setPath((query.get("path") as OrdoFilePath) ?? null)
  }, [query])

  useEffect(() => {
    if (!path) return

    const file = findOrdoFile(path, tree)

    if (!file) return

    dispatch(selectFile(file))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tree])

  useEffect(() => {
    if (!path) {
      props.persistedStore.get("recentFiles").then((files) => {
        if (!files || !files[0]) return

        const path = files[0]

        const fileExtension = OrdoFile.from({ path, size: 0 }).extension

        const association = fileAssociations.find((assoc) =>
          assoc.fileExtensions.includes(fileExtension),
        )

        const searchParams = createSearchParams({
          association: association ? association.name : "unsupported",
          path,
        })

        navigate({
          pathname: "/editor",
          search: searchParams.toString(),
        })
      })
    }
  }, [props.persistedStore, association, navigate, path, fileAssociations])

  useEffect(() => {
    if (!path || !tree || !dispatch) return

    const file = findOrdoFile(path, tree)

    if (!file) return

    props.persistedStore.get("recentFiles").then((recent) => {
      Switch.of(file.path)
        .case(
          (path) => !recent || recent.indexOf(path) === 0,
          () => void 0,
        )
        .case(
          (path) => Boolean(recent) && (recent as string[]).includes(path),
          () => {
            const recentCopy = [...(recent as OrdoFilePath[])]

            recentCopy.splice(recentCopy.indexOf(file.path), 1)
            props.persistedStore.set("recentFiles", [file.path].concat(recentCopy))
          },
        )
        .default(() => {
          props.persistedStore.set("recentFiles", [file.path].concat(recent as OrdoFilePath[]))
        })
    })
  }, [path, tree, props.persistedStore, dispatch])

  const Component = Either.fromNullable(association).fold(
    () => FileNotSupported,
    ({ Component }) => Component,
  )

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-editor/title")
  const translatedSaving = t("@ordo-activity-editor/saving")

  return (
    <EditorContext.Provider value={props}>
      <Workspace sidebarChildren={<FileExplorer />}>
        <Helmet>
          <title>
            {"Ordo.pink | "}
            {currentFile ? currentFile.readableName : translatedTitle}
          </title>
        </Helmet>

        <div className="editor">
          {Either.fromBoolean(Boolean(path) && currentFile).fold(
            () => (
              <FileNotSelected />
            ),
            () => (
              <Component
                file={currentFile as IOrdoFile}
                content={context.env.fetch(path as OrdoFilePath)}
              />
            ),
          )}
        </div>

        <div
          className={`${
            isSaving ? "block" : "hidden"
          } fixed bottom-2 right-2 opacity-50 flex items-center text-xs space-x-2 text-right`}
        >
          <AiOutlineLoading className="animate-spin" />
          <div>{translatedSaving}</div>
        </div>
      </Workspace>
    </EditorContext.Provider>
  )
}
