import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { getActivityRoute, getExtensionReadableName } from "../../../core/extensions/utils"
import { OrdoActivityExtension } from "../../../core/types"

type Props = {
  activity: OrdoActivityExtension<string>
}

export default function AllActivitiesActivity({ activity }: Props) {
  const activityName = getExtensionReadableName(activity)
  const activityRoute = getActivityRoute(activity)
  const Icon = activity.Icon
  const Component = activity.Component

  const handleMouseOver = () => Component.preload()

  const { t } = useTranslation()

  const translatedActivityName = t(activityName)

  return (
    <Link
      className="block"
      to={activityRoute}
      onMouseOver={handleMouseOver}
    >
      <div className="all-activities_activity">
        <div className="all-activities_activity_icon">
          <Icon />
        </div>

        <div className="all-activities_activity_name">{translatedActivityName}</div>
      </div>
    </Link>
  )
}
