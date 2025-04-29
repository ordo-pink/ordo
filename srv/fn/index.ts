import { RoutaryOrdo, default_handler } from "@ordo-pink/routary-ordo"
import { Logger } from "@ordo-pink/logger"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"
import { console_logger } from "@ordo-pink/logger"
import { oath } from "@ordo-pink/oath"
import { rickroll } from "@ordo-pink/rickroll"
import { routary } from "@ordo-pink/routary"

const logger: Logger = {
	alert: (...message) => console_logger.alert("[FN]", ...message),
	crit: (...message) => console_logger.crit("[FN]", ...message),
	debug: (...message) => console_logger.debug("[FN]", ...message),
	error: (...message) => console_logger.error("[FN]", ...message),
	info: (...message) => console_logger.info("[FN]", ...message),
	notice: (...message) => console_logger.notice("[FN]", ...message),
	panic: (...message) => console_logger.panic("[FN]", ...message),
	warn: (...message) => console_logger.warn("[FN]", ...message),
}

const rotor = routary
	.http<RoutaryOrdo.Fuel>({ logger, status: 200, headers: new Headers(), request_language: TWO_LETTER_LOCALE.ENGLISH })
	.get(
		"/",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "list")))),
	)
	.get(
		"/categories",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "categories")))),
	)
	.get(
		"/categories/:id",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "category")))),
	)
	.get(
		"/fns/:id",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "fn")))),
	)
	.put(
		"/fns/:id",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "upsert fn")))),
	)

const server = Bun.serve({
	port: process.env.ORDO_FN_PORT,
	fetch: rotor.start(() => rickroll),
})

logger.info(`server running on http://${server.hostname}:${server.port}`)
