import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AiFillFolder } from "react-icons/ai"
import { BsChevronRight, BsFilePlus, BsFolderPlus } from "react-icons/bs"

import { hideCreateModal } from "$commands/create-file-or-directory/store"
import { CreateFileOrDirectoryState } from "$commands/create-file-or-directory/types"

import { useModal } from "$containers/app/hooks/use-modal"
import { createdDirectory, createdFile } from "$containers/app/store"

import { OrdoButtonPrimary, OrdoButtonSecondary } from "$core/components/buttons"
import Null from "$core/components/null"
import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Nullable, OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"

type AppSelectorExtension = {
  "ordo-command-create-file-or-directory": CreateFileOrDirectoryState
}

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const isShown = useAppSelector<AppSelectorExtension, boolean>(
    (state) => state["ordo-command-create-file-or-directory"].isShown,
  )

  const parent = useAppSelector<AppSelectorExtension, Nullable<OrdoDirectory>>(
    (state) => state["ordo-command-create-file-or-directory"].parent,
  )

  const type = useAppSelector<AppSelectorExtension, OrdoFSEntity>(
    (state) => state["ordo-command-create-file-or-directory"].entityType,
  )

  const { t } = useTranslation()

  const { showModal, Modal } = useModal()

  const [newName, setNewName] = useState("")

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const Icon = type === "file" ? BsFilePlus : BsFolderPlus

  const hide = () => {
    setNewName("")
    dispatch(hideCreateModal())
  }

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(parent))
    .fold(Null, (parentDirectory) => (
      <Modal onHide={hide}>
        <div className="h-full flex items-center justify-center">
          <div
            onClick={(event) => event.stopPropagation()}
            className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
            role="none"
          >
            <div className="flex items-center space-x-4">
              <Icon className="shrink-0" />
              <div className="text-xl">
                {t(`@ordo-command-create-file-or-directory/create-${type}`)}
              </div>
            </div>
            <div className="self-start flex flex-wrap text-neutral-500 text-xs space-x-4">
              {/* TODO: Extract to Breadcrumbs */}
              {parent &&
                parent.path &&
                parent.path
                  .slice(1)
                  .split("/")
                  .map((chunk, index) => (
                    <div
                      key={`${chunk}-${index}`}
                      className="flex items-center shrink-0 space-x-2"
                    >
                      <AiFillFolder />
                      <div>{chunk ? chunk : "/"}</div>
                      <BsChevronRight />
                    </div>
                  ))}
            </div>
            <input
              type="text"
              autoFocus
              placeholder={t(`@ordo-command-create-file-or-directory/placeholder`) as string}
              className="w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="w-full flex items-center justify-around">
              <OrdoButtonSecondary
                hotkey="escape"
                onClick={() => dispatch(hideCreateModal())}
              >
                {t("@ordo-command-create-file-or-directory/button-cancel")}
              </OrdoButtonSecondary>

              <OrdoButtonPrimary
                onClick={() => {
                  type === OrdoFSEntity.DIRECTORY
                    ? dispatch(createdDirectory(`${parentDirectory.path}/${newName}`))
                    : dispatch(createdFile(`${parentDirectory.path}/${newName}`))

                  dispatch(hideCreateModal())
                }}
                hotkey="enter"
              >
                {t("@ordo-command-create-file-or-directory/button-ok")}
              </OrdoButtonPrimary>
            </div>
          </div>
        </div>
      </Modal>
    ))
}
