import { Oath } from "@ordo-pink/oath"

import { default_handler } from "../default.handler"

export const handle_refresh = default_handler(Oath.Resolve)
