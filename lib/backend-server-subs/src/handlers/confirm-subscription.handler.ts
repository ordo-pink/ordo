// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Middleware } from "koa"
import { Readable } from "stream"
import { sendError, parseBody0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { TDataCommands, UserID } from "@ordo-pink/data"
import { Subscriber } from "../backend-server-subs.types"

type Body = { email?: string; code?: string }
type Params = { dataService: TDataCommands<Readable>; constantDataOwner: UserID }
type Fn = (params: Params) => Middleware

export const handleConfirmSubscription: Fn =
	({ dataService, constantDataOwner }) =>
	ctx =>
		parseBody0<Body>(ctx, "object")
			.chain(({ email, code }) =>
				Oath.all({ email: Oath.fromNullable(email), code: Oath.fromNullable(code) }),
			)
			.chain(({ email, code }) =>
				dataService.contentPersistenceStrategy
					.read(constantDataOwner, email as any)
					.rejectedMap(() => HttpError.NotFound("Subscription not found"))
					.chain(readable =>
						Oath.from(
							() =>
								new Promise<string>((resolve, reject) => {
									readable.setEncoding("utf8")

									let data = ""

									readable
										.on("data", chunk => (data += chunk))
										.on("end", () => resolve(data))
										.on("error", error => reject(error))
								}),
						).rejectedMap(() => HttpError.InternalServerError("Something went wrong")),
					)
					.chain(data =>
						Oath.try(() => JSON.parse(data) as Subscriber).rejectedMap(() =>
							HttpError.InternalServerError("Something went wrong"),
						),
					)
					.chain(
						Oath.ifElse(sub => !sub.isVerified, {
							onFalse: () => HttpError.Conflict("Subscription already on"),
						}),
					)
					.chain(
						Oath.ifElse(sub => sub.code === code, {
							onFalse: () => HttpError.Conflict("Subscription not found"),
						}),
					)
					.map(sub => ({ email: sub.email, isVerified: true }))
					.map(JSON.stringify)
					.map(str => Readable.from([str]))
					.chain(content =>
						dataService.contentPersistenceStrategy
							.write(
								constantDataOwner,
								email as any,
								content,
								Number(ctx.req.headers["Content-Length"]),
							)
							.bimap(
								e => HttpError.from(new Error(e)),
								() => "Subscription verified",
							),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
