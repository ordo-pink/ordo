import type { SettingsItemProps } from "@client/app/types"

import React, { ChangeEvent } from "react"

import { setUserSetting } from "@client/app/store"
import { useAppDispatch } from "@client/state"

/**
 * Input for string settings.
 */
export default function StringSetting({
  schemaKey,
  value,
}: SettingsItemProps<"project.personal.directory">) {
  const dispatch = useAppDispatch()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(setUserSetting([schemaKey, event.target.value]))

  return (
    <input
      type="text"
      className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-900 px-2 py-1"
      value={value}
      onBlur={handleChange}
    />
  )
}
