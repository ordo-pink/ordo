import {
  OrdoActivityExtension,
  getExtensionReadableName,
  getActivityRoute,
} from "@ordo-pink/extensions"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"

import "./activity.css"

type Props = {
  activity: OrdoActivityExtension<string, Record<string, unknown>, Record<string, unknown>>
}

export default function ActivityBarActivity({ activity }: Props) {
  const activityName = getExtensionReadableName(activity)
  const activityRoute = getActivityRoute(activity)
  const Icon = activity.Icon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = activity.Component as any

  const handleMouseOver = () => {
    Component.preload()
  }

  const { t } = useTranslation()

  const translatedTitle = t(activityName) ?? activityName

  return (
    <NavLink
      title={translatedTitle}
      onMouseOver={handleMouseOver}
      className="!text-neutral-700 dark:!text-neutral-300 hover:!text-purple-600 dark:hover:!text-purple-400 transition-all duration-300 p-2 text-xl rounded-lg activity-bar_activity"
      to={activityRoute}
    >
      <Icon />
    </NavLink>
  )
}
