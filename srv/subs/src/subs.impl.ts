// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getc } from "@ordo-pink/getc"
import { FSID } from "@ordo-pink/data"
import { ConsoleLogger } from "@ordo-pink/logger"
import { createSubsServer } from "@ordo-pink/backend-server-subs"
import { RusenderEmailStrategy } from "@ordo-pink/backend-email-strategy-rusender"
import { DataPersistenceStrategyFS } from "@ordo-pink/backend-data-persistence-strategy-fs"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-content-persistence-strategy-fs"

const {
	SUBS_PORT,
	WORKSPACE_HOST,
	WEB_HOST,
	SUBS_CONTENT_PATH,
	SUBS_DATA_PATH,
	SUBS_DATA_OWNER,
	SUBS_EMAIL_API_KEY,
} = getc([
	"SUBS_PORT",
	"SUBS_DATA_OWNER",
	"SUBS_EMAIL_API_KEY",
	"SUBS_CONTENT_PATH",
	"SUBS_DATA_PATH",
	"WORKSPACE_HOST",
	"WEB_HOST",
])

const main = async () => {
	const emailRepository = RusenderEmailStrategy.of(SUBS_EMAIL_API_KEY)
	const contentPersistenceStrategy = ContentPersistenceStrategyFS.of({ root: SUBS_CONTENT_PATH })
	const dataPersistenceStrategy = DataPersistenceStrategyFS.of({ root: SUBS_DATA_PATH })

	const app = await createSubsServer({
		constantDataOwner: SUBS_DATA_OWNER as FSID,
		contentPersistenceStrategy,
		dataPersistenceStrategy,
		logger: ConsoleLogger,
		emailStrategy: emailRepository,
		origin: [WEB_HOST, WORKSPACE_HOST],
		websiteHost: WEB_HOST,
		notificationSender: { name: "Hello at Ordo.pink", email: "hello@ordo.pink" },
	})

	ConsoleLogger.info(`SB server running on http://localhost:${SUBS_PORT}`)

	app.listen({ port: Number(SUBS_PORT) })
}

main()
