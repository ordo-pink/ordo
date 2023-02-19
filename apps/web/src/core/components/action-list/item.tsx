import {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from "react"
import { OrdoLoadableComponent } from "../../types"
import { noOp } from "../../utils/no-op"

import "./index.css"

type Props = {
  text: string
  Icon: OrdoLoadableComponent | FC
  isCurrent: boolean
  style?: CSSProperties
  onClick?: MouseEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onContextMenu?: MouseEventHandler
  onEnterKeyDown?: KeyboardEventHandler
}

export default function ActionListItem({
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
}: PropsWithChildren<Props>) {
  const right = Array.isArray(children) ? children[0] : children
  const bottom = Array.isArray(children) ? children[1] : null

  return (
    <div>
      <div
        className={`action-list_item ${isCurrent && "active"}`}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        role="none"
        onKeyDown={onEnterKeyDown}
      >
        <div className="action-list_item_left">
          <div className="action-list_item_left_icon">
            <Icon />
          </div>
          <div className="action-list_item_left_text">{text}</div>
        </div>
        <div className="action-list_item_right">{right}</div>
      </div>
      <div className="action-list_item_bottom">{bottom}</div>
    </div>
  )
}
