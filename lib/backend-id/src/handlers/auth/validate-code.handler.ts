import { Oath } from "@ordo-pink/oath"

import { default_handler } from "../default.handler"

export const handle_validate_code = default_handler(Oath.Resolve)
