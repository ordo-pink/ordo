import type { StepComponentProps } from "@client/first-launch-wizard/types"

import React from "react"
import { useTranslation } from "react-i18next"

import { OrdoButtonPrimary, OrdoButtonSecondary } from "@client/common/components/button"
import { useAppSelector } from "@client/common/hooks/state-hooks"
import { useIcon } from "@client/common/hooks/use-icon"
import { USER_SETTINGS_SCHEMA } from "@client/settings/user-settings-schema"
import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"

import SelectSetting from "@client/settings/components/select-setting"

export default function ThemeStep({ setStep }: StepComponentProps) {
  const theme = useAppSelector((state) => state.app.userSettings["appearance.theme"])

  const { t } = useTranslation()

  const ColorsIcon = useIcon("BsLightbulb")

  return (
    <>
      <ColorsIcon className="text-3xl text-purple-500" />

      <div className="text-xl">{t("@first-launch-wizard/theme-title")}</div>

      <div className="w-64">
        <SelectSetting
          schema={USER_SETTINGS_SCHEMA["appearance.theme"]}
          schemaKey={"appearance.theme"}
          value={theme}
        />
      </div>

      <div className="text-sm text-neutral-500 text-center">
        {t("@first-launch-wizard/theme-message")}
      </div>

      <div className="w-full flex items-center justify-between">
        <OrdoButtonSecondary onClick={() => setStep(FirstLaunchWizardStep.LANGUAGE)}>
          <div>{t("@app/button-back")}</div>
        </OrdoButtonSecondary>

        <OrdoButtonPrimary
          onClick={() => setStep(FirstLaunchWizardStep.PERSONAL_PROJECT_DIRECTORY)}
          hotkey="enter"
        >
          <div>{t("@app/button-continue")}</div>
        </OrdoButtonPrimary>
      </div>
    </>
  )
}
