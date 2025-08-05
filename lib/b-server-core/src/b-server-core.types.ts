/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { Core } from "@ordo-pink/sdk-core"
import type { Routary } from "@ordo-pink/oss-routary"

import type * as RequestIP from "./request-ip/request-ip.types"
import type * as RequestId from "./request-id/request-id.types"
import type * as RequestLang from "./request-lang/request-lang.types"
import type * as ResponseTimer from "./response-timer/response-timer.types"

export type Env = Routary.Env & { logger: Core.Logger }
export type Mut = Routary.Mut & RequestId.Mut & ResponseTimer.Mut & RequestLang.Mut & RequestIP.Mut

export type Create = <$Env extends Env, $Mut extends Routary.Mut>(env: $Env, mut?: $Mut) => Routary.Instance<$Env, $Mut & Mut>
