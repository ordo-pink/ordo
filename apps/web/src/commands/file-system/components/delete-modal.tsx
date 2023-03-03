import { Either } from "@ordo-pink/either"
import { lazyBox, stopPropagation, preventDefault } from "@ordo-pink/fns"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null } from "@ordo-pink/react-utils"
import { MouseEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkX, BsFolderX } from "react-icons/bs"
import DeleteModalButtonGroup from "./delete-modal-button-group"
import { useModal } from "../../../containers/app/hooks/use-modal"
import { OrdoFSEntity } from "../../../core/constants/ordo-fs-entity"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { hideDeleteModal } from "../store"
import { FileSystemExtensionStore } from "../types"

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

  const type = OrdoDirectory.isOrdoDirectory(target) ? OrdoFSEntity.DIRECTORY : OrdoFSEntity.FILE

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
        <div className="h-full flex items-center justify-center">
          <div
            onClick={handleModalClick}
            className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
            role="none"
          >
            <div className="flex flex-col items-center space-y-4">
              <Icon className="text-5xl shrink-0" />
              <div className=" break-inside-auto text-center">{translatedTitle}</div>
            </div>

            <DeleteModalButtonGroup path={t.path} />
          </div>
        </div>
      </Modal>
    ))
}
