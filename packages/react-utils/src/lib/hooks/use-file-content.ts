import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { useEffect, useState } from "react"
import { useFsDriver } from "./use-fs"

export const useFileContentRaw = (file: IOrdoFile) => {
  const driver = useFsDriver()

  const [content, setContent] = useState<Nullable<Response>>(null)

  useEffect(() => {
    if (!driver) return

    driver.files.getContent(file.path).then(setContent)
  }, [driver, file])

  return content
}

export const useFileContentBlob = (file: IOrdoFile) => {
  const driver = useFsDriver()

  const [content, setContent] = useState<Nullable<Blob>>(null)

  useEffect(() => {
    if (!driver) return

    driver.files
      .getContent(file.path)
      .then((res) => res.blob())
      .then(setContent)
  }, [driver, file])

  return content
}

export const useFileContentText = (file: IOrdoFile) => {
  const response = useFileContentRaw(file)

  const [content, setContent] = useState<Nullable<string>>(null)
  // const { after, off } = useCommands()

  // useEffect(() => {
  //   const handleUpdateFileContent = ({
  //     payload,
  //   }: CommandContext<{ file: IOrdoFile; content: string }>) => {
  //     setContent(payload.content)
  //   }

  //   after("fs.update-file-content.complete", handleUpdateFileContent)

  //   return () => {
  //     off("fs")("update-file-content.complete", handleUpdateFileContent)
  //   }
  // }, [after, off])

  useEffect(() => {
    if (!response) return

    response
      .clone()
      .text()
      .then((value) => {
        setContent(value)
      })
  }, [response, file])

  return content
}

export const useFileContentJSON = (file: IOrdoFile) => {
  const response = useFileContentRaw(file)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<Nullable<any>>(null)

  useEffect(() => {
    if (!response) return

    response.clone().json().then(setContent)
  }, [response, file])

  return content
}
