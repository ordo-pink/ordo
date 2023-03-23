import { registerCommand, executeCommand, unregisterCommand } from "@ordo-pink/stream-commands"

export const useCommands = () => ({
  on: registerCommand,
  emit: executeCommand,
  off: unregisterCommand,
})
