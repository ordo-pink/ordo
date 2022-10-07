import type { Activity } from "@client/activity-bar/types"

import React from "react"
import { useTranslation } from "react-i18next"

import { useActivityBarItemClass } from "@client/activity-bar/hooks/use-activity-bar-item-class"
import { selectActivity } from "@client/activity-bar/store"
import { useAppDispatch } from "@client/state"
import { useIcon } from "@client/use-icon"

type Props = Activity & { currentActivityName: string }

/**
 * Activity bar icon with title and click handler.
 */
export default function ActivityBarItem({ icon, name, currentActivityName }: Props) {
  const dispatch = useAppDispatch()
  const Icon = useIcon(icon)
  const className = useActivityBarItemClass({ name, currentActivityName })
  const { t } = useTranslation()

  const translatedTitle = t(`${name}.activity.title`)

  const handleClick = () => dispatch(selectActivity(name))

  return (
    <button onClick={handleClick} className="activity-bar-button">
      <Icon className={className} title={translatedTitle} />
    </button>
  )
}
