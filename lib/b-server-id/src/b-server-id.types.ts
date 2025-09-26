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

import type { Routary } from "@ordo-pink/oss-routary"
import type { Server } from "@ordo-pink/sdk-server"
import type { ServerRoutary } from "@ordo-pink/sdk-server-routary"

export type Email = string & {}

export type RoutaryHandler = Routary.Handler<Env, Mut>

export type Args = []

export type Instance = Routary.Instance<Env, ServerRoutary.Mut>

export type Create = (...args: Args) => Instance

export type Mut = ServerRoutary.Mut
export type Env = ServerRoutary.Env & {
	user_service: User.Service
	session_service: Session.Service
	auth_code_service: AuthCode.Service
	notification_service: Server.Notification.Service
}

export namespace User {
	export type Repository = {}

	export type Service = {}
}

export namespace Session {
	export type LifetimeMinutes = number & {}

	export type Repository = {}

	export type Service = {}
}

export namespace AuthCode {
	export type LifetimeSeconds = number & {}

	export type Instance = string & {}
	export type Hash = string & {}

	export type Guard = (x: any) => x is Instance
	export type CreateServiceArgs = [
		generation_strategy: GenerationStrategy,
		repository: Repository,
		lifetime_seconds: LifetimeSeconds,
		logger: Ordo.Logger,
	]
	export type CreateService = (...args: CreateServiceArgs) => Service

	export type Repository = {
		create: Ordo.Fns.Curried<(email: Email, code: Hash) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "EEXIST">>>
		read: (email: Email) => Oath.Instance<Hash, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		update: Ordo.Fns.Curried<(email: Email, code: Hash) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT" | "EEXIST">>>
		delete: Ordo.Fns.Curried<(email: Email, code: Hash) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT">>>
	}

	export type GenerationStrategy = {
		hash: (code: Instance) => Oath.Instance<Hash, Ordo.Rrr.Instance<"EIO">>
		verify: Ordo.Fns.Curried<(code: Instance, hash: Hash) => Oath.Instance<boolean, Ordo.Rrr.Instance<"EIO">>>
	}

	export type Service = Ordo.Disposable<{
		create: (email: Ordo.User.Email) => Oath.Instance<Instance, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		verify: Ordo.Fns.Curried<
			(email: Ordo.User.Email, code: Instance) => Oath.Instance<boolean, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		>
	}>
}
