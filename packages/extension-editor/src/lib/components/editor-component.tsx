import { IOrdoFile, Nullable, OrdoFilePath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  Null,
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

  const [currentFile, setCurrentFile] = useState<Nullable<IOrdoFile>>(null)

  const currentFileAssociation = useCurrentFileAssociation()

  // TODO: NotSupported component
  const [Component, setComponent] = useState<ComponentType<{ file: IOrdoFile }>>(() => () => null)

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

  return Either.fromNullable(currentFile).fold(Null, (file) => <Component file={file} />)
}
