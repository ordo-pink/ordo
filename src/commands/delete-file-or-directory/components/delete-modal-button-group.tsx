import { useTranslation } from "react-i18next"

import { hideDeleteModal } from "$commands/delete-file-or-directory/store"
import { AppSelectorExtension } from "$commands/delete-file-or-directory/types"

import { removedFile, removedDirectory } from "$containers/app/store"

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$core/components/buttons"
import { isOrdoDirectory } from "$core/guards/is-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { lazyBox } from "$core/utils/lazy-box"

type Props = {
  path: string
}

export default function DeleteModalButtonGroup({ path }: Props) {
  const dispatch = useAppDispatch()

  const target = useAppSelector<AppSelectorExtension, Nullable<OrdoFile | OrdoDirectory>>(
    (state) => state["ordo-command-delete-file-or-directory"].target,
  )

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

  const translatedCancel = t("@ordo-command-delete-file-or-directory/button-cancel")
  const translatedOk = t("@ordo-command-delete-file-or-directory/button-ok")

  return (
    <div className="delete-file-or-directory-modal_button-group">
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
