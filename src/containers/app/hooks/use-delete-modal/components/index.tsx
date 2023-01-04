import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BsFileMinus, BsFolderMinus } from "react-icons/bs"

import { hideDeleteModal } from "$containers/app/hooks/use-delete-modal/store"
import { useModal } from "$containers/app/hooks/use-modal"
import { removedDirectory, removedFile } from "$containers/app/store"

import { OrdoButtonPrimary, OrdoButtonSecondary } from "$core/components/buttons"
import Null from "$core/components/null"
import { isDirectory } from "$core/guards/is-directory"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"

export default function DeleteModal() {
  const dispatch = useAppDispatch()

  const isShown = useAppSelector((state) => state.deleteModal.isShown)
  const target = useAppSelector((state) => state.deleteModal.target)

  const { t } = useTranslation()

  const { showModal, Modal } = useModal()

  const type = isDirectory(target) ? "directory" : "file"

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const Icon = Either.fromNullable(target)
    .map((fileOrDirectory) =>
      Either.fromBoolean(isDirectory(fileOrDirectory)).fold(
        () => BsFileMinus,
        () => BsFolderMinus,
      ),
    )
    .fold(
      () => Null,
      (x) => x,
    )

  const hide = () => {
    dispatch(hideDeleteModal())
  }

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(target))
    .fold(Null, (item) => (
      <Modal onHide={hide}>
        <div className="h-full flex items-center justify-center">
          <div
            onClick={(event) => event.stopPropagation()}
            className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
            role="none"
          >
            <div className="flex items-center space-x-4">
              <Icon className="shrink-0" />
              <div className="">{t(`@ordo-activity-editor/delete-${type}`)}</div>
            </div>

            <div className="w-full flex items-center justify-around">
              <OrdoButtonSecondary
                hotkey="escape"
                onClick={() => void dispatch(hideDeleteModal())}
              >
                {t("@ordo-activity-editor/cancel")}
              </OrdoButtonSecondary>

              <OrdoButtonPrimary
                onClick={() => {
                  type === "directory"
                    ? dispatch(removedDirectory(item.path))
                    : dispatch(removedFile(item.path))

                  dispatch(hideDeleteModal())
                }}
                hotkey="enter"
              >
                {t("@ordo-activity-editor/ok")}
              </OrdoButtonPrimary>
            </div>
          </div>
        </div>
      </Modal>
    ))
}
