import { useTranslation } from "react-i18next"

import { hideDeleteModal } from "$commands/file-system/store"
import { FileSystemExtensionStore } from "$commands/file-system/types"

import { removedFile, removedDirectory } from "$containers/app/store"

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$core/components/buttons"
import { isOrdoDirectory } from "$core/guards/is-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { lazyBox } from "$core/utils/lazy-box"

type Props = {
  path: string
}

export default function DeleteModalButtonGroup({ path }: Props) {
  const dispatch = useAppDispatch()

  const fsSelector = useExtensionSelector<FileSystemExtensionStore>()

  const target = fsSelector((state) => state["ordo-command-file-system"].target)

  const handleCancelButtonClick = lazyBox((box) => box.fold(() => dispatch(hideDeleteModal())))

  const handleOkButtonClick = lazyBox((box) =>
    box
      .map(() => isOrdoDirectory(target))
      .map((isDire) =>
        Either.fromBoolean(isDire).fold(
          () => removedFile,
          () => removedDirectory,
        ),
      )
      .map((f) => dispatch(f(path) as ReturnType<typeof removedDirectory>))
      .fold(() => dispatch(hideDeleteModal())),
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
