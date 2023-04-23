import { IOrdoDirectory } from "@ordo-pink/common-types"
import {
  OrdoButtonPrimary,
  OrdoButtonSecondary,
  PathBreadcrumbs,
  useCommands,
  useModal,
} from "@ordo-pink/react-utils"
import { ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFolderPlus } from "react-icons/bs"

type Props = {
  parent?: IOrdoDirectory
}

export default function CreateDirectoryModal({ parent }: Props) {
  const { hideModal } = useModal()
  const { emit } = useCommands()
  const { t } = useTranslation("fs")

  const [directoryName, setDirectoryName] = useState("")

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDirectoryName(event.target.value)

  const handleCreateDirectory = () => {
    const parentPath = parent ? parent.path : "/"
    const path = `${parentPath}${directoryName}/` as const

    emit("fs.create-directory", path)

    hideModal()
  }

  const tPlaceholder = t("choose-name-placeholder") as string
  const tTitle = t("create-directory")
  const tCancel = t("cancel-button")
  const tCreate = t("create-button")

  return (
    <div className="w-[30rem] max-w-full flex flex-col gap-8">
      <div className="flex space-x-2 px-8 pt-8 items-center">
        <div className="bg-gradient-to-tr from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
          <BsFolderPlus />
        </div>
        <div className="grow flex flex-col gap-y-4">
          <h3 className="px-8 text-lg font-bold">{tTitle}</h3>

          <div className="pl-8">
            <PathBreadcrumbs path={parent?.path ?? "/"} />
            <input
              className="w-full rounded-lg bg-neutral-200 dark:bg-neutral-600 px-4 py-2 shadow-inner"
              placeholder={tPlaceholder}
              type="text"
              autoComplete="off"
              aria-autocomplete="none"
              autoFocus
              value={directoryName}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
        <OrdoButtonSecondary
          onClick={hideModal}
          hotkey="Esc"
        >
          {tCancel}
        </OrdoButtonSecondary>

        <OrdoButtonPrimary
          onClick={handleCreateDirectory}
          hotkey="Enter"
        >
          {tCreate}
        </OrdoButtonPrimary>
      </div>
    </div>
  )
}
