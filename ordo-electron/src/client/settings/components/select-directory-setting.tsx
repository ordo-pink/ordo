import type { SettingsItemProps } from "@client/settings/types"

import React from "react"

import { useIcon } from "@client/common/hooks/use-icon"
import { useAppDispatch } from "@client/common/hooks/state-hooks"
import { selectPersonalProjectDirectory } from "@client/app/store"
import { OrdoButtonPrimary } from "@client/common/components/button"

/**
 * Input for string settings.
 */
export default function SelectDirectorySetting({
  value,
}: SettingsItemProps<"project.personal.directory">) {
  const dispatch = useAppDispatch()

  const Icon = useIcon("BsFolder2Open")

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="text-sm break-all">{value}</div>
      <OrdoButtonPrimary onClick={() => dispatch(selectPersonalProjectDirectory())}>
        <Icon />
      </OrdoButtonPrimary>
    </div>
  )
}
