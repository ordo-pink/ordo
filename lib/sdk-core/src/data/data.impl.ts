import * as DATA from "./data.constants"
import * as Data from "./data.types"
import * as fns from "../fns/fns.impl"
import * as uuid from "../uuid/uuid.impl"

export const name_guard: Data.NameGuard = (x): x is Data.Name => fns.is_string(x)
export const parent_guard: Data.ParentGuard = (x): x is Data.Parent => uuid.guard(x) || fns.is_null(x)
