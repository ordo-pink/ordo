import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { OrdoActivityExtension } from "$core/types"

type Props = Pick<OrdoActivityExtension<string>, "name" | "readableName" | "Icon">

export default function Activity({ name, readableName, Icon }: Props) {
  const { t } = useTranslation()
  const activityName = readableName ? t(readableName) : name

  return (
    <Link
      className="block"
      to={name.replace("ordo-activity-", "/")}
    >
      <div className="all-activities_activity">
        <div className="all-activities_activity_icon">
          <Icon />
        </div>
        <div className="all-activities_activity_name">{activityName}</div>
      </div>
    </Link>
  )
}
