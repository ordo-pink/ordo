import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { renameFileOrDirectory } from "@client/app/store"
import { useAppDispatch, useAppSelector } from "@client/state"
import { useModalWindow } from "@client/modal"
import Either from "@core/utils/either"

import Null from "@client/null"
import { hideRenameModal, showRenameModal } from "./store"
import { OrdoDirectory, OrdoFile } from "@core/app/types"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const isShown = useAppSelector((state) => state.renameModal.isShown)
  const item = useAppSelector((state) => state.renameModal.item)

  const [newName, setNewName] = useState(item?.readableName || "")

  const { t } = useTranslation()

  const { showModal, hideModal, Modal } = useModalWindow()

  useEffect(() => {
    setNewName(item?.readableName || "")
  }, [item])

  useEffect(() => {
    if (!isShown) showModal()
  }, [isShown])

  const hide = () => {
    setNewName("")
    dispatch(hideRenameModal())
  }

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(item))
    .fold(Null, (item: OrdoFile | OrdoDirectory) => (
      <Modal onShow={() => dispatch(showRenameModal(null))} onHide={hide}>
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
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") return hideModal()
                if (event.key === "Enter") {
                  const oldPath = item.path
                  const newPath = item.path.replace(item.readableName, newName)

                  dispatch(renameFileOrDirectory({ oldPath, newPath }))

                  hideModal()
                }
              }}
            />
            <div className="text-sm text-neutral-500">{t("app.modal.rename.hint")}</div>
          </div>
        </div>
      </Modal>
    ))
}
