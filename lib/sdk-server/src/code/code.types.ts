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
import type { Oath } from "@ordo-pink/oss-oath"

export type Instance = string & {}
export type HashedInstance = string & {}

export type Guard = (x: any) => x is Instance

export type Value = [timestamp: Core.Timestamp.Instance, hash: HashedInstance]

export type Storage = Map<Core.User.Email, readonly [timestamp: Core.Timestamp.Instance, hash: HashedInstance][]>

export type Service = {
	assign_code: (email: Core.User.Email) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	verify_code: (email: Core.User.Email, code: Instance) => Oath.Instance<boolean, Core.Rrr.Instance<"EIO" | "ENOENT">>
	die: () => void
}

export type CreateServiceArgs = [codegen: Codegen, lifetime_seconds: number, logger: Core.Logger]

export type CreateService = (...args: CreateServiceArgs) => Service

export type Create = () => Instance

export type Codegen = {
	hash: (code: Instance) => Oath.Instance<HashedInstance, Core.Rrr.Instance<"EIO">>
	verify: (code: Instance, hash: HashedInstance) => Oath.Instance<boolean, Core.Rrr.Instance<"EIO">>
}
