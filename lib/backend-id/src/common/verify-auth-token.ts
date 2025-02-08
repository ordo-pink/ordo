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

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"
import { unknown_error } from "@ordo-pink/backend-util-extract-body"

import { type TIDContext } from "../backend-id.types"
import { invalid_token_rrr } from "../rrrs/invalid-token.rrr"

export const verify_auth_token = (intake: TIntake<TIDContext>) => (token: string) =>
	Oath.FromPromise(() => intake.wjwt.verify(token))
		.pipe(ops0.rejected_map(error => ({ rrr: RRR.codes.einval(error.message, error.name, error.cause, error.stack), intake })))
		.and(v => Oath.If(v, { T: () => token, F: () => invalid_token_rrr(intake) }))
		.and(token =>
			Oath.Try(() => intake.wjwt.decode(token))
				.pipe(ops0.rejected_map(error => unknown_error(error, intake)))
				.and(({ payload }) => intake.token_persistence_strategy.get_token(payload.sub, payload.jti))
				.and(({ exp }) => Oath.If(exp * 1000 >= Date.now(), { F: () => invalid_token_rrr(intake) }))
				.and(() => token),
		)

export const verify_persisted_auth_token = (intake: TIntake<TIDContext>) => (token: string) =>
	Oath.Try(() => intake.wjwt.decode(token))
		.pipe(ops0.rejected_map(error => unknown_error(error, intake)))
		.and(({ payload }) => intake.token_persistence_strategy.get_token(payload.sub, payload.jti))
		.and(({ exp }) => Oath.If(exp * 1000 >= Date.now(), { F: () => invalid_token_rrr(intake) }))
		.and(() => token)
