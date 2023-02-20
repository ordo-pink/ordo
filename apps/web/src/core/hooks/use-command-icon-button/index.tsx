import { Null } from "@ordo-pink/react-components"
import { useTranslation } from "react-i18next"
import { OrdoCommandExtension, OrdoCommand } from "../../types"
import { useActionContext } from "../use-action-context"

import "./index.css"

// TODO: Refactor
export const useCommandIconButton = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  State extends Record<string, any>,
  T extends OrdoCommandExtension<string, State>,
>(
  extension: T,
  commandName: string,
) => {
  const command = extension.commands.find((c) => c.title === commandName)

  if (!command) return Null

  const ActionButtonIconComponent = () => <ActionButtonIcon command={command} />

  return ActionButtonIconComponent
}

type Props = {
  command: OrdoCommand<string>
}

const ActionButtonIcon = ({ command }: Props) => {
  const { Icon, accelerator, action, title } = command
  const { t } = useTranslation()

  const actionContext = useActionContext()

  const translatedTitle = `${t(title)} (${accelerator})`

  const handleClick = () => void action(actionContext)

  return (
    <div
      className="command-icon-button"
      onClick={handleClick}
      title={translatedTitle}
      role="none"
    >
      <Icon />
    </div>
  )
}
