import { Accelerator, Null } from "@ordo-pink/react-components"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { hideContextMenu } from "../../../../../containers/app/hooks/use-context-menu/store"
import { ContextMenuTemplateItem } from "../../../../../containers/app/hooks/use-context-menu/types"
import { useActionContext } from "../../../../../core/hooks/use-action-context"
import { useAppDispatch } from "../../../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../../../core/state/hooks/use-app-selector"
import { preventDefault, stopPropagation } from "../../../../../core/utils/event"
import { lazyBox } from "../../../../../core/utils/lazy-box"

type Props = {
  item: ContextMenuTemplateItem
}

export default function ContextMenuItem({ item }: Props) {
  const dispatch = useAppDispatch()

  const target = useAppSelector((state) => state.contextMenu.target)

  const actionContext = useActionContext(target)

  const handleClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(() => dispatch(hideContextMenu()))
      .map(() => actionContext)
      .fold((ctx) => item.action(ctx)),
  )

  const { t } = useTranslation()

  const Icon = item.Icon ?? Null
  const translatedTitle = t(item.title)

  return (
    <div
      className="px-4 py-1 text-sm flex items-center justify-between space-x-4 hover-active"
      onClick={handleClick}
      role="none"
    >
      <div className="flex items-center space-x-2">
        <div className="shrink-0">
          <Icon />
        </div>
        <div
          title={translatedTitle}
          className="truncate"
        >
          {translatedTitle}
        </div>
      </div>
      {item.accelerator && <Accelerator accelerator={item.accelerator} />}
    </div>
  )
}
