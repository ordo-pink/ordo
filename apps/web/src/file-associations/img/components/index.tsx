import { Either } from "@ordo-pink/either"
import { Loading, PathBreadcrumbs } from "@ordo-pink/react"
import { useEffect, useState } from "react"
import { ImgProps } from ".."
import { useFileParentBreadcrumbs } from "../../../core/hooks/use-file-breadcrumbs"
import { useFSAPI } from "../../../core/hooks/use-fs-api"

export default function ImgViewer({ file }: ImgProps) {
  const breadcrumbsPath = useFileParentBreadcrumbs()
  const { files } = useFSAPI()

  const [content, setContent] = useState("")

  useEffect(() => {
    files.getBlob(file.path).then(URL.createObjectURL).then(setContent)

    return () => {
      URL.revokeObjectURL(content)
      setContent("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.path, files])

  return Either.fromBoolean(Boolean(content)).fold(Loading, () => (
    <div className="p-4 w-full max-w-6xl">
      <div className="mb-8">
        <PathBreadcrumbs path={breadcrumbsPath} />

        <h1 className="text-3xl font-black">{file.readableName}</h1>
      </div>

      <div className="w-full h-screen flex flex-col items-center">
        <img
          className="shadow-lg"
          title={file.path}
          src={content}
          alt={file.readableName}
        />
      </div>
    </div>
  ))
}
