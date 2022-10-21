import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { createFile, createDirectory as createDirectory } from "@client/app/store"
import { CreationType } from "@client/create-modal/creation-type"
import { useAppDispatch, useAppSelector } from "@client/state"
import { hideCreateModal } from "@client/create-modal/store"
import { useModalWindow } from "@client/modal"
import { useIcon } from "@client/use-icon"
import Either from "@core/utils/either"

import Null from "@client/null"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const separator = useAppSelector((state) => state.app.localSettings["app.separator"])
  const isShown = useAppSelector((state) => state.createModal.isShown)
  const parent = useAppSelector((state) => state.createModal.parent)
  const type = useAppSelector((state) => state.createModal.type)

  const { t } = useTranslation()

  const { showModal, hideModal, Modal } = useModalWindow()
  const Icon = useIcon(type === CreationType.FILE ? "BsFilePlus" : "BsFolderPlus")

  const [newName, setNewName] = useState("")

  useEffect(() => {
    if (!isShown) showModal()
  }, [isShown])

  const create = type === CreationType.FILE ? createFile : createDirectory

  const hide = () => {
    setNewName("")
    dispatch(hideCreateModal())
  }

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(parent))
    .fold(Null, (directory) => (
      <Modal onHide={hide}>
        <div className="h-full flex items-center justify-center">
          <div
            onClick={(event) => event.stopPropagation()}
            className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
          >
            <div className="flex items-center space-x-4">
              <Icon className="shrink-0" />
              <div className="text-xl">{t(`app.modal.create.${type}.title`)}</div>
            </div>
            <input
              autoFocus
              type="text"
              placeholder={t(`app.modal.create.${type}.placeholder`)}
              className="w-full outline-none bg-white dark:bg-neutral-600 px-4 py-2"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  hideModal()
                } else if (e.key === "Enter") {
                  dispatch(create(directory.path + separator + newName))
                  hideModal()
                }
              }}
            />
            <div className="text-sm text-neutral-500">{t(`app.modal.create.${type}.hint`)}</div>
          </div>
        </div>
      </Modal>
    ))
}
