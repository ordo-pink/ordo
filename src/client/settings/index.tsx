import React, { useEffect } from "react"

import { useAppDispatch, useAppSelector } from "@client/common/hooks/state-hooks"
import { USER_SETTINGS_SCHEMA } from "@client/settings/user-settings-schema"
import { disableSideBar } from "@client/app/store"
import Either from "@client/common/utils/either"

import SettingsItem from "@client/settings/components/settings-item"
import Null from "@client/common/null"

/**
 * Application settings page.
 */
export default function Settings() {
  const dispatch = useAppDispatch()
  const userSettings = useAppSelector((state) => state.app.userSettings)

  useEffect(() => void dispatch(disableSideBar()), [])

  const schemaKeys = Object.keys(USER_SETTINGS_SCHEMA) as (keyof typeof USER_SETTINGS_SCHEMA)[]

  return Either.fromNullable(userSettings).fold(Null, (settings) => (
    <div className="settings">
      <form className="settings-form">
        {schemaKeys.map((key) => (
          <SettingsItem
            key={key}
            schemaKey={key}
            schema={USER_SETTINGS_SCHEMA[key]}
            value={settings[key]}
          />
        ))}
      </form>
    </div>
  ))
}
