import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import EditorPage from "$activities/editor/components/editor-page"
import { selectFile } from "$activities/editor/store"
import { EditorExtensionStore } from "$activities/editor/types"

import Null from "$core/components/null"
import { useFSAPI } from "$core/hooks/use-fs-api"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { findOrdoFile, getParentPath } from "$core/utils/fs-helpers"

export default function ImgEditor() {
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalProject)
  const [content, setContent] = useState("")
  const imageRef = useRef<HTMLImageElement>(null)
  const editorSelector = useExtensionSelector<EditorExtensionStore>()

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)
  const [query] = useSearchParams()

  const path = query.get("path")
  const breadcrumbsPath = getParentPath(path ?? "/")
  const { files } = useFSAPI()

  useEffect(() => {
    if (!path || !files || !tree || !imageRef || !imageRef.current) return

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
    .fold(Null, (file) => (
      <EditorPage
        title=""
        breadcrumbsPath={breadcrumbsPath}
      >
        <img
          src={content}
          ref={imageRef}
          alt={file.readableName}
        ></img>
      </EditorPage>
    ))
}
