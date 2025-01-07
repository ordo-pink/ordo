/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Oath, ops0 } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import { CurrentUser } from "../../../../core/src/user.impl"
import { RRR } from "../../../../core/src/rrr"
import { ZAGS } from "@ordo-pink/zags"

const CURRENT_USER_REPOSITORY = "CurrentUserRepository"
const CURRENT_USER_REPOSITORY_ASYNC = "CurrentUserRepositoryAsync"
const PUBLIC_USER_REPOSITORY = "PublicUserRepository"

const eagain_current_user = RRR.codes.eagain(CURRENT_USER_REPOSITORY)
const einval_current_user_async = RRR.codes.einval(CURRENT_USER_REPOSITORY_ASYNC)
const eio_current_user_async = RRR.codes.eio(CURRENT_USER_REPOSITORY_ASYNC)

const einval_public_user = RRR.codes.einval(PUBLIC_USER_REPOSITORY)

// TODO Move to frontend-app
export const CurrentUserRepository: Ordo.User.Current.RepositoryStatic = {
	Of: $ => {
		const version_zags = ZAGS.Of({ version: 0 })
		$.marry((_, is_update) => is_update && version_zags.update("version", i => i + 1))

		return {
			get: () => Result.FromNullable($.select("user"), () => eagain_current_user()),
			put: user => Result.Try(() => $.update("user", () => user)), // TODO:
			get $() {
				return version_zags
			},
		}
	},
}

export const PublicUserRepository: Ordo.User.Public.RepositoryStatic = {
	Of: $ => {
		const version_zags = ZAGS.Of({ version: 0 })
		$.marry((_, is_update) => is_update && version_zags.update("version", i => i + 1))

		return {
			get: () => Oath.Resolve($.select("known_users")),
			put: () => Oath.Reject(einval_public_user("TODO: NOT IMPLEMENTED")),
			get $() {
				return version_zags
			},
		}
	},
}

export const CurrentUserRepositoryAsync: Ordo.User.Current.RepositoryAsyncStatic = {
	Of: (id_host, fetch) => ({
		get: token =>
			Oath.Resolve("/account" satisfies Ordo.Routes.ID.GetAccount.Path)
				.pipe(ops0.map(path => id_host.concat(path)))
				.pipe(ops0.chain(url => Oath.FromPromise(() => fetch(url, create_request_init(token)))))
				.pipe(ops0.chain(response => Oath.FromPromise(() => response.json())))
				.pipe(ops0.rejected_map(error => eio_current_user_async(error)))
				.pipe(ops0.chain(get_response_result0))
				.pipe(ops0.chain(validate_dto0))
				.pipe(ops0.map(CurrentUser.FromDTO)),

		put: () => Oath.Reject(eio_current_user_async("TODO: UNIMPLEMENTED")),
	}),
}

const create_request_init = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } })

const validate_dto0 = (result: unknown) =>
	Oath.If(CurrentUser.Validations.is_dto(result), {
		T: () => result as Ordo.User.Current.DTO,
		F: () => einval_current_user_async("Entity is not a user DTO", result),
	})

const get_response_result0 = (response_body: any) =>
	Oath.If(response_body.success, {
		T: () => response_body.result,
		F: () => einval_current_user_async("Request error occured", response_body.error),
	})
