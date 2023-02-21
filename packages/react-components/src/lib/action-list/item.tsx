import { noOp } from "@ordo-pink/fns"
import {
  ComponentType,
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from "react"

type Props = {
  text: string
  Icon: ComponentType
  isCurrent: boolean
  style?: CSSProperties
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
        className={`py-2 md:py-0.5 hover:bg-gradient-to-r hover:from-neutral-300 hover:dark:from-stone-700 hover:to-slate-300 hover:dark:to-slate-700 rounded-md px-2 flex justify-between items-center cursor-pointer ${
          isCurrent &&
          "bg-gradient-to-r from-rose-300 dark:from-violet-700 to-purple-300 dark:to-purple-700"
        }`}
        style={style}
        onClick={onClick}
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
