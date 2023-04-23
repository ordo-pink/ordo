import {
  OrdoButtonPrimary,
  OrdoButtonSecondary,
  useCommands,
  useModal,
} from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsTrash2Fill } from "react-icons/bs"

export default function ClearTrashBinModal() {
  const { hideModal } = useModal()
  const { emit } = useCommands()
  const { t } = useTranslation("fs")

  const handleRemoveFile = () => {
    emit("fs.clear-trash-bin")

    hideModal()
  }

  const tTitle = t("clear-trash-bin")
  const tText = t("confirm-clear-trash-bin")
  const tCancel = t("cancel-button")
  const tOk = t("clear-trash-bin-button")

  return (
    <div className="w-[30rem] max-w-full flex flex-col gap-8">
      <div className="flex space-x-2 px-8 pt-8 items-center">
        <div className="bg-gradient-to-tr from-red-400 dark:from-red-600 to-rose-400 dark:to-rose-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
          <BsTrash2Fill />
        </div>
        <div className="grow flex flex-col gap-y-4">
          <h3 className="px-8 text-lg font-bold">{tTitle}</h3>

          <div className="pl-8">{tText}</div>
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
          onClick={handleRemoveFile}
          hotkey="Enter"
        >
          {tOk}
        </OrdoButtonPrimary>
      </div>
    </div>
  )
}
