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
import type { ServerRoutary } from "@ordo-pink/sdk-server-routary"
import type { Wjwt } from "@ordo-pink/oss-wjwt"

export type RoutaryHandler = Routary.Handler<Env, Mut>

export type Args = {
	auth_code_generation_strategy: Ordo.Code.Server.HashingStrategy
	auth_code_repository: Ordo.Code.Server.Repository
	auth_code_lifetime_seconds: Ordo.Code.Server.AuthCodeLifetimeSeconds
	session_repository: Ordo.Session.Server.Repository
	session_lifetime_minutes: Ordo.Session.Server.LifetimeMinutes
	user_repository: Ordo.User.Server.Repository
	email_strategy: Ordo.Notification.Server.Email.Strategy
	wjwt: Wjwt.Instance
	default_allowed_origins: string | string[]
	logger: Ordo.Logger
}

export type Instance = Routary.Instance<Env, ServerRoutary.Mut>

export type Create = (args: Args) => Instance

export type Mut = ServerRoutary.Mut
export type Env = Ordo.Prettify<
	ServerRoutary.Env & {
		code_service: Code.Service
		notification_service: Notification.Service
		session_service: Session.Service
		token_service: Token.Service
		user_service: User.Service
	}
>

export namespace Token {
	export type Service = {
		create0: (uid: Ordo.User.Id, sid: Ordo.Session.Server.Id) => Oath.Instance<Wjwt.SignResult, Ordo.Rrr.Instance<"EIO">>
		verify0: (
			token?: string | null,
		) => Oath.Instance<Wjwt.Token<{ sub: Ordo.User.Id; jti: Ordo.Session.Server.Id }>, Ordo.Rrr.Instance<"EIO" | "EINVAL">>
	}

	export type CreateServiceArgs = [wjwt: Wjwt.Instance<{ sub: Ordo.User.Id; jti: Ordo.Session.Server.Id }>]

	export type CreateService = (...args: CreateServiceArgs) => Service
}

export namespace User {
	export type Service = {
		get_or_create_user0: (
			email: Ordo.User.Email,
		) => Oath.Instance<{ is_new: boolean; user: Ordo.User.Instance }, Ordo.Rrr.Instance<"EIO" | "EEXIST">>

		get_public_user_by_email0: (
			email: Ordo.User.Email,
		) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"ENOENT" | "EIO">>

		get_public_user_by_ref0: (ref: Ordo.User.Ref) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"ENOENT" | "EIO">>

		get_user_by_id0: (id: Ordo.User.Id) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"ENOENT" | "EIO">>

		update_email0: Ordo.Fns.Curried<
			(
				old_email: Ordo.User.Email,
				new_email: Ordo.User.Email,
			) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"ENOENT" | "EEXIST" | "EIO">>
		>

		update_ref0: Ordo.Fns.Curried<
			(
				id: Ordo.User.Id,
				new_ref: Ordo.User.Ref,
			) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"ENOENT" | "EEXIST" | "EIO">>
		>

		update_name0: Ordo.Fns.Curried<
			(
				id: Ordo.User.Id,
				name: Ordo.User.Name,
			) => Oath.Instance<Ordo.User.Instance, Ordo.Rrr.Instance<"ENOENT" | "EEXIST" | "EIO">>
		>

		kill: () => void
	}

	export type CreateServiceArgs = [user_repository: Ordo.User.Server.Repository]

	export type CreateService = (...args: CreateServiceArgs) => Service
}

export namespace Session {
	export type Service = {
		get_sessions0: (id: Ordo.User.Id) => Oath.Instance<Ordo.Session.Server.Instance[], Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		sign_in0: Ordo.Fns.Curried<
			(id: Ordo.User.Id, info: string) => Oath.Instance<Ordo.Session.Server.Id, Ordo.Rrr.Instance<"EIO" | "EEXIST">>
		>
		sign_out0: Ordo.Fns.Curried<
			(uid: Ordo.User.Id, sid: Ordo.Session.Server.Id) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		>
		refresh0: Ordo.Fns.Curried<
			(
				uid: Ordo.User.Id,
				sid: Ordo.Session.Server.Id,
			) => Oath.Instance<[Ordo.Session.Server.Instance, Ordo.User.Instance], Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		>
		verify0: Ordo.Fns.Curried<
			(
				uid: Ordo.User.Id,
				sid: Ordo.Session.Server.Id,
			) => Oath.Instance<Ordo.Session.Server.Instance, Ordo.Rrr.Instance<"EIO" | "ENOENT" | "EINVAL">>
		>
		kill: () => void
	}

	export type CreateServiceArgs = [
		session_repository: Ordo.Session.Server.Repository,
		lifetime_minutes: Ordo.Session.Server.LifetimeMinutes,
	]

	export type CreateService = (...args: CreateServiceArgs) => Service
}

export namespace Notification {
	export type Service = {
		code_requested: Ordo.Fns.Curried<(email: Ordo.User.Email, code: Ordo.Code.Server.Code) => void>
		signed_up: (email: Ordo.User.Email) => void
		signed_in: Ordo.Fns.Curried<(email: Ordo.User.Email, ip: string, device_info: string) => void>
		email_change_requested: Ordo.Fns.Curried<
			(old_email: Ordo.User.Email, new_email: Ordo.User.Email, code: Ordo.Code.Server.Code) => void
		>
		email_changed: (old_email: Ordo.User.Email) => void
		kill: () => void
	}

	export type CreateServiceArgs = [email_strategy: Ordo.Notification.Server.Email.Strategy]

	export type CreateService = (...args: CreateServiceArgs) => Service
}

export namespace Code {
	export type Service = {
		create0: Ordo.Fns.Curried<
			(
				email: Ordo.User.Email,
				usage: Ordo.Code.Server.Usage,
			) => Oath.Instance<Ordo.Code.Server.Code, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		>
		verify0: Ordo.Fns.Curried<
			(
				email: Ordo.User.Email,
				code: Ordo.Code.Server.Code,
				usage: Ordo.Code.Server.Usage,
			) => Oath.Instance<boolean, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		>
		kill: () => void
	}

	export type CreateServiceArgs = [
		code_hashing_strategy: Ordo.Code.Server.HashingStrategy,
		code_repository: Ordo.Code.Server.Repository,
	]

	export type CreateService = (...args: CreateServiceArgs) => Service
}
