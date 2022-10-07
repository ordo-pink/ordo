import React, { useEffect } from "react"

import { useAppDispatch, useAppSelector } from "@client/state"
import { USER_SETTINGS_SCHEMA } from "@core/app/user-settings-schema"
import Either from "@core/utils/either"

import SettingsItem from "@client/app/components/settings/settings-item"
import Null from "@client/null"
import { disableSideBar } from "./store"

/**
 * Application settings page.
 */
export default function Settings() {
  const dispatch = useAppDispatch()
  const userSettings = useAppSelector((state) => state.app.userSettings)

  useEffect(() => void dispatch(disableSideBar()), [])

  // TODO: 52
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
