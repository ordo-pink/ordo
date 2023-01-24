import { MouseEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkX, BsFolderX } from "react-icons/bs"

import CreateModalButtonGroup from "$commands/file-system/components/delete-modal-button-group"
import { hideDeleteModal } from "$commands/file-system/store"

import { FileSystemExtensionStore } from "$commands/file-system/types"
import { useModal } from "$containers/app/hooks/use-modal"

import Null from "$core/components/null"
import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import { isOrdoDirectory } from "$core/guards/is-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

import "$commands/file-system/index.css"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const fsSelector = useExtensionSelector<FileSystemExtensionStore>()

  const isShown = fsSelector((state) => state["ordo-command-file-system"].isDeleteModalShown)
  const target = fsSelector((state) => state["ordo-command-file-system"].target)

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const type = isOrdoDirectory(target) ? OrdoFSEntity.DIRECTORY : OrdoFSEntity.FILE

  const Icon = type === "file" ? BsFileEarmarkX : BsFolderX

  const handleHide = lazyBox((box) => box.map(() => "").fold(() => dispatch(hideDeleteModal())))

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const { t } = useTranslation()

  const translatedTitle = t(`@ordo-command-file-system/delete-confirmation`, {
    path: target?.path,
  })

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(target))
    .fold(Null, (t) => (
      <Modal onHide={handleHide}>
        <div className="file-system_delete-overlay">
          <div
            onClick={handleModalClick}
            className="file-system_delete-modal"
            role="none"
          >
            <div className="file-system_delete-modal_title">
              <Icon className="text-5xl shrink-0" />
              <div>{translatedTitle}</div>
            </div>

            <CreateModalButtonGroup path={t.path} />
          </div>
        </div>
      </Modal>
    ))
}
