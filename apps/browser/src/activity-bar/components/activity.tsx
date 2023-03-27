import { Activity } from "@ordo-pink/common-types"
import { Link, useCurrentActivity } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"

type Props = {
  activity: Activity
}

export default function ActivityBarActivity({ activity }: Props) {
  const activityName = activity.name
  const activityRoute = activity.routes[0]
  const Icon = activity.Icon

  const currentActivity = useCurrentActivity()

  const { t } = useTranslation()

  const translatedTitle = t(activityName) ?? activityName

  return (
    <Link
      title={translatedTitle}
      className={`!text-neutral-700 dark:!text-neutral-300 hover:!text-purple-600 dark:hover:!text-purple-400 transition-all duration-300 text-2xl leading-[0] rounded-lg ${
        currentActivity && currentActivity.name === activity.name
          ? "!text-pink-700 dark:!text-pink-500 hover:!text-purple-600 dark:hover:!text-purple-400"
          : ""
      }`}
      href={activityRoute}
    >
      <Icon />
    </Link>
  )
}
