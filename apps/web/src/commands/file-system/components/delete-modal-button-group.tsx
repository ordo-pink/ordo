import { Either } from "@ordo-pink/either"
import { lazyBox } from "@ordo-pink/fns"
import { OrdoDirectoryPath, OrdoFilePath, OrdoDirectory } from "@ordo-pink/fs-entity"
import { useTranslation } from "react-i18next"
import { removedFile, removedDirectory } from "../../../containers/app/store"
import { OrdoButtonSecondary, OrdoButtonPrimary } from "../../../core/components/buttons"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { hideDeleteModal } from "../store"
import { FileSystemExtensionStore } from "../types"

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
