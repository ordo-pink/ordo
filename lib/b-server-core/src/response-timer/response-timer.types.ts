import type { Routary } from "@ordo-pink/oss-routary"

import type * as Lib from "../b-server-core.types"

export type Params<$Env extends Lib.Env, $Mut extends Routary.Mut> = Routary.BeforeEachCallbackParams<$Env, $Mut>

export type Mut = { response_time: number }

export type Start = <$Env extends Lib.Env, $Mut extends Routary.Mut>(params: Params<$Env, $Mut>) => Mut

export type End = <$Env extends Lib.Env, $Mut extends Mut>(params: Routary.AfterEachCallbackParams<$Env, $Mut>) => Mut
