import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"

import { getActivityRoute, getExtensionReadableName } from "$core/extensions/utils"
import { OrdoActivityExtension } from "$core/types"

type Props = { activity: OrdoActivityExtension<string> }

export default function ActivityBarActivity({ activity }: Props) {
  const { t } = useTranslation()

  const activityName = getExtensionReadableName(activity)
  const activityRoute = getActivityRoute(activity)
  const Icon = activity.Icon
  const Component = activity.Component

  const handleMouseOver = () => {
    Component.preload()
  }

  return (
    <NavLink
      title={t(activityName) as string}
      onMouseOver={handleMouseOver}
      className="activity-bar_activity"
      to={activityRoute}
    >
      <Icon />
    </NavLink>
  )
}
