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
      <div className="p-4 w-full max-w-6xl">
        <div className="w-full h-screen flex flex-col items-center">
          <img
            className="shadow-lg"
            title={file.path}
            src={url}
            alt={file.readableName}
          />
        </div>
      </div>
    ))
}
