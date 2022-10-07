import type { OrdoFolder } from "@core/app/types"
import type { Nullable } from "@core/types"

import React, { useState, MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import Either from "@core/utils/either"
import { createFile, createFolder } from "@client/app/store"
import { useAppDispatch, useAppSelector } from "@client/state"
import { useModalWindow } from "@client/modal"
import { useIcon } from "@client/use-icon"

import Null from "@client/null"

type Params = {
  parent: Nullable<OrdoFolder>
}

export const useCreateFileModal = ({ parent }: Params) => {
  const { showModal, hideModal, Modal } = useModalWindow()

  return {
    showCreateFileModal: showModal,
    hideCreateFileModal: hideModal,
    CreateFileModal: () => (
      <Modal>
        <CreateModal parent={parent} hideModal={hideModal} type="file" />
      </Modal>
    ),
  }
}

export const useCreateFolderModal = ({ parent }: Params) => {
  const { showModal, hideModal, Modal } = useModalWindow()

  return {
    showCreateFolderModal: showModal,
    hideCreateFolderModal: hideModal,
    CreateFolderModal: () => (
      <Modal>
        <CreateModal parent={parent} hideModal={hideModal} type="folder" />
      </Modal>
    ),
  }
}

type TProps = {
  type: "file" | "folder"
  hideModal: (event?: MouseEvent) => void
  parent: Nullable<OrdoFolder>
}

const CreateModal = ({ hideModal, type, parent }: TProps) => {
  // TODO: 58
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const separator = useAppSelector((state) => state.app.localSettings["app.separator"])
  const create = type === "file" ? createFile : createFolder

  const [newName, setNewName] = useState("")
  const Icon = useIcon(type === "file" ? "BsFilePlus" : "BsFolderPlus")

  return Either.fromNullable(parent).fold(Null, (folder) => (
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
            if (e.key === "Escape") return hideModal()
            if (e.key === "Enter") {
              dispatch(create(folder.path + separator + newName))
              hideModal()
            }
          }}
        />
        <div className="text-sm text-neutral-500">{t(`app.modal.create.${type}.hint`)}</div>
      </div>
    </div>
  ))
}
