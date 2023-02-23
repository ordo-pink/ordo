import { OrdoDirectory, OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/core"
import { useTranslation } from "react-i18next"

import { hideDeleteModal } from "$commands/file-system/store"
import { FileSystemExtensionStore } from "$commands/file-system/types"

import { removedFile, removedDirectory } from "$containers/app/store"

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$core/components/buttons"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { lazyBox } from "$core/utils/lazy-box"

type Props = {
  path: OrdoDirectoryPath | OrdoFilePath
}

export default function DeleteModalButtonGroup({ path }: Props) {
  const dispatch = useAppDispatch()

  const fsSelector = useExtensionSelector<FileSystemExtensionStore>()

  const target = fsSelector((state) => state["ordo-command-file-system"].target)

  const handleCancelButtonClick = lazyBox((box) => box.fold(() => dispatch(hideDeleteModal())))

  const handleOkButtonClick = lazyBox((box) =>
    box
      .map(() => OrdoDirectory.isOrdoDirectory(target))
      .map((isDirectory) =>
        Either.fromBoolean(isDirectory).fold(
          () => dispatch(removedFile(path)),
          () => dispatch(removedDirectory(path as OrdoDirectoryPath)),
        ),
      )
      .fold(() => dispatch(hideDeleteModal())),
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
