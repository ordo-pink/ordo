import type { SettingsItemProps } from "@client/settings/types"

import React from "react"

import { setUserSetting } from "@client/app/store"
import { useAppDispatch } from "@client/common/hooks/state-hooks"

/**
 * Input for settings with boolean values.
 */
export default function CheckboxSetting({
  schemaKey,
  value,
}: SettingsItemProps<"files.confirm-move">) {
  const dispatch = useAppDispatch()

  const handleChange = () => dispatch(setUserSetting([schemaKey, !value]))

  return (
    <input
      className="w-10 h-10 md:w-5 md:h-5 accent-violet-500 dark:accent-violet-600"
      type="checkbox"
      checked={value}
      onChange={handleChange}
    />
  )
}
