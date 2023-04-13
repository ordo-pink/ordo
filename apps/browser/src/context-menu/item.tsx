import { ActionListItem, Accelerator, useCommands } from "@ordo-pink/react-utils"
import {
  ContextMenuItem as TContextMenuItem,
  hideContextMenu,
} from "@ordo-pink/stream-context-menu"
import { useTranslation } from "react-i18next"

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: { x: number; y: number; target: any; structure: TContextMenuItem[] }
  item: TContextMenuItem
}

export default function ContextMenuItem({ item, state }: Props) {
  const { emit } = useCommands()
  const { t } = useTranslation(item.extensionName)

  return (
    <ActionListItem
      key={item.name}
      Icon={item.Icon}
      isCurrent={false}
      onClick={() => {
        emit(item.name, item.payloadCreator(state.target))
        hideContextMenu()
      }}
      text={t(item.commandName)}
      disabled={item.disabled ? item.disabled(state.target) : false}
    >
      {item.accelerator ? <Accelerator accelerator={item.accelerator} /> : null}
    </ActionListItem>
  )
}
