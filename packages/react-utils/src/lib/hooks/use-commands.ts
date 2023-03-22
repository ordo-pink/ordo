import { registerCommand, executeCommand, listenCommand } from "@ordo-pink/stream-commands"

export const useCommands = () => ({
  register: registerCommand,
  execute: executeCommand,
  on: listenCommand,
})
