import { Language } from "@core/locales"
import { Theme } from "@core/theme"
import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"

export type WizardContent = {
  language: Language
  theme: Theme
  personalProjectDirectory: string
  createDummyContent: boolean
}

export type StepComponentProps = {
  setStep: (step: FirstLaunchWizardStep) => void
  complete: (complete?: boolean) => void
}
