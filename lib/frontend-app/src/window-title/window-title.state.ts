import { create_zags } from "@ordo-pink/zags"

import type { WindowTitle } from "./window-title.types"

export const window_title$ = create_zags<WindowTitle.State>({})
