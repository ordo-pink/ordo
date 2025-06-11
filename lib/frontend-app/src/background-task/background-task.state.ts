import { BACKGROUND_TASK } from "@ordo-pink/sdk-client"
import { create_zags } from "@ordo-pink/zags"

import type { BackgroundTask } from "./background-task.types"

export const background_task$ = create_zags<BackgroundTask.State>({ status: BACKGROUND_TASK.STATUS.NONE })
