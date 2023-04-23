import {
  registerCommand,
  executeCommand,
  unregisterCommand,
  prependListener,
  appendListener,
} from "@ordo-pink/stream-commands"

export const useCommands = () => ({
  before: prependListener,
  after: appendListener,
  on: registerCommand,
  emit: executeCommand,
  off: unregisterCommand,
})

export const wieldCommands = () => ({
  before: prependListener,
  after: appendListener,
  on: registerCommand,
  emit: executeCommand,
  off: unregisterCommand,
})
