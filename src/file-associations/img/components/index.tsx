import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import EditorPage from "$activities/editor/components/editor-page"
import { selectFile } from "$activities/editor/store"
import { EditorExtensionStore } from "$activities/editor/types"

import Loading from "$core/components/loading"
import { useFSAPI } from "$core/hooks/use-fs-api"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { findOrdoFile, getParentPath } from "$core/utils/fs-helpers"

export default function ImgEditor() {
  const dispatch = useAppDispatch()
  const editorSelector = useExtensionSelector<EditorExtensionStore>()

  const tree = useAppSelector((state) => state.app.personalProject)
  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const [content, setContent] = useState("")

  const { files } = useFSAPI()

  const [query] = useSearchParams()
  const path = query.get("path")
  const breadcrumbsPath = getParentPath(path ?? "/")

  useEffect(() => {
    if (!path || !files || !tree) return

    files
      .getRaw(path)
      .then((res) => res.blob())
      .then((payload) => {
        const file = findOrdoFile(path, tree)

        if (file) {
          dispatch(selectFile(file))
        }

        const url = URL.createObjectURL(payload)
        setContent(url)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, files])

  return Either.fromNullable(content)
    .chain(() => Either.fromNullable(currentFile))
    .fold(Loading, (file) => (
      <EditorPage
        title={file.readableName}
        breadcrumbsPath={breadcrumbsPath}
      >
        <img
          className="shadow-lg"
          title={file.path}
          src={content}
          alt={file.readableName}
        />
      </EditorPage>
    ))
}
