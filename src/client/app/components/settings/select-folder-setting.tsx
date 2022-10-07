import type { SettingsItemProps } from "@client/app/types"

import React, { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { useIcon } from "@client/use-icon"
import { useAppDispatch } from "@client/state"
import { selectPersonalProjectDirectory } from "@client/app/store"

/**
 * Input for string settings.
 */
export default function SelectFolderSetting({
  value,
}: SettingsItemProps<"project.personal.directory">) {
  const dispatch = useAppDispatch()

  const { t } = useTranslation()

  const FolderIcon = useIcon("BsFolder2Open")

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    dispatch(selectPersonalProjectDirectory())
  }

  return (
    <div className="flex space-x-4 items-center">
      <div className="text-sm break-all">{value}</div>
      <button
        title={t("project.personal.select-directory")}
        onClick={handleClick}
        className="bg-neutral-200 ring-neutral-500 dark:bg-neutral-700 p-4 border border-neutral-300 dark:border-neutral-900"
      >
        <FolderIcon />
      </button>
    </div>
  )
}
