import type { OrdoCommand } from "$core/types"

export type CommandPaletteState = {
  isShown: boolean
}

export type CommandPaletteExtensionStore = {
  "ordo-command-command-palette": CommandPaletteState
}

// This is required to let fuse search through translations, not original command keys.
export type SearchableCommand = OrdoCommand<string> & { title: `@${string}/${string}` }
