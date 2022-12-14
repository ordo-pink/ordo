import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"

import { OrdoActivityExtension } from "$core/types"
import { getActivityRoute, getExtensionReadableName } from "$core/utils/extensions.util"

type Props = { activity: OrdoActivityExtension<string> }

export default function ActivityBarActivity({ activity }: Props) {
  const { t } = useTranslation()

  const activityName = getExtensionReadableName(activity)
  const activityRoute = getActivityRoute(activity)
  const Icon = activity.Icon

  return (
    <NavLink
      title={t(activityName) as string}
      className="activity-bar__activity"
      to={activityRoute}
    >
      <Icon />
    </NavLink>
  )
}
