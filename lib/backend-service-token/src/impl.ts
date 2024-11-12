// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Oath, ops0 } from "@ordo-pink/oath"
import { O } from "@ordo-pink/option"
import { RRR } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { WJWT } from "@ordo-pink/wjwt"

import { type TAuthJWT, type TTokenServiceStatic } from "./types"

export const TokenService: TTokenServiceStatic = {
	of: (strategy, { alg, audience, at_expire_in, issuer, keys, rt_expire_in }) => {
		const refresh_wjwt = WJWT({
			alg,
			privateKey: keys.refresh.privateKey,
			publicKey: keys.refresh.publicKey,
		})

		const access_wjwt = WJWT({
			alg: alg,
			privateKey: keys.access.privateKey,
			publicKey: keys.access.publicKey,
		})

		const wjwt = (type: "access" | "refresh") =>
			Switch.of(type)
				.case("refresh", () => refresh_wjwt)
				.default(() => access_wjwt)

		return {
			strategy,

			verify: (token, type) =>
				wjwt(type)
					.verify0(token)
					.pipe(ops0.rejected_map(error => einval(`verify -> error: ${error}`))),

			get_payload: (token, type) =>
				wjwt(type)
					.verify0(token)
					.pipe(ops0.chain(valid => Oath.If(valid, { T: () => token })))
					.pipe(ops0.chain(token => wjwt(type).decode0(token)))
					.pipe(ops0.rejected_map(error => einval(`get_payload -> error: ${error}`)))
					.pipe(ops0.map(jwt => jwt.payload as any))
					.pipe(
						ops0.chain(payload =>
							strategy.get_token(payload.sub, payload.jti).pipe(ops0.map(() => O.Some(payload))),
						),
					),

			decode: token =>
				wjwt("access")
					.decode0(token)
					.pipe(ops0.map(jwt => O.Some(jwt as TAuthJWT)))
					.pipe(ops0.rejected_map(error => einval(`decode -> error: ${error}`))),

			create: ({ sub, aud = audience, data }) =>
				Oath.Resolve({
					jti: crypto.randomUUID(),
					iat: Math.floor(Date.now() / 1000),
					iss: issuer,
					aexp: Math.floor(Date.now() / 1000) + at_expire_in,
					rexp: Math.floor(Date.now() / 1000) + rt_expire_in,
					sub,
					aud,
				})
					.pipe(
						ops0.chain(({ jti, iat, iss, aexp, rexp, sub, aud }) =>
							Oath.Merge({
								...data,
								jti,
								iat,
								iss,
								exp: rexp,
								sub,
								aud,
								tokens: Oath.Merge({
									access: access_wjwt
										.sign0({ ...data, jti, iat, iss, exp: aexp, sub, aud })
										.pipe(ops0.rejected_map(e => einval(e))),
									refresh: refresh_wjwt
										.sign0({ ...data, jti, iat, iss, exp: rexp, sub, aud })
										.pipe(ops0.rejected_map(e => einval(e))),
								}),
							}).pipe(
								ops0.chain(res =>
									strategy.set_token(sub, jti, res.tokens.refresh).pipe(ops0.map(() => res)),
								),
							),
						),
					)
					.pipe(
						ops0.map(({ aud, exp, iat, iss, jti, lim, mfs, mxf, sbs, sub, tokens }) => ({
							aud,
							exp,
							iat,
							iss,
							jti,
							lim,
							mfs,
							mxf,
							sbs,
							sub,
							token: tokens.access,
						})),
					),
		}
	},
}

// --- Internal ---

const einval = RRR.codes.einval("TokenService")
