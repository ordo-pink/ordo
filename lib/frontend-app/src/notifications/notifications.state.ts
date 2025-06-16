import { create_zags } from "@ordo-pink/zags"

import type { Notifications } from "./notifications.types"

export const notifications$ = create_zags<Notifications.State>({ items: [], progress_bars: {} })
