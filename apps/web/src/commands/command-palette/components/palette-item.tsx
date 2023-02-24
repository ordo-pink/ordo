import { UnaryFn } from "@ordo-pink/common-types"
import { OrdoCommand } from "@ordo-pink/extensions"
import { noOp, lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Accelerator, ActionListItem } from "@ordo-pink/react"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

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
