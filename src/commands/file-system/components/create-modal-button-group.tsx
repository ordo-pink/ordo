import { useTranslation } from "react-i18next"

import { hideCreateModal } from "$commands/file-system/store"
import { FileSystemExtensionStore } from "$commands/file-system/types"

import { createdDirectory, createdFile } from "$containers/app/store"

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$core/components/buttons"
import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { ThunkFn } from "$core/types"
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
    () => root?.path ?? "",
    (p) => p.path,
  )

  const newPath = `${parentPath}/${newName}`

  const handleCancelButtonClick = lazyBox((box) =>
    box.tap(onAction).fold(() => dispatch(hideCreateModal())),
  )

  const handleOkButtonClick = lazyBox((box) =>
    box
      .map(() => type === OrdoFSEntity.DIRECTORY)
      .map((isDirectory) =>
        Either.fromBoolean(isDirectory).fold(
          () => createdFile,
          () => createdDirectory,
        ),
      )
      .tap(onAction)
      .map((f) => dispatch(f(newPath) as ReturnType<typeof createdDirectory>))
      .fold(() => dispatch(hideCreateModal())),
  )

  const { t } = useTranslation()

  const translatedCancel = t("@ordo-command-file-system/button-cancel")
  const translatedOk = t("@ordo-command-file-system/button-ok")

  return (
    <div className="file-system-modal_button-group">
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
