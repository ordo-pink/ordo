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

import { Readable } from "stream"
import chalk from "chalk"

import { chain0, empty0, fromBoolean0, fromNullable0, map0, merge0 } from "@ordo-pink/oath"
import { ConsoleLogger } from "@ordo-pink/logger"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-content-fs"
import { FSID } from "@ordo-pink/data"
import { Router } from "@ordo-pink/routary"

const ROUTE = /\/(?<userId>([a-zA-Z0-9-]+))\/(?<path>(.*))\/?/

// TODO: const port = Bun.env.ORDO_PUB_HOST! and other vars

const port = "3006"
const root = "./var/srv/pub"

const main = () => {
	const persistenceStrategy = ContentPersistenceStrategyFS.of({ root })

	const router = Router.create()
		.get(ROUTE, ctx => {
			return fromNullable0(ROUTE.exec(new URL(ctx.req.url).pathname)?.groups)
				.pipe(
					chain0(({ userId, path }) =>
						merge0({
							userId: fromBoolean0(!!userId, userId as FSID), // TODO: isUUID
							path: fromBoolean0(!!path, path), // TODO: is path
						}),
					),
				)
				.pipe(chain0(({ userId, path }) => persistenceStrategy.read(userId, `${path}.html` as any)))
				.pipe(map0(Readable.toWeb))
				.pipe(map0(body => ctx.res.setBody(body)))
		})
		.post(ROUTE, ctx => empty0().pipe(map0(() => ctx.res.setBody("TBD"))))
		.put(ROUTE, ctx => empty0().pipe(map0(() => ctx.res.setBody("TBD"))))
		.delete(ROUTE, ctx => empty0().pipe(map0(() => ctx.res.setBody("TBD"))))

	Bun.serve({
		port,
		fetch: router.orElse(ctx => {
			ctx.res.setBody("Not found")
			ctx.res.setStatus(404)
		}),
	})

	ConsoleLogger.info(`PUB running on http://localhost:${chalk.blue(port)}`)
}

main()
