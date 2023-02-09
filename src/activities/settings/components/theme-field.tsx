import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { OrdoButtonSecondary } from "$core/components/buttons"
import Fieldset from "$core/components/fieldset"
import { useActionContext } from "$core/hooks/use-action-context"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

export default function ThemeField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const changeTheme = commands.find(
    (command) => command.title === "@ordo-activity-settings/change-theme",
  )

  const { t } = useTranslation()

  const translatedTheme = t("@ordo-activity-settings/theme")
  const translatedChangeTheme = t("@ordo-activity-settings/change-theme")
  const translatedDarkTheme = t("@ordo-activity-settings/dark-theme")
  const translatedLightTheme = t("@ordo-activity-settings/light-theme")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => changeTheme?.action(actionContext)),
  )

  return (
    <Fieldset className="relative">
      <div className="text-lg">{translatedTheme}</div>
      <OrdoButtonSecondary
        onClick={handleButtonClick}
        center
      >
        <select name="select">
          <option
            value="value1"
            selected
          >
            {translatedChangeTheme}
          </option>
          <option value="value2">{translatedDarkTheme}</option>
          <option value="value3">{translatedLightTheme}</option>
        </select>
      </OrdoButtonSecondary>
    </Fieldset>
  )
}
