import type { SettingsItemProps } from "@client/app/types"

import React from "react"
import { useTranslation } from "react-i18next"

import { useSettingInput } from "@client/app/hooks/use-setting-input"

/**
 * A configurable application option.
 */
export default function SettingsItem({ schemaKey, schema, value }: SettingsItemProps) {
  const { t } = useTranslation()

  const titleTranslationKey = `app.${schemaKey}.title`
  const descriptionTranslationKey = `app.${schemaKey}.description`

  const InputComponent = useSettingInput(schemaKey, schema)

  return (
    <div className="settings-item">
      <label className="flex flex-col space-x-4 space-y-4 md:space-y-0 md:flex-row justify-between md:items-center p-8 settings-item-label">
        <div className="md:w-1/2">
          <h2 className="text-center md:text-left text-lg font-bold settings-item-title">
            {t(titleTranslationKey)}
          </h2>
          <h3 className="text-sm text-center md:text-left text-neutral-500 settings-item-description">
            {t(descriptionTranslationKey)}
          </h3>
        </div>

        <div className="md:w-1/3 flex justify-center md:justify-end items-center">
          <InputComponent value={value} schema={schema} schemaKey={schemaKey} />
        </div>
      </label>
    </div>
  )
}
