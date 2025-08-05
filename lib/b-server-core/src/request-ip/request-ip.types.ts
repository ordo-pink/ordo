import type { Routary } from "@ordo-pink/oss-routary"

import type * as Lib from "../b-server-core.types"

export type Params<$Env extends Lib.Env, $Mut extends Routary.Mut> = Routary.BeforeEachCallbackParams<$Env, $Mut>

export type Mut = { request_ip: string }

export type Set = <$Env extends Lib.Env, $Mut extends Routary.Mut>(params: Params<$Env, $Mut>) => Mut
