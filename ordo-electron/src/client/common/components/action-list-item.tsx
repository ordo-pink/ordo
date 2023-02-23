import React, { CSSProperties, MouseEventHandler, PropsWithChildren } from "react"

import { IconName, useIcon } from "@client/common/hooks/use-icon"
import { noOp } from "@client/common/utils/no-op"

type Props = {
  text: string
  icon?: IconName
  isCurrent: boolean
  style?: CSSProperties
  onClick?: MouseEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onContextMenu?: MouseEventHandler
}

export default function ActionListItem({
  icon,
  text,
  style = {},
  children,
  isCurrent,
  onClick = noOp,
  onMouseEnter = noOp,
  onMouseLeave = noOp,
  onContextMenu = noOp,
}: PropsWithChildren<Props>) {
  const Icon = useIcon(icon)

  const right = Array.isArray(children) ? children[0] : children
  const bottom = Array.isArray(children) ? children.slice(1) : null

  return (
    <div>
      <div
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        className={`hover-passive rounded-md px-2 py-0.5 flex justify-between items-center ${
          isCurrent &&
          "bg-gradient-to-r from-rose-300 dark:from-violet-700 to-purple-300 dark:to-purple-700"
        }`}
      >
        <div className="flex items-center space-x-2 w-full">
          <Icon className="shrink-0" />
          <div className="text-sm truncate">{text}</div>
        </div>
        <div className="shrink-0">{right}</div>
      </div>
      <div>{bottom}</div>
    </div>
  )
}
