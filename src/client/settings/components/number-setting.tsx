import type { SettingsItemProps } from "@client/app/types"

import React, { ChangeEvent, useState, useEffect } from "react"

import { setUserSetting } from "@client/app/store"
import { useAppDispatch } from "@client/state"

/**
 * Input for string settings.
 */
export default function NumberSetting({ schemaKey, value }: SettingsItemProps<"editor.font-size">) {
  const dispatch = useAppDispatch()

  // Internal value is used to avoid applying changes to settings.
  // Settings are applied on input blur instead
  const [internalValue, setInternalValue] = useState(value)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    setInternalValue(value)
  }

  const handleBlur = () => dispatch(setUserSetting([schemaKey, internalValue]))

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  return (
    <input
      type="number"
      className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-900 px-2 py-1"
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
