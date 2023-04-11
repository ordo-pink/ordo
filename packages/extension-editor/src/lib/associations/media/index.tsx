import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Loading, useFileContentBlob } from "@ordo-pink/react-utils"
import { useEffect, useState } from "react"

type Props = {
  file: IOrdoFile
}

export default function MediaViewer({ file }: Props) {
  const content = useFileContentBlob(file)

  const [url, setUrl] = useState<Nullable<string>>(null)

  useEffect(() => {
    if (!content) {
      if (url) {
        URL.revokeObjectURL(url)
        setUrl(null)
      }

      return
    }

    const objectUrl = URL.createObjectURL(content)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
      setUrl(null)
    }
  }, [file, content])

  return Either.fromNullable(content)
    .chain(() => Either.fromNullable(url))
    .fold(Loading, (url) => (
      <div className="h-full flex justify-center items-center p-4">
        <div className="max-w-4xl">
          {content?.type.startsWith("video") ? (
            <video
              controls
              className="shadow-xl rounded-lg"
            >
              <source
                src={url}
                type={content?.type}
              />
              <track
                kind="captions"
                src={file.path}
              />
            </video>
          ) : (
            <audio
              controls
              className="w-full mt-10 ml-5 mr-5"
              src={url}
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
