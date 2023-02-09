import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { OrdoButtonSecondary } from "$core/components/buttons"
import Fieldset from "$core/components/fieldset"
import { useActionContext } from "$core/hooks/use-action-context"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

export default function LanguageField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const changeLanguage = commands.find(
    (command) => command.title === "@ordo-activity-settings/change-language",
  )

  const { t } = useTranslation()

  const translatedLanguage = t("@ordo-activity-settings/language")
  const translatedChangeLanguage = t("@ordo-activity-settings/change-language")
  const translatedRussianLanguage = t("@ordo-activity-settings/rus-language")
  const translatedEnglishLanguage = t("@ordo-activity-settings/eng-language")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => changeLanguage?.action(actionContext)),
  )

  return (
    <Fieldset className="relative">
      <div className="text-lg">{translatedLanguage}</div>
      <OrdoButtonSecondary
        onClick={handleButtonClick}
        center
      >
        <select name="select">
          <option
            value="value1"
            selected
          >
            {translatedChangeLanguage}
          </option>
          <option value="value2">{translatedRussianLanguage}</option>
          <option value="value3">{translatedEnglishLanguage}</option>
        </select>
      </OrdoButtonSecondary>
    </Fieldset>
  )
}
