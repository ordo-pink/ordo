// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Middleware } from "koa"
import { Readable } from "stream"
import { sendError, parseBody0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { TDataCommands, UserID } from "@ordo-pink/data"
import { TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { Oath } from "@ordo-pink/oath"
import isEmail from "validator/lib/isEmail"

type Body = { email?: string }
type Params = {
	dataService: TDataCommands<Readable>
	constantDataOwner: UserID
	notificationService: TNotificationService
	websiteHost: string
}
type Fn = (params: Params) => Middleware

export const handleRequestSubscription: Fn =
	({ notificationService, dataService, constantDataOwner, websiteHost }) =>
	ctx =>
		parseBody0<Body>(ctx, "object")
			.chain(({ email }) =>
				Oath.fromNullable(email)
					.map(email => isEmail(email))
					.bimap(
						() => HttpError.BadRequest("Invalid email"),
						() => email!,
					),
			)
			.chain(email =>
				dataService.contentPersistenceStrategy
					.read(constantDataOwner, email as any)
					.swap()
					.rejectedMap(() => HttpError.Conflict("Subscription already exists"))
					.map(() => crypto.getRandomValues(new Uint32Array(3)).join(""))
					.chain(code =>
						Oath.of({ email, isVerified: false, code })
							.map(JSON.stringify)
							.map(str => Readable.from([str]))
							.chain(content =>
								dataService.contentPersistenceStrategy
									.write(constantDataOwner, email as any, content)
									.map(() =>
										notificationService.sendSubscriptionConfirmationEmail({
											email,
											confirmationUrl: `${websiteHost}/confirm-email?code=${code}&email=${email}`,
										}),
									)
									.bimap(
										e => HttpError.from(new Error(e)),
										() => "OK",
									),
							),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
