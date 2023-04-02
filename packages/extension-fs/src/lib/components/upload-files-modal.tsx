import { IOrdoDirectory, OrdoFilePath } from "@ordo-pink/common-types"
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
  parent?: IOrdoDirectory
}

export default function UploadFilesModal({ parent }: Props) {
  const { hideModal } = useModal()
  const { emit } = useCommands()
  const { t } = useTranslation("fs")

  const [breadcrumbsPath] = useState(parent?.path ?? "/")
  const [files, setFiles] = useState<File[]>([])

  const tPlaceholder = t("choose-name-placeholder") as string
  const tTitle = t("create-file")
  const tCancel = t("cancel-button")
  const tUpload = t("upload-files")

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFiles(Array.from(e.target.files))
  }

  const handleOkButtonClick = () => {
    files.forEach(async (file) => {
      const parentPath = parent ? parent.path : "/"
      const name = file.name
      const path = `${parentPath}${name}` as const

      emit("fs.create-file", {
        file: OrdoFile.empty(path.trim() as OrdoFilePath),
        content: await file.arrayBuffer(),
      })
    })
    hideModal()
  }

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
              type="file"
              className="w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2"
              placeholder={tPlaceholder}
              onChange={handleFileChange}
            />

            <ul>
              {Array.from(files).map((file, i) => (
                <li key={i}>
                  {file.name} - {file.type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
        <OrdoButtonSecondary
          hotkey="escape"
          onClick={hideModal}
        >
          {tCancel}
        </OrdoButtonSecondary>

        <OrdoButtonPrimary
          hotkey="enter"
          disabled={!files}
          onClick={handleOkButtonClick}
        >
          {tUpload}
        </OrdoButtonPrimary>
      </div>
    </div>
  )
}
