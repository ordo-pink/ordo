import { UnaryFn } from "@ordo-pink/core"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import Accelerator from "$core/components/accelerator"
import ActionListItem from "$core/components/action-list/item"
import { OrdoCommand } from "$core/types"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"
import { noOp } from "$core/utils/no-op"

type Props = {
  isCurrent: boolean
  command: OrdoCommand<string>
  onClick?: UnaryFn<OrdoCommand<string>, void>
}

export default function CommandPaletteItem({ command, isCurrent, onClick = noOp }: Props) {
  const { t } = useTranslation()

  const translatedCommandTitle = t(command.title)

  const handleClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(() => command)
      .fold(onClick),
  )

  return (
    <ActionListItem
      onClick={handleClick}
      Icon={command.Icon}
      isCurrent={isCurrent}
      text={translatedCommandTitle}
    >
      {command.accelerator && <Accelerator accelerator={command.accelerator} />}
    </ActionListItem>
  )
}
