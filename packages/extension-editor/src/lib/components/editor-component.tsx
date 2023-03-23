import { IOrdoFile, Nullable, OrdoFilePath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  Null,
  useDrive,
  useFsDriver,
  useRouteParams,
  useSubscription,
} from "@ordo-pink/react-utils"
import { fileAssociations$ } from "@ordo-pink/stream-file-associations"
import { ComponentType, useEffect, useState } from "react"
import { currentFileAssociation$ } from ".."

// TODO: NotSelected component
export default function Editor() {
  const params = useRouteParams()
  const fsDriver = useFsDriver()
  const drive = useDrive()

  const fileAssociations = useSubscription(fileAssociations$)

  const [currentFile, setCurrentFile] = useState<Nullable<IOrdoFile>>(null)

  // TODO: NotSupported component
  const [Component, setComponent] = useState<ComponentType<{ file: IOrdoFile }>>(() => () => null)

  useEffect(() => {
    // TODO: Remove * from dynamic param
    if (!params || !fsDriver || !params["filePath*"] || !fileAssociations || !drive) return

    const file = OrdoDirectory.findFileDeep(params["filePath*"] as OrdoFilePath, drive.root)

    if (!file) return

    setCurrentFile(file)

    const association = fileAssociations.find((association) =>
      association.fileExtensions.includes(file.extension),
    )

    if (association) {
      currentFileAssociation$.next(association)
      setComponent(association.Component)
    }
  }, [params?.["filePath*"], fileAssociations, drive, fsDriver])

  return Either.fromNullable(currentFile).fold(Null, (file) => <Component file={file} />)
}
