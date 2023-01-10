import { MouseEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkX, BsFolderX } from "react-icons/bs"

import CreateModalButtonGroup from "$commands/delete-file-or-directory/components/delete-modal-button-group"
import { hideDeleteModal } from "$commands/delete-file-or-directory/store"
import { AppSelectorExtension } from "$commands/delete-file-or-directory/types"

import { useModal } from "$containers/app/hooks/use-modal"

import Null from "$core/components/null"
import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import { isDirectory } from "$core/guards/is-directory"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

import "$commands/delete-file-or-directory/index.css"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const isShown = useAppSelector<AppSelectorExtension, boolean>(
    (state) => state["ordo-command-delete-file-or-directory"].isShown,
  )

  const target = useAppSelector<AppSelectorExtension, Nullable<OrdoFile | OrdoDirectory>>(
    (state) => state["ordo-command-delete-file-or-directory"].target,
  )

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const type = isDirectory(target) ? OrdoFSEntity.DIRECTORY : OrdoFSEntity.FILE

  const Icon = type === "file" ? BsFileEarmarkX : BsFolderX

  const handleHide = lazyBox((box) => box.map(() => "").fold(() => dispatch(hideDeleteModal())))

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const { t } = useTranslation()

  const translatedTitle = t(`@ordo-command-delete-file-or-directory/delete-confirmation`, {
    path: target?.path,
  })

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(target))
    .fold(Null, (t) => (
      <Modal onHide={handleHide}>
        <div className="delete-file-or-directory-overlay">
          <div
            onClick={handleModalClick}
            className="delete-file-or-directory-modal"
            role="none"
          >
            <div className="delete-file-or-directory-modal_title">
              <Icon className="text-5xl shrink-0" />
              <div>{translatedTitle}</div>
            </div>

            <CreateModalButtonGroup path={t.path} />
          </div>
        </div>
      </Modal>
    ))
}
