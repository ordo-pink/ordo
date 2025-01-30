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

import { ConsoleLogger } from "@ordo-pink/logger"
import { RRR } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"
import { ZAGS } from "@ordo-pink/zags"
import { call_once } from "@ordo-pink/tau"

import { CurrentUserRepository, PublicUserRepository } from "./data/user/user-repository.impl"
import { UserQuery } from "./data/user/user-query.impl"
import { ordo_app_state } from "../app.state"

export const init_user = call_once(() => {
	const { known_functions, logger } = ordo_app_state.zags.unwrap()

	logger.debug("🟡 Initialising metadata...")

	const current_user_repository = CurrentUserRepository.Of(current_user$)
	const public_user_repository = PublicUserRepository.Of(public_user$)

	// TODO Auth commands

	const user_query = UserQuery.Of(current_user_repository, public_user_repository, () => Result.Ok(void 0))

	ordo_app_state.zags.update("queries.user", () => user_query)

	logger.debug("🟢 Initialised metadata.")

	return {
		get_user_query: (fid: symbol) =>
			UserQuery.Of(current_user_repository, public_user_repository, permission =>
				Result.If(known_functions.has_permissions(fid, { queries: [permission] }), {
					F: () => {
						const rrr = RRR.codes.eperm(
							`MetadataQuery permission RRR. Did you forget to request query permission '${permission}'?`,
						)
						ConsoleLogger.error(rrr.debug?.join(" "))
						return rrr
					},
				}),
			),
	}
})

// --- Internal ---

// TODO Move to ordo_app_state
const current_user$ = ZAGS.Of({ user: null as Ordo.User.Current.Instance | null })
const public_user$ = ZAGS.Of({ known_users: [] as Ordo.User.Public.Instance[] })
