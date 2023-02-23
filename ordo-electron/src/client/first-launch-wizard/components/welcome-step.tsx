import React from "react"
import { shuffle } from "lodash"
import { useTranslation } from "react-i18next"
import { TypeAnimation } from "react-type-animation"

import { FirstLaunchWizardStep } from "@client/first-launch-wizard/constants"
import { useIcon } from "@client/common/hooks/use-icon"
import { StepComponentProps } from "@client/first-launch-wizard/types"
import { GREETINGS } from "@client/first-launch-wizard/greetings"
import { OrdoButtonPrimary, OrdoButtonSecondary } from "@client/common/components/button"

export default function WelcomeStep({ setStep, complete }: StepComponentProps) {
  const { t } = useTranslation()

  const HeartIcon = useIcon("BsHeart")

  const welcomes = shuffle(GREETINGS).reduce(
    (acc, greeting) => acc.concat([greeting, 2000]),
    [] as Array<string | 2000>
  )

  return (
    <>
      <HeartIcon className="text-3xl text-purple-500" />

      <TypeAnimation
        sequence={welcomes}
        wrapper="div"
        className="text-2xl md:text-6xl text-neutral-600 dark:text-neutral-300"
        cursor={true}
        speed={5}
        repeat={Infinity}
      />

      <div className="w-full flex items-center justify-between">
        <OrdoButtonSecondary onClick={complete} hotkey="escape">
          {t("@app/button-skip")}
        </OrdoButtonSecondary>

        <OrdoButtonPrimary onClick={() => setStep(FirstLaunchWizardStep.LANGUAGE)} hotkey="enter">
          {t("@app/button-continue")}
        </OrdoButtonPrimary>
      </div>
    </>
  )
}
