import { registerCommand, executeCommand } from "@ordo-pink/stream-commands"

export const useCommands = () => ({
  register: registerCommand,
  execute: executeCommand,
})
