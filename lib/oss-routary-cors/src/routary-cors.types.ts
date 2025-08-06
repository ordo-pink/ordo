/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Routary } from "@ordo-pink/oss-routary"

export type Args = [
	allowed_origins: string | string[],
	allowed_headers?: string[],
	allow_credentials?: boolean,
	max_age?: number,
	success_status?: number,
]

export type Instance<$Env extends Routary.Env, $Mut extends Routary.Mut> = Routary.OnceCallback<$Env, $Mut>

export type Create = <$Env extends Routary.Env, $Mut extends Routary.Mut>(...args: Args) => Instance<$Env, $Mut>

export type AfterEach = <$Env extends Routary.Env, $Mut extends Routary.Mut>(
	...args: Args
) => Routary.AfterEachCallback<$Env, $Mut>
