import { create_zags } from "@ordo-pink/zags"

import type { ActivityBar } from "./activity-bar.types"

export const activity_bar$ = create_zags<ActivityBar.State>({ current: null, items: [] })
