import { OrdoDirectoryDTO, IOrdoFile, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import {
  OrdoButtonPrimary,
  OrdoButtonSecondary,
  PathBreadcrumbs,
  useCommands,
  useModal,
} from "@ordo-pink/react-utils"
import { ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkPlus } from "react-icons/bs"

type Props = {
  parent?: OrdoDirectoryDTO
  content?: string
  metadata?: IOrdoFile["metadata"]
}

export default function CreateFileModal({ parent, content = "", metadata = {} }: Props) {
  const { hideModal } = useModal()
  const { emit } = useCommands()
  const { t } = useTranslation("fs")

  const [fileName, setFileName] = useState("")
  const [isValidPath, setIsValidPath] = useState(true)
  const [breadcrumbsPath, setBreadcrumbsPath] = useState(parent?.path ?? "/")

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value)
    setIsValidPath(
      event.target.value
        ? OrdoFile.isValidPath((parent?.path ?? "/").concat(event.target.value))
        : true,
    )
    setBreadcrumbsPath(
      OrdoFile.isValidPath((parent?.path ?? "/").concat(event.target.value) as OrdoFilePath)
        ? OrdoFile.getParentPath((parent?.path ?? "/").concat(event.target.value) as OrdoFilePath)
        : parent?.path ?? "/",
    )
  }

  const handleCreateFile = () => {
    const parentPath = parent ? parent.path : "/"
    const name = fileName.endsWith(".md") ? fileName.slice(0, -3) : fileName
    const path = `${parentPath}${name}.md` as const

    const file = OrdoFile.from({
      path: path.trim() as OrdoFilePath,
      size: content.length,
      metadata,
    })

    emit("fs.create-file", { file, content })

    hideModal()
  }

  const tPlaceholder = t("choose-name-placeholder") as string
  const tTitle = t("create-file")
  const tCancel = t("cancel-button")
  const tCreate = t("create-button")
  const tInvalidPath = t("invalid-name")

  return (
    <div className="w-[30rem] max-w-full flex flex-col gap-8">
      <div className="flex space-x-2 px-8 pt-8 items-center">
        <div className="bg-gradient-to-tr from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
          <BsFileEarmarkPlus />
        </div>
        <div className="grow flex flex-col gap-y-4">
          <h3 className="px-8 text-lg font-bold">{tTitle}</h3>

          <div className="pl-8">
            <PathBreadcrumbs path={breadcrumbsPath} />
            <input
              className="w-full rounded-lg bg-neutral-200 dark:bg-neutral-600 px-4 py-2 shadow-inner"
              placeholder={tPlaceholder}
              type="text"
              autoComplete="off"
              aria-autocomplete="none"
              autoFocus
              value={fileName}
              onChange={handleInputChange}
            />
            <div
              className={`mt-1 text-center text-rose-500 text-sm transition-opacity duration-100 ${
                isValidPath ? "opacity-0" : "opacity-100"
              }`}
            >
              {tInvalidPath}
            </div>
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
          onClick={handleCreateFile}
          hotkey="Enter"
          disabled={!fileName || !isValidPath}
        >
          {tCreate}
        </OrdoButtonPrimary>
      </div>
    </div>
  )
}
