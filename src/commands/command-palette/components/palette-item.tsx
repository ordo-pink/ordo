import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import Accelerator from "$core/components/accelerator"
import ActionListItem from "$core/components/action-list/item"
import { OrdoCommand, UnaryFn } from "$core/types"
import { noOp } from "$core/utils/no-op"

type Props = {
  isCurrent: boolean
  command: OrdoCommand<string>
  onClick?: UnaryFn<OrdoCommand<string>, void>
}

export default function CommandPaletteItem({ command, isCurrent, onClick = noOp }: Props) {
  const { t } = useTranslation()

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    onClick(command)
  }

  return (
    <ActionListItem
      onClick={handleClick}
      Icon={command.Icon}
      isCurrent={isCurrent}
      text={t(command.title)}
    >
      <Accelerator accelerator={command.accelerator} />
    </ActionListItem>
  )
}
