// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Readable } from "stream"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { createServer } from "@ordo-pink/backend-utils"
import {
	EmailContact,
	EmailStrategy,
	NotificationService,
} from "@ordo-pink/backend-service-offline-notifications"
import { handleRequestSubscription } from "./handlers/request-subscription.handler"
import { handleConfirmSubscription } from "./handlers/confirm-subscription.handler"
import {
	ContentPersistenceStrategy,
	DataCommands,
	DataPersistenceStrategy,
	FSID,
} from "@ordo-pink/data"

export type CreateSubsServerFnParams = {
	constantDataOwner: FSID
	dataPersistenceStrategy: DataPersistenceStrategy
	contentPersistenceStrategy: ContentPersistenceStrategy<Readable>
	emailStrategy: EmailStrategy
	origin: string | string[]
	logger?: Logger
	websiteHost: string
	notificationSender: EmailContact
}

export const createSubsServer = async ({
	constantDataOwner,
	dataPersistenceStrategy,
	contentPersistenceStrategy,
	emailStrategy,
	origin,
	websiteHost,
	notificationSender: sender,
	logger = ConsoleLogger,
}: CreateSubsServerFnParams) => {
	const dataService = DataCommands.of({ dataPersistenceStrategy, contentPersistenceStrategy })
	const notificationService = NotificationService.of({ emailStrategy, websiteHost, sender })

	const ctx = { dataService, notificationService, constantDataOwner, websiteHost }

	return createServer({
		origin,
		logger,
		serverName: "sb",
		extendRouter: r =>
			r
				.post("/request-subscription", handleRequestSubscription(ctx))
				.post("/confirm-subscription", handleConfirmSubscription(ctx)),
	})
}
