import type { OrdoCommand } from "@core/types"

import { useEffect } from "react"

import { addCommand } from "@client/command-palette/store"
import { useAppDispatch, useAppSelector } from "@client/common/hooks/state-hooks"

export const useCommands = (commands: OrdoCommand<string>[]) => {
  const dispatch = useAppDispatch()
  const registerredCommands = useAppSelector((state) => state.commandPalette.commands)

  useEffect(
    () => commands.forEach((command) => dispatch(addCommand(command))),
    [commands, registerredCommands]
  )
}
