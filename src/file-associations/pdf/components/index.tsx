import { OrdoFilePath } from "@ordo-pink/core"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { EditorActivityState } from "$activities/editor/types"

import EditorPage from "$core/components/editor-page/editor-page"
import Loading from "$core/components/loading"
import { useFileParentBreadcrumbs } from "$core/hooks/use-file-breadcrumbs"
import { useFSAPI } from "$core/hooks/use-fs-api"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"

export default function PDFViewer() {
  const editorSelector = useExtensionSelector<EditorActivityState>()

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const { files } = useFSAPI()
  const [query] = useSearchParams()
  const breadcrumbsPath = useFileParentBreadcrumbs()

  const [content, setContent] = useState("")

  const path = query.get("path") as OrdoFilePath

  useEffect(() => {
    if (!path) return

    files.getBlob(path).then(URL.createObjectURL).then(setContent)

    return () => {
      URL.revokeObjectURL(content)
    }
  }, [path, files, content])

  return Either.fromNullable(content)
    .chain(() => Either.fromNullable(currentFile))
    .fold(Loading, (file) => (
      <EditorPage
        title={file.readableName}
        breadcrumbsPath={breadcrumbsPath}
      >
        <iframe
          className="w-full h-screen"
          title={file.path}
          src={content}
        />
      </EditorPage>
    ))
}
