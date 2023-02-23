import { useEffect, useState } from "react"

import { useIsVideo } from "./use-is-video"
import { MediaProps } from ".."
import Loading from "$core/components/loading"
import PathBreadcrumbs from "$core/components/path-breadcrumbs"
import { useFileParentBreadcrumbs } from "$core/hooks/use-file-breadcrumbs"
import { useFSAPI } from "$core/hooks/use-fs-api"
import { Either } from "$core/utils/either"

export default function MediaViewer({ file }: MediaProps) {
  const breadcrumbsPath = useFileParentBreadcrumbs()
  const { files } = useFSAPI()

  const [content, setContent] = useState("")

  const isVideo = useIsVideo(content)

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
        {isVideo ? (
          <video
            controls
            className="w-full"
          >
            <source src={content} />
            <track
              kind="captions"
              src={file.path}
            />
          </video>
        ) : (
          <audio
            controls
            className="w-full"
            src={content}
          >
            <track
              kind="captions"
              src={file.path}
            />
          </audio>
        )}
      </div>
    </div>
  ))
}
