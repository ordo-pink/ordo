import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Loading, useFileContentBlob } from "@ordo-pink/react-utils"
import { useEffect, useState } from "react"

type Props = {
  file: IOrdoFile
}

export default function PDFViewer({ file }: Props) {
  const content = useFileContentBlob(file)

  const [url, setUrl] = useState<Nullable<string>>(null)

  useEffect(() => {
    if (!content) return

    const objectUrl = URL.createObjectURL(content)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
      setUrl(null)
    }
  }, [file.path, content])

  return Either.fromNullable(url).fold(Loading, (url) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="w-full flex-grow max-w-4xl">
        <iframe
          className="w-full h-full"
          title={file.path}
          src={url}
        />
      </div>
    </div>
  ))
}
