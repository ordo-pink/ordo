import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"
import { useLaunchWizardStepComponent } from "@client/first-launch-wizard/hooks/use-launch-wizard-step-component"
import { useAppDispatch, useAppSelector } from "@client/common/hooks/state-hooks"
import { createFile, selectDefaultPersonalProjectDirectory } from "@client/app/store"
import Either from "@client/common/utils/either"

import Modal from "@client/common/hooks/use-modal/components/modal"
import Null from "@client/common/components/null"

// TODO: Add animations
// TODO: Add dummy content
// TODO: Move to Electron.js extensions
// TODO: Wait until the user finishes selecting a directory before switching to the dummy content step
export default function FirstLaunchWizard() {
  const dispatch = useAppDispatch()

  const projectDirectory = useAppSelector(
    (state) => state.app.userSettings["project.personal.directory"]
  )

  const [step, setStep] = useState(FirstLaunchWizardStep.WELCOME)
  const [isWizardStartedByUser, setIsWizardStartedByUser] = useState(false)
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    if (isWizardStartedByUser) {
      return
    }

    if (!isWizardStartedByUser && projectDirectory === "") {
      setIsShown(true)
    }
  }, [projectDirectory, isWizardStartedByUser])

  const { t } = useTranslation()

  const Component = useLaunchWizardStepComponent(step)

  const handleSetStep = (step: FirstLaunchWizardStep) => {
    setIsWizardStartedByUser(true)
    setStep(step)
  }

  const handleComplete = (skipDummyContentCreation = false) => {
    setStep(FirstLaunchWizardStep.IS_LOADING)

    if (!projectDirectory) {
      dispatch(selectDefaultPersonalProjectDirectory())
    }

    if (!skipDummyContentCreation) {
      dispatch(
        createFile({
          path: t("@first-launch-wizard/task-1-path"),
          content: t("@first-launch-wizard/task-1-raw"),
        })
      )

      dispatch(
        createFile({
          path: t("@first-launch-wizard/task-2-path"),
          content: t("@first-launch-wizard/task-2-raw"),
        })
      )

      dispatch(
        createFile({
          path: t("@first-launch-wizard/task-3-path"),
          content: t("@first-launch-wizard/task-3-raw"),
        })
      )

      dispatch(
        createFile({
          path: t("@first-launch-wizard/index-path"),
          content: t("@first-launch-wizard/index-raw"),
        })
      )
    }

    setTimeout(() => {
      setStep(FirstLaunchWizardStep.ALL_DONE)

      setTimeout(() => {
        setIsShown(false)
        setIsWizardStartedByUser(false)
      }, 1000)
    }, 1000)
  }

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal isShown={true} hideModal={() => void 0}>
      <div className="h-full flex items-center justify-center">
        <div className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full lg:w-1/2 h-96 max-w-lg p-8 flex flex-col items-center justify-center">
          <div className="h-96 w-full flex flex-col items-center justify-between">
            <Component complete={handleComplete} setStep={handleSetStep} />
          </div>
        </div>
      </div>
    </Modal>
  ))
}
