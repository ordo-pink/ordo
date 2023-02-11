import { OrdoDirectoryPath, OrdoFilePath, ThunkFn } from "@ordo-pink/core"
import { useTranslation } from "react-i18next"

import { hideCreateModal } from "$commands/file-system/store"
import { FileSystemExtensionStore } from "$commands/file-system/types"

import { createdDirectory, createFile } from "$containers/app/store"

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$core/components/buttons"
import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { lazyBox } from "$core/utils/lazy-box"

type Props = {
  newName: string
  onAction: ThunkFn<void>
}

export default function CreateModalButtonGroup({ newName, onAction }: Props) {
  const dispatch = useAppDispatch()

  const fileSystemCommandsSelector = useExtensionSelector<FileSystemExtensionStore>()

  const root = useAppSelector((state) => state.app.personalProject)

  const type = fileSystemCommandsSelector((state) => state["ordo-command-file-system"].entityType)
  const parent = fileSystemCommandsSelector((state) => state["ordo-command-file-system"].parent)

  const parentPath = Either.fromNullable(parent).fold(
    () => root?.raw.path ?? "",
    (p) => p.raw.path,
  )

  const newPath = `${parentPath}/${newName}`

  const handleCancelButtonClick = lazyBox((box) =>
    box.tap(onAction).fold(() => dispatch(hideCreateModal())),
  )

  const handleOkButtonClick = lazyBox((box) =>
    box
      .map(() => type === OrdoFSEntity.DIRECTORY)
      .tap(onAction)
      .map((isDirectory) =>
        Either.fromBoolean(isDirectory).fold(
          () => dispatch(createFile({ path: newPath as OrdoFilePath })),
          () => dispatch(createdDirectory(newPath as OrdoDirectoryPath)),
        ),
      )
      .fold(() => dispatch(hideCreateModal())),
  )

  const { t } = useTranslation()

  const translatedCancel = t("@ordo-command-file-system/button-cancel")
  const translatedOk = t("@ordo-command-file-system/button-ok")

  return (
    <div className="w-full flex items-center justify-around">
      <OrdoButtonSecondary
        hotkey="escape"
        onClick={handleCancelButtonClick}
      >
        {translatedCancel}
      </OrdoButtonSecondary>

      <OrdoButtonPrimary
        hotkey="enter"
        onClick={handleOkButtonClick}
      >
        {translatedOk}
      </OrdoButtonPrimary>
    </div>
  )
}
