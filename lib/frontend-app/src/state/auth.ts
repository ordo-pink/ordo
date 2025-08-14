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

import { type Maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { type Zags, create_zags } from "@ordo-pink/oss-zags"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import type { Core } from "@ordo-pink/sdk-core"
import { noop } from "@ordo-pink/_tau"
import { oath } from "@ordo-pink/oss-oath"

/**
 * Auth jab is responsible for providing means of signing in and out.
 */
export const auth_jab: (
	fetch: ClientSDK.Fetch,
	hosts: Core.Hosts,
	hunter: ClientSDK.Hunter,
) => Maoka.Jab<Zags.Instance<ClientSDK.User.State>> =
	(fetch, hosts, hunter) =>
	({ use }) => {
		const handle_mount = () => {
			const refresh_session0 = oath
				.of(new Headers())
				.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" }) as const))
				.pipe(
					oath.ops.chain(init =>
						oath.from_promise(() =>
							fetch(`${hosts.id}/auth/refresh`, init).then(res => (res.status < 300 ? res.json() : Promise.reject())),
						),
					),
				)
				.pipe(oath.ops.tap(user => auth$.update("user", () => user)))

			// TODO Sign out on error, show notification
			refresh_session0
				.cata(oath.catas.to_promise())
				.catch(noop)
				.finally(() => hunter.shoot("background_status.none"))

			return () => {
				refresh_session0.cancel("Root component refreshed")
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))

		return auth$
	}

// --- Internal ---

const auth$ = create_zags<ClientSDK.User.State>({})
