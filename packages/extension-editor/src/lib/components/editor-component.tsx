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
import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"

// TODO: NotSelected component
export default function Editor() {
  const { filePath } = useRouteParams<"filePath">()
  const fsDriver = useFsDriver()
  const drive = useDrive()
  const { after, emit, off } = useCommands()
  const { t } = useTranslation("editor")

  const currentFileAssociation = useCurrentFileAssociation()

  // TODO: Fix updating route params
  // TODO: NotSupported component
  // TODO: Provide updateFile and getFile functions via props
  const [Component, setComponent] = useState<ComponentType<{ file: IOrdoFile }>>(() => () => null)
  const [currentFile, setCurrentFile] = useState<Nullable<IOrdoFile>>(null)

  useEffect(() => {
    const handleAfterRemoveFile = ({ payload }: CommandContext<IOrdoFile>) => {
      if (!filePath || payload.path !== `/${filePath}`) return

      emit("router.navigate", "/editor")
    }

    after("fs.remove-file", handleAfterRemoveFile)

    return () => {
      off("fs")("remove-file", handleAfterRemoveFile)
    }
  }, [filePath])

  useEffect(() => {
    if (!filePath || !fsDriver || !drive) return

    const file = OrdoDirectory.findFileDeep(`/${filePath}`, drive.root)

    if (!file) return

    setCurrentFile(file)

    if (currentFileAssociation) {
      setComponent(currentFileAssociation.Component)
    }
  }, [filePath, currentFileAssociation, drive, fsDriver])

  const tEditor = t("editor")

  return Either.fromNullable(filePath)
    .chain(() => Either.fromNullable(currentFile))
    .fold(Null, (file) => (
      <Suspense fallback={<Loading />}>
        <Helmet title={`${file.readableName}${file.extension} (${tEditor})`} />
        <Component file={file} />
      </Suspense>
    ))
}
