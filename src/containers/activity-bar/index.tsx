import { NavLink } from "react-router-dom"

import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"

import "$containers/activity-bar/index.css"

export default function ActivityBar() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  return (
    <div className="activity-bar">
      {activities.map(({ name, Icon }) => (
        <NavLink
          key={name}
          to={name.replace("ordo-activity-", "")}
          className="activity-bar__link"
        >
          <Icon />
        </NavLink>
      ))}
    </div>
  )
}
