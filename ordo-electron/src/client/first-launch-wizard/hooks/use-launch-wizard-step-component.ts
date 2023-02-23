import type { FC } from "react"

import { StepComponentProps } from "@client/first-launch-wizard/types"
import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"
import Switch from "@client/common/utils/switch"

import AllDoneStep from "@client/first-launch-wizard/components/all-done-step"
import DummyContentStep from "@client/first-launch-wizard/components/dummy-content-step"
import IsLoadingStep from "@client/first-launch-wizard/components/is-loading"
import LanguageStep from "@client/first-launch-wizard/components/language-step"
import PersonalProjectDirectoryStep from "@client/first-launch-wizard/components/personal-project-directory-step"
import ThemeStep from "@client/first-launch-wizard/components/theme-step"
import WelcomeStep from "@client/first-launch-wizard/components/welcome-step"
import Null from "@client/common/components/null"

export const useLaunchWizardStepComponent = (step: FirstLaunchWizardStep) => {
  return Switch.of(step)
    .case(FirstLaunchWizardStep.WELCOME, WelcomeStep)
    .case(FirstLaunchWizardStep.LANGUAGE, LanguageStep)
    .case(FirstLaunchWizardStep.THEME, ThemeStep)
    .case(FirstLaunchWizardStep.PERSONAL_PROJECT_DIRECTORY, PersonalProjectDirectoryStep)
    .case(FirstLaunchWizardStep.DUMMY_CONTENT, DummyContentStep)
    .case(FirstLaunchWizardStep.IS_LOADING, IsLoadingStep)
    .case(FirstLaunchWizardStep.ALL_DONE, AllDoneStep)
    .default(Null as FC<StepComponentProps>)
}
