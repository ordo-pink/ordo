import { CommandContext, IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  Loading,
  Null,
  useCommands,
  useCurrentFileAssociation,
  useDrive,
  useFsDriver,
  useRouteParams,
} from "@ordo-pink/react-utils"
import { ComponentType, Suspense, useEffect, useState } from "react"

// TODO: NotSelected component
export default function Editor() {
  const { filePath } = useRouteParams<"filePath">()
  const fsDriver = useFsDriver()
  const drive = useDrive()
  const { after, emit, off } = useCommands()

  const currentFileAssociation = useCurrentFileAssociation()

  const handleAfterRemoveFile = ({ payload }: CommandContext<IOrdoFile>) => {
    if (!filePath || payload.path !== `/${filePath}`) return

    emit("router.navigate", "/editor")
  }

  useEffect(() => {
    after("fs.remove-file", handleAfterRemoveFile)

    return () => {
      off("fs")("remove-file", handleAfterRemoveFile)
    }
  }, [filePath])

  // TODO: Fix updating route params
  // TODO: NotSupported component
  // TODO: Provide updateFile and getFile functions via props
  const [Component, setComponent] = useState<ComponentType<{ file: IOrdoFile }>>(() => () => null)
  const [currentFile, setCurrentFile] = useState<Nullable<IOrdoFile>>(null)

  useEffect(() => {
    // TODO: Remove * from dynamic param
    if (!filePath || !fsDriver || !drive) return

    const file = OrdoDirectory.findFileDeep(`/${filePath}`, drive.root)

    if (!file) return

    setCurrentFile(file)

    if (currentFileAssociation) {
      setComponent(currentFileAssociation.Component)
    }
  }, [filePath, currentFileAssociation, drive, fsDriver])

  return Either.fromNullable(filePath)
    .chain(() => Either.fromNullable(currentFile))
    .fold(Null, (file) => (
      <Suspense fallback={<Loading />}>
        <Component file={file} />
      </Suspense>
    ))
}
