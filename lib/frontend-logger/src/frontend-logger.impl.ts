// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { callOnce } from "@ordo-pink/tau"

let logger = ConsoleLogger

export const __initLogger = callOnce((customLogger: Logger) => {
	logger = customLogger
})

export const getLogger = (fid: symbol | null): Logger => {
	const functionName = KnownFunctions.exchange(fid) ?? "unauthorized"

	return {
		panic: (...message) => logger.panic(`@${functionName} ::`, ...message),
		alert: (...message) => logger.alert(`@${functionName} ::`, ...message),
		crit: (...message) => logger.crit(`@${functionName} ::`, ...message),
		error: (...message) => logger.error(`@${functionName} ::`, ...message),
		warn: (...message) => logger.warn(`@${functionName} ::`, ...message),
		notice: (...message) => logger.notice(`@${functionName} ::`, ...message),
		info: (...message) => logger.info(`@${functionName} ::`, ...message),
		debug: (...message) => logger.debug(`@${functionName} ::`, ...message),
	}
}
