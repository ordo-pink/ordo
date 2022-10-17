import type { OrdoCommand, UnaryFn } from "@core/types"

import React, { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { noOp } from "@core/utils/no-op"

import Accelerator from "@client/context-menu/components/accelerator"
import ActionListItem from "@client/common/action-list-item"

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
      icon={command.icon}
      isCurrent={isCurrent}
      text={t(command.title)}
    >
      <Accelerator accelerator={command.accelerator} />
    </ActionListItem>
  )
}
