import type { I18n } from "@ordo-pink/oss-i18n"
import type { Routary } from "@ordo-pink/oss-routary"

import type * as Lib from "../b-server-core.types"

export type Mut = { request_language: I18n.ISO_639_1_Locale }
export type Set = <const $Env extends Lib.Env, $Mut extends Routary.Mut>(params: Routary.HandlerParams<$Env, $Mut>) => Mut
