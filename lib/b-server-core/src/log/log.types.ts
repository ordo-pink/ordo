import type { Routary } from "@ordo-pink/oss-routary"

import type * as Lib from "../b-server-core.types"

export type Request = <$Env extends Lib.Env, $Mut extends Lib.Mut>(params: Routary.AfterEachCallbackParams<$Env, $Mut>) => {}
