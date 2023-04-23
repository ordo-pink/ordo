import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Null, useFileContentBlob } from "@ordo-pink/react-utils"
import { useState, useEffect } from "react"

type Props = {
  file: IOrdoFile
}

export default function RenderImage({ file }: Props) {
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

  return Either.fromNullable(url).fold(Null, (src) => (
    <img
      src={src}
      alt={file.readableName}
    />
  ))
}
