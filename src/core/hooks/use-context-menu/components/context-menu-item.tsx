import Accelerator from "$core/components/accelerator"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { Nullable } from "$core/types"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { hideContextMenu } from "../store"
import { ContextMenuTemplateItem as TContextMenuItem, ContextMenuTarget } from "../types"

type Props = {
  item: TContextMenuItem
}

export default function ContextMenuItem({ item }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const target = useAppSelector((state) => state.contextMenu.target)

  const Icon = item.Icon
  const title = t(item.title)

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    dispatch(hideContextMenu())

    if (item.action) {
      item.action({ contextMenuTarget: target })
    }
  }

  // TODO: Add key handling
  return (
    <div
      className="hover-passive px-4 py-1 text-sm flex items-center justify-between space-x-4"
      onClick={handleClick}
      onKeyDown={() => void 0}
      role="button"
      tabIndex={-2}
    >
      <div className="flex items-center space-x-2">
        <div className="shrink-0">
          <Icon />
        </div>
        <div
          title={title}
          className="truncate"
        >
          {title}
        </div>
      </div>
      <Accelerator accelerator={item.accelerator} />
    </div>
  )
}
