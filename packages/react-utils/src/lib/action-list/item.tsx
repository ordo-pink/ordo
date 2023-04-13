import { noOp } from "@ordo-pink/fns"
import {
  ComponentType,
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from "react"

import "./item.css"

type Props = {
  text: string
  Icon: ComponentType
  isCurrent: boolean
  isLarge?: boolean
  style?: CSSProperties
  disabled?: boolean
  onClick?: MouseEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onContextMenu?: MouseEventHandler
  onEnterKeyDown?: KeyboardEventHandler
}

export const ActionListItem = ({
  Icon,
  text,
  style = {},
  children,
  isCurrent,
  isLarge,
  disabled,
  onClick = noOp,
  onMouseEnter = noOp,
  onMouseLeave = noOp,
  onContextMenu = noOp,
  onEnterKeyDown = noOp,
}: PropsWithChildren<Props>) => {
  const right = Array.isArray(children) ? children[0] : children
  const bottom = Array.isArray(children) ? children[1] : null

  return (
    <div>
      <div
        className={`action-list-item select-none ${isLarge && "px-4 py-2 text-lg"} ${
          disabled
            ? "text-neutral-300 dark:text-neutral-400"
            : "hover:bg-gradient-to-r from-rose-300/40 dark:from-slate-600 to-purple-300/40 dark:to-gray-600 cursor-pointer"
        } ${isCurrent && "active"}`}
        style={style}
        onClick={(e) => (disabled ? void 0 : onClick(e))}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        role="none"
        onKeyDown={onEnterKeyDown}
      >
        <div className="flex items-center space-x-2 w-full truncate">
          <div className="shrink-0">
            <Icon />
          </div>
          <div className="text-sm truncate">{text}</div>
        </div>
        <div className="shrink-0">{right}</div>
      </div>
      <div className="action-list_item_bottom">{bottom}</div>
    </div>
  )
}
