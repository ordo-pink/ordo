import type { StepComponentProps } from "@client/first-launch-wizard/types"

import React from "react"
import { useTranslation } from "react-i18next"

import { useIcon } from "@client/common/hooks/use-icon"
import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"
import {
  OrdoButtonSecondary,
  OrdoButtonPrimary,
  OrdoButtonSuccess,
} from "@client/common/components/button"

export default function DummyContentStep({ setStep, complete }: StepComponentProps) {
  const { t } = useTranslation()

  const FilesIcon = useIcon("BsFiles")

  return (
    <>
      <FilesIcon className="text-3xl text-purple-500" />

      <div className="text-xl">{t("@first-launch-wizard/dummy-content-title")}</div>

      <div className="text-sm text-neutral-500 text-center">
        {t("@first-launch-wizard/dummy-content-message")}
      </div>

      <div className="w-full flex items-center justify-between text-sm space-x-2">
        <OrdoButtonSecondary
          onClick={() => setStep(FirstLaunchWizardStep.PERSONAL_PROJECT_DIRECTORY)}
        >
          {t("@app/button-back")}
        </OrdoButtonSecondary>

        <OrdoButtonPrimary onClick={() => complete(true)} hotkey="n">
          <div>{t("@app/button-no")}</div>
        </OrdoButtonPrimary>

        <OrdoButtonSuccess onClick={() => complete()} hotkey="y">
          <div>{t("@app/button-yes")}</div>
        </OrdoButtonSuccess>
      </div>
    </>
  )
}
