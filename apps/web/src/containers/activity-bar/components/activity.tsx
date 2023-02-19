import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"
import { getExtensionReadableName, getActivityRoute } from "../../../core/extensions/utils"
import { OrdoActivityExtension } from "../../../core/types"

type Props = {
  activity: OrdoActivityExtension<string>
}

export default function ActivityBarActivity({ activity }: Props) {
  const activityName = getExtensionReadableName(activity)
  const activityRoute = getActivityRoute(activity)
  const Icon = activity.Icon
  const Component = activity.Component

  const handleMouseOver = () => {
    Component.preload()
  }

  const { t } = useTranslation()

  const translatedTitle = t(activityName) ?? activityName

  return (
    <NavLink
      title={translatedTitle}
      onMouseOver={handleMouseOver}
      className="!text-neutral-700 dark:!text-neutral-300 hover:!text-purple-600 dark:hover:!text-purple-400 transition-all duration-300 p-2 text-xl rounded-lg"
      to={activityRoute}
    >
      <Icon />
    </NavLink>
  )
}
