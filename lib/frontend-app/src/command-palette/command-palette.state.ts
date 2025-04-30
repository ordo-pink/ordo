import { create_zags } from "@ordo-pink/zags"

import { CommandPalette } from "./command-palette.types"

export const command_palette$ = create_zags<CommandPalette.State>({ items: [] })
