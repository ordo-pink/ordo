import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkPlus, BsFolderPlus } from "react-icons/bs"

import CreateModalButtonGroup from "$commands/create-file-or-directory/components/create-modal-button-group"
import { hideCreateModal } from "$commands/create-file-or-directory/store"
import { AppSelectorExtension } from "$commands/create-file-or-directory/types"

import { useModal } from "$containers/app/hooks/use-modal"

import Null from "$core/components/null"
import PathBreadcrumbs from "$core/components/path-breadcrumbs"
import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Nullable, OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

import "$commands/create-file-or-directory/index.css"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const isShown = useAppSelector<AppSelectorExtension, boolean>(
    (state) => state["ordo-command-create-file-or-directory"].isShown,
  )

  const parent = useAppSelector<AppSelectorExtension, Nullable<OrdoDirectory>>(
    (state) => state["ordo-command-create-file-or-directory"].parent,
  )

  const type = useAppSelector<AppSelectorExtension, OrdoFSEntity>(
    (state) => state["ordo-command-create-file-or-directory"].entityType,
  )

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

  const translatedTitle = t(`@ordo-command-create-file-or-directory/create-${type}`)
  const translatedPlaceholder = t(`@ordo-command-create-file-or-directory/placeholder`) ?? ""

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal onHide={handleHide}>
      <div className="create-file-or-directory-overlay">
        <div
          onClick={handleModalClick}
          className="create-file-or-directory-modal"
          role="none"
        >
          <div className="create-file-or-directory-modal_title">
            <Icon className="shrink-0" />
            <div>{translatedTitle}</div>
          </div>

          {parent && <PathBreadcrumbs path={parent.path} />}

          <input
            type="text"
            className="create-file-or-directory-modal_input"
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
