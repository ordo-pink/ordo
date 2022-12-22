import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFilePlus, BsFolderPlus } from "react-icons/bs"

import { hideCreateModal } from "$containers/app/components/create-modal/store"
import { FSEntity } from "$containers/app/constants"
import { useFSAPI } from "$core/api/fs.adapter"
import Null from "$core/components/null"
import { useModal } from "$core/hooks/use-modal"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { Either } from "$core/utils/either"
// eslint-disable-next-line
import { createdDirectory, createdFile } from "$containers/app/store"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const isShown = useAppSelector((state) => state.createModal.isShown)
  const parent = useAppSelector((state) => state.createModal.parent)
  const type = useAppSelector((state) => state.createModal.entityType)

  const fsApi = useFSAPI()

  const { t } = useTranslation()

  const { showModal, hideModal, Modal } = useModal()

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

  // TODO: Extract styles
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
              <div className="text-xl">{t(`@ordo-activity-editor/create-${type}`)}</div>
            </div>
            <input
              type="text"
              placeholder={
                t(`@ordo-activity-editor/create-modal.create-${type}.placeholder`) as string
              }
              className="w-full outline-none bg-white dark:bg-neutral-600 px-4 py-2"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  hideModal()
                } else if (e.key === "Enter") {
                  type === FSEntity.FILE
                    ? // eslint-disable-next-line
                      fsApi.files.create(`${parentDirectory.path}/${newName}`).then(console.log) // TODO .then((file) => dispatch(createdFile(file)))
                    : fsApi.directories
                        .create(`${parentDirectory.path}/${newName}`)
                        // eslint-disable-next-line
                        .then(console.log) // TODO .then((directory) => dispatch(createdDirectory(directory)))

                  hideModal()
                }
              }}
            />
            <div className="text-sm text-neutral-500">
              {t(`@ordo-activity-editor/create-modal.hint`)}
            </div>
          </div>
          {/* TODO: Add cancel and ok buttons, remove hints then */}
        </div>
      </Modal>
    ))
}
