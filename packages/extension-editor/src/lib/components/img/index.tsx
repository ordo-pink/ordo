import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Loading, useFileContentBlob } from "@ordo-pink/react-utils"
import { useEffect, useState } from "react"

type Props = {
  file: IOrdoFile
}

export default function ImgViewer({ file }: Props) {
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
      <div className="h-full flex justify-center items-center">
        <div className="max-w-4xl">
          <img
            className="shadow-xl rounded-lg"
            title={file.path}
            src={url}
            alt={file.readableName}
          />
        </div>
      </div>
    ))
}
