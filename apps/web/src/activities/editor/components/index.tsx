import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoFile, OrdoFilePath, IOrdoFile } from "@ordo-pink/fs-entity"
import { useWorkspaceWithSidebar } from "@ordo-pink/react"
import { Switch } from "@ordo-pink/switch"
import { createContext, FC, memo, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { AiOutlineLoading } from "react-icons/ai"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"
import FileExplorer from "./file-explorer"
import FileNotSelected from "./file-not-selected"
import FileNotSupported from "./file-not-supported"
import { EditorProps } from ".."
import { createFile } from "../../../containers/app/store"
import { useCurrentFileAssociation } from "../../../core/hooks/use-current-file-association"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { findOrdoFile } from "../../../core/utils/fs-helpers"
import { selectFile } from "../store"
import { EditorActivityState } from "../types"

import "../index.css"

export const EditorContext = createContext({} as EditorProps)

function Editor(props: EditorProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query] = useSearchParams()
  const dispatch = useAppDispatch()
  const Workspace = useWorkspaceWithSidebar()
  const association = useCurrentFileAssociation()

  const translatedTitle = t("@ordo-activity-editor/title")
  const translatedSaving = t("@ordo-activity-editor/saving")
  const translatedInitialFile = t("@ordo-activity-editor/initial-file")
  const translatedInitialFileName = t("@ordo-activity-editor/initial-file-name")

  const [Component, setComponent] = useState<Nullable<FC<Record<string, unknown>>>>(null)

  const editorSelector = useExtensionSelector<EditorActivityState>()

  const isSaving = useAppSelector((state) => state.app.isSaving)
  const tree = useAppSelector((state) => state.app.personalProject)
  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const currentFile = editorSelector((state) => state["ordo-activity-editor"]?.currentFile)

  useEffect(() => {
    if (!tree) return

    const queryPath = query.get("path")

    if (!queryPath) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props.persistedStore.get("recentFiles").then((recentFiles: any) => {
        if (!recentFiles || (!recentFiles[0] && !tree?.children.length)) {
          dispatch(
            createFile({
              file: OrdoFile.empty(`/${translatedInitialFileName}.md`),
              content: translatedInitialFile,
            }),
          )

          recentFiles = [`/${translatedInitialFileName}.md`]
        }

        const path = recentFiles[0]

        const extension = OrdoFile.getFileExtension(path)

        const pathAssociation = fileAssociations.find((assoc) =>
          assoc.fileExtensions.includes(extension),
        )
        const association = pathAssociation ? pathAssociation.name : "unsupported"

        const searchParams = createSearchParams({ path, association })

        return navigate({
          pathname: "/editor",
          search: searchParams.toString(),
        })
      })
    }

    if (!OrdoFile.isValidPath(queryPath)) {
      return navigate("/editor")
    }

    const file = findOrdoFile(queryPath, tree)

    if (file) {
      dispatch(selectFile(file))

      setComponent(
        Either.fromNullable(association).fold(
          () => () => FileNotSupported,
          ({ Component }) =>
            () =>
              Component as FC,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile, query, tree, fileAssociations, props.persistedStore])

  useEffect(() => {
    if (!currentFile || !tree || !dispatch) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props.persistedStore.get("recentFiles").then((recent: any) => {
      Switch.of(currentFile.path)
        .case(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (path: any) => !recent || recent.indexOf(path) === 0,
          () => void 0,
        )
        .case(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (path: any) => Boolean(recent) && (recent as string[]).includes(path),
          () => {
            const recentCopy = [...(recent as OrdoFilePath[])]

            recentCopy.splice(recentCopy.indexOf(currentFile.path), 1)
            props.persistedStore.set("recentFiles", [currentFile.path].concat(recentCopy))
          },
        )
        .default(() => {
          props.persistedStore.set(
            "recentFiles",
            [currentFile.path].concat(recent as OrdoFilePath[]),
          )
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile, tree, props.persistedStore])

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
          {Either.fromNullable(currentFile)
            .chain(() => Either.fromNullable(Component))
            .fold(
              () => (
                <FileNotSelected />
              ),
              (Component) => (
                <Component file={currentFile as IOrdoFile} />
              ),
            )}
        </div>

        <div
          className={`${
            isSaving ? "block" : "hidden"
          } fixed top-2 left-0 right-0 w-full opacity-50 flex items-center justify-center text-xs space-x-2 text-right md:pb-10`}
        >
          <AiOutlineLoading className="animate-spin" />
          <div>{translatedSaving}</div>
        </div>
      </Workspace>
    </EditorContext.Provider>
  )
}

export default memo(Editor, () => true)
