import { Either } from "@ordo-pink/either"
import { lazyBox, stopPropagation, preventDefault } from "@ordo-pink/fns"
import { OrdoFilePath, OrdoDirectory, OrdoFile, OrdoDirectoryPath } from "@ordo-pink/fs-entity"
import { Null, OrdoButtonPrimary, OrdoButtonSecondary, PathBreadcrumbs } from "@ordo-pink/react"
import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkPlus, BsFolderPlus } from "react-icons/bs"
import { createSearchParams, useNavigate } from "react-router-dom"
import { useModal } from "../../../containers/app/hooks/use-modal"
import { moveFile, moveDirectory } from "../../../containers/app/store"
import { OrdoFSEntity } from "../../../core/constants/ordo-fs-entity"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { hideRenameModal } from "../store"
import { FileSystemExtensionStore } from "../types"

export default function RenameModal() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { showModal, Modal } = useModal()

  const fsSelector = useExtensionSelector<FileSystemExtensionStore>()

  const isShown = fsSelector((state) => state["ordo-command-file-system"].isRenameModalShown)
  const parent = fsSelector((state) => state["ordo-command-file-system"].parent)
  const openOnRename = fsSelector((state) => state["ordo-command-file-system"].openOnRename)
  const type = fsSelector((state) => state["ordo-command-file-system"].entityType)
  const target = fsSelector((state) => state["ordo-command-file-system"].target)

  const { t } = useTranslation()

  const translatedTitle = t(`@ordo-command-file-system/rename-${type}`)
  const translatedPlaceholder = t(`@ordo-command-file-system/placeholder`) ?? ""
  const translatedError = t("@ordo-command-file-system/invalid-path")
  const translatedCancel = t("@ordo-command-file-system/button-cancel")
  const translatedOk = t("@ordo-command-file-system/button-ok")

  const [newName, setNewName] = useState("")
  const [isValidPath, setIsValidPath] = useState(true)

  useEffect(() => {
    if (target && target.readableName) {
      setNewName(target.readableName)
    }
  }, [target])

  useEffect(() => {
    const isDirectory = type === OrdoFSEntity.DIRECTORY
    const trimmed = newName.trim()

    setIsValidPath(
      trimmed.length > 1 && isDirectory
        ? OrdoDirectory.isValidPath(`/${trimmed}/`)
        : OrdoFile.isValidPath(`/${trimmed}`),
    )
  }, [newName, translatedError, type])

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const Icon = type === "file" ? BsFileEarmarkPlus : BsFolderPlus

  const handleHide = lazyBox((box) =>
    box.map(() => setNewName("")).fold(() => dispatch(hideRenameModal())),
  )

  const handleInputChange = lazyBox<ChangeEvent<HTMLInputElement>>((box) =>
    box
      .map((event) => event.target)
      .map((target) => target.value as OrdoFilePath)
      .fold(setNewName),
  )

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const handleCancelButtonClick = lazyBox((box) =>
    box.tap(handleHide).fold(() => dispatch(hideRenameModal())),
  )

  const handleOkButtonClick = lazyBox((box) =>
    box
      .tap(handleHide)
      .map(() =>
        Either.fromBoolean(type === OrdoFSEntity.DIRECTORY)
          .bimap(
            () => `${parent?.path ?? "/"}${newName.trim()}` as OrdoFilePath,
            () => `${parent?.path ?? "/"}${newName.trim()}/` as OrdoDirectoryPath,
          )
          .leftMap((path) =>
            OrdoFile.getFileExtension(path) ? path : (`${path}.md` as OrdoFilePath),
          )
          .fold(
            (newPath) => {
              dispatch(moveFile({ oldPath: target?.path as OrdoFilePath, newPath })).then(() => {
                if (!openOnRename) return

                navigate({
                  pathname: "/editor",
                  search: createSearchParams({ path: newPath }).toString(),
                })
              })
            },
            (newPath) =>
              dispatch(moveDirectory({ oldPath: target?.path as OrdoDirectoryPath, newPath })),
          ),
      )
      .fold(() => dispatch(hideRenameModal())),
  )

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal onHide={handleHide}>
      <div className="h-full flex items-center justify-center">
        <div
          onClick={handleModalClick}
          className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
          role="none"
        >
          <div className="flex items-center space-x-4 text-xl">
            <Icon className="shrink-0" />
            <div>{translatedTitle}</div>
          </div>

          <PathBreadcrumbs path={parent ? parent.path : "/"} />

          <input
            type="text"
            className="w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2"
            autoFocus
            placeholder={translatedPlaceholder}
            value={newName}
            onChange={handleInputChange}
          />

          <div
            className={`text-red-500 text-sm transition-opacity duration-200 ${
              newName && !isValidPath ? "opacity-100" : "opacity-0"
            }`}
          >
            {translatedError}
          </div>

          <div className="w-full flex items-center justify-around">
            <OrdoButtonSecondary
              hotkey="escape"
              onClick={handleCancelButtonClick}
            >
              {translatedCancel}
            </OrdoButtonSecondary>

            <OrdoButtonPrimary
              hotkey="enter"
              disabled={!newName || !isValidPath}
              onClick={handleOkButtonClick}
            >
              {translatedOk}
            </OrdoButtonPrimary>
          </div>
        </div>
      </div>
    </Modal>
  ))
}
