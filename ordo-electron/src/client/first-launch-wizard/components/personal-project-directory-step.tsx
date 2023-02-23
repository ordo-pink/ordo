import type { StepComponentProps } from "@client/first-launch-wizard/types"

import React, { useEffect, useState } from "react"

import {
  selectDefaultPersonalProjectDirectory,
  selectPersonalProjectDirectory,
} from "@client/app/store"
import {
  OrdoButtonPrimary,
  OrdoButtonSecondary,
  OrdoButtonSuccess,
} from "@client/common/components/button"
import { useAppDispatch } from "@client/common/hooks/state-hooks"
import { useIcon } from "@client/common/hooks/use-icon"
import { useTranslation } from "react-i18next"
import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"

export default function PersonalProjectDirectoryStep({ setStep }: StepComponentProps) {
  const dispatch = useAppDispatch()

  const [defaultProjectDirectoryPath, setDefaultProjectDirectoryPath] = useState("")

  useEffect(() => {
    window.ordo
      .emit<string>({ type: "@app/getDefaultProjectDirectory" })
      .then(setDefaultProjectDirectoryPath)
  }, [])

  const { t } = useTranslation()

  const FolderIcon = useIcon("BsFolderSymlink")

  return (
    <>
      <FolderIcon className="text-3xl text-purple-500" />

      <div className="text-xl">{t("@first-launch-wizard/personal-project-directory-title")}</div>

      <div className="text-sm text-neutral-500 text-center">
        {t("@first-launch-wizard/personal-project-directory-message")}

        <div className=" text-base text-neutral-800 dark:text-neutral-300">
          {defaultProjectDirectoryPath}
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <OrdoButtonSecondary onClick={() => setStep(FirstLaunchWizardStep.THEME)}>
          {t("@app/button-back")}
        </OrdoButtonSecondary>

        <OrdoButtonPrimary
          onClick={() => {
            dispatch(selectPersonalProjectDirectory())
            setStep(FirstLaunchWizardStep.DUMMY_CONTENT)
          }}
          hotkey="c"
        >
          {t("@first-launch-wizard/choose-manually")}
        </OrdoButtonPrimary>

        <OrdoButtonSuccess
          onClick={() => {
            dispatch(selectDefaultPersonalProjectDirectory())
            setStep(FirstLaunchWizardStep.DUMMY_CONTENT)
          }}
          hotkey="enter"
        >
          {t("@first-launch-wizard/button-default")}
        </OrdoButtonSuccess>
      </div>
    </>
  )
}
