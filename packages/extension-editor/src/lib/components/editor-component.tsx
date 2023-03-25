import { CommandContext, IOrdoFile, Nullable, OrdoFilePath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  Null,
  useCommands,
  useCurrentFileAssociation,
  useDrive,
  useFsDriver,
  useRouteParams,
} from "@ordo-pink/react-utils"
import { ComponentType, useEffect, useState } from "react"

// TODO: NotSelected component
export default function Editor() {
  const params = useRouteParams()
  const fsDriver = useFsDriver()
  const drive = useDrive()
  const { after, emit, off } = useCommands()

  const currentFileAssociation = useCurrentFileAssociation()

  const handleAfterRemoveFile = ({ payload }: CommandContext<IOrdoFile>) => {
    if (!params || !params["filePath*"] || payload.path !== params["filePath*"]) return

    emit("router.navigate", "/editor")
  }

  useEffect(() => {
    after("fs.remove-file", handleAfterRemoveFile)

    return () => {
      off("fs")("remove-file", handleAfterRemoveFile)
    }
  }, [params])

  // TODO: Fix updating route params
  // TODO: NotSupported component
  const [Component, setComponent] = useState<ComponentType<{ file: IOrdoFile }>>(() => () => null)
  const [currentFile, setCurrentFile] = useState<Nullable<IOrdoFile>>(null)

  useEffect(() => {
    // TODO: Remove * from dynamic param
    if (!params || !fsDriver || !params["filePath*"] || !drive) return

    const file = OrdoDirectory.findFileDeep(params["filePath*"] as OrdoFilePath, drive.root)

    if (!file) return

    setCurrentFile(file)

    if (currentFileAssociation) {
      setComponent(currentFileAssociation.Component)
    }
  }, [params?.["filePath*"], currentFileAssociation, drive, fsDriver])

  return Either.fromNullable(params)
    .chain(() => Either.fromNullable(currentFile))
    .fold(Null, (file) => <Component file={file} />)
}
