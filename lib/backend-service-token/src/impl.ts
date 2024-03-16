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

import { randomUUID } from "crypto"
import { WJWT } from "@ordo-pink/wjwt"

import { Oath } from "@ordo-pink/oath"
import { TTokenService, TokenPersistenceStrategy, TokenServiceOptions } from "./types"
import { Switch } from "@ordo-pink/switch"
import { UUIDv4 } from "@ordo-pink/tau"

type Params = { persistenceStrategy: TokenPersistenceStrategy; options: TokenServiceOptions }

export const TokenService = {
	of: ({ persistenceStrategy, options }: Params): TTokenService => {
		const refreshWJWT = WJWT({
			alg: options.alg,
			privateKey: options.keys.refresh.privateKey,
			publicKey: options.keys.refresh.publicKey,
		})

		const accessWJWT = WJWT({
			alg: options.alg,
			privateKey: options.keys.access.privateKey,
			publicKey: options.keys.access.publicKey,
		})

		const wjwt = (type: "access" | "refresh") =>
			Switch.of(type)
				.case("refresh", () => refreshWJWT)
				.default(() => accessWJWT)

		return {
			persistenceStrategy,
			verifyToken: (token, type) =>
				wjwt(type)
					.verify0(token)
					.fix(() => false),
			getPayload: (token, type) =>
				wjwt(type)
					.verify0(token)
					.chain(valid =>
						Oath.fromBoolean(
							() => valid,
							() => token,
							() => null,
						),
					)
					.chain(token => wjwt(type).decode0(token))
					.map(jwt => jwt.payload as any)
					.chain(payload =>
						persistenceStrategy.getToken(payload.sub, payload.jti).map(() => payload),
					)
					.fix(() => null),
			decode: token =>
				wjwt("access")
					.decode0(token)
					.fix(() => null) as any,
			createPair: ({ sub, prevJti, aud = ["https://ordo.pink"], data = {} }) =>
				Oath.all({
					jti: randomUUID() as UUIDv4,
					iat: Math.floor(Date.now() / 1000),
					iss: "https://id.ordo.pink",
					aexp: Math.floor(Date.now() / 1000) + options.accessTokenExpireIn,
					rexp: Math.floor(Date.now() / 1000) + options.refreshTokenExpireIn,
					sub,
					aud,
				}).chain(({ jti, iat, iss, aexp, rexp, sub, aud }) =>
					Oath.all({
						jti,
						iat,
						iss,
						exp: rexp,
						sub,
						aud,
						tokens: Oath.all({
							access: accessWJWT.sign0({ ...data, jti, iat, iss, exp: aexp, sub, aud }),
							refresh: refreshWJWT.sign0({ ...data, jti, iat, iss, exp: rexp, sub, aud }),
						}),
					}).chain(res =>
						prevJti
							? persistenceStrategy
									.removeToken(sub, prevJti)
									.chain(() => persistenceStrategy.setToken(sub, jti, res.tokens.refresh))
									.map(() => res as any)
							: Oath.empty()
									.chain(() => persistenceStrategy.setToken(sub, jti, res.tokens.refresh))
									.map(() => res),
					),
				),
		}
	},
}
