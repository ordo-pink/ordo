import type { OrdoFile, OrdoFolder } from "@core/app/types"
import type { Nullable } from "@core/types"

import React, { useState, MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { renameFileOrFolder } from "@client/app/store"
import { useAppDispatch } from "@client/state"
import { useModalWindow } from "@client/modal"

import Null from "@client/null"

export const useRenameModal = (item: Nullable<OrdoFile | OrdoFolder>) => {
  const { showModal, hideModal, Modal } = useModalWindow()

  if (!item) {
    return {
      showRenameModal: () => void 0,
      hideRenameModal: () => void 0,
      RenameModal: Null,
    }
  }

  return {
    showRenameModal: showModal,
    hideRenameModal: hideModal,
    RenameModal: () => (
      <Modal>
        <RenameModal item={item} hideModal={hideModal} />
      </Modal>
    ),
  }
}

type TProps = {
  item: OrdoFile | OrdoFolder
  hideModal: (event?: MouseEvent) => void
}

const RenameModal = ({ item, hideModal }: TProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [newName, setNewName] = useState(item.readableName)

  return (
    <div className="h-full flex items-center justify-center">
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
      >
        <div className="text-xl">{t("app.modal.rename.title")}</div>
        <input
          autoFocus
          type="text"
          className="w-full outline-none bg-white dark:bg-neutral-600 px-4 py-2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") return hideModal()
            if (e.key === "Enter") {
              const oldPath = item.path
              const newPath = item.path.replace(item.readableName, newName)
              dispatch(renameFileOrFolder({ oldPath, newPath }))
              hideModal()
            }
          }}
        />
        <div className="text-sm text-neutral-500">{t("app.modal.rename.hint")}</div>
      </div>
    </div>
  )
}
