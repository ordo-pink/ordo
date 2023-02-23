import type { StepComponentProps } from "@client/first-launch-wizard/types"

import React from "react"
import { useTranslation } from "react-i18next"

import { OrdoButtonPrimary, OrdoButtonSecondary } from "@client/common/components/button"
import { useAppSelector } from "@client/common/hooks/state-hooks"
import { useIcon } from "@client/common/hooks/use-icon"
import { USER_SETTINGS_SCHEMA } from "@client/settings/user-settings-schema"
import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"

import SelectSetting from "@client/settings/components/select-setting"

export default function LanguageStep({ setStep }: StepComponentProps) {
  const language = useAppSelector((state) => state.app.userSettings["appearance.language"])

  const { t } = useTranslation()

  const GlobeIcon = useIcon("BsGlobe")

  return (
    <>
      <GlobeIcon className="text-3xl text-purple-500" />

      <div className="text-xl">{t("@first-launch-wizard/language-title")}</div>

      <div className="w-64">
        <SelectSetting
          schema={USER_SETTINGS_SCHEMA["appearance.language"]}
          schemaKey={"appearance.language"}
          value={language}
        />
      </div>

      <div className="text-sm text-neutral-500 text-center">
        {t("@first-launch-wizard/language-message")}
      </div>

      <div className="w-full flex items-center justify-between">
        <OrdoButtonSecondary onClick={() => setStep(FirstLaunchWizardStep.WELCOME)}>
          <div>{t("@app/button-back")}</div>
        </OrdoButtonSecondary>

        <OrdoButtonPrimary onClick={() => setStep(FirstLaunchWizardStep.THEME)} hotkey="enter">
          <div className="flex items-center space-x-1">
            <div>{t("@app/button-continue")}</div>
          </div>
        </OrdoButtonPrimary>
      </div>
    </>
  )
}
