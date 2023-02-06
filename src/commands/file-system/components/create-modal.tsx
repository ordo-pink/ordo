import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkPlus, BsFolderPlus } from "react-icons/bs"

import CreateModalButtonGroup from "$commands/file-system/components/create-modal-button-group"
import { hideCreateModal } from "$commands/file-system/store"
import { FileSystemExtensionStore } from "$commands/file-system/types"

import { useModal } from "$containers/app/hooks/use-modal"

import Null from "$core/components/null"
import PathBreadcrumbs from "$core/components/path-breadcrumbs"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const fsSelector = useExtensionSelector<FileSystemExtensionStore>()

  const isShown = fsSelector((state) => state["ordo-command-file-system"].isCreateModalShown)
  const parent = fsSelector((state) => state["ordo-command-file-system"].parent)
  const type = fsSelector((state) => state["ordo-command-file-system"].entityType)

  const [newName, setNewName] = useState("")

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const Icon = type === "file" ? BsFileEarmarkPlus : BsFolderPlus

  const handleHide = lazyBox((box) =>
    box
      .map(() => "")
      .map(setNewName)
      .fold(() => dispatch(hideCreateModal())),
  )

  const handleInputChange = lazyBox<ChangeEvent<HTMLInputElement>>((box) =>
    box
      .map((event) => event.target)
      .map((target) => target.value)
      .fold(setNewName),
  )

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const { t } = useTranslation()

  const translatedTitle = t(`@ordo-command-file-system/create-${type}`)
  const translatedPlaceholder = t(`@ordo-command-file-system/placeholder`) ?? ""

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

          {parent && <PathBreadcrumbs path={parent.path} />}

          <input
            type="text"
            className="w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2"
            autoFocus
            placeholder={translatedPlaceholder}
            value={newName}
            onChange={handleInputChange}
          />

          <CreateModalButtonGroup
            newName={newName}
            onAction={handleHide}
          />
        </div>
      </div>
    </Modal>
  ))
}
