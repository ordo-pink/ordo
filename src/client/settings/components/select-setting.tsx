import type { SettingsItemProps } from "@client/settings/types"

import React, { ChangeEvent } from "react"

import Either from "@client/common/utils/either"
import { useAppDispatch } from "@client/common/hooks/state-hooks"
import { setUserSetting } from "@client/app/store"

import Null from "@client/common/components/null"
import SelectSettingOption from "@client/settings/components/select-setting-option"

/**
 * Input for enum settings.
 */
export default function SelectSetting({
  schemaKey,
  value,
  schema,
}: SettingsItemProps<"project.personal.directory">) {
  const dispatch = useAppDispatch()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    dispatch(setUserSetting([schemaKey, event.target.value]))

  return Either.fromNullable(schema.enum).fold(Null, (options) => (
    <select
      className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-900 px-2 py-1"
      value={value}
      onChange={handleChange}
    >
      {options &&
        options.map((option: string) => (
          <SelectSettingOption key={`${schemaKey}-${option}`} option={option} />
        ))}
    </select>
  ))
}
