/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../../oath.types"
// import { from_promise } from "./from-promise.impl"

export const create: Oath.Constructors.Create = (fork, cancellation_reason) => {
	let reason: Oath.CancellationReason | undefined = cancellation_reason

	return {
		get is_cancelled() {
			return typeof reason === "string"
		},
		get is_oath() {
			return true as const
		},
		get reason() {
			return reason
		},

		cancel: r => void (reason = r),
		cata: boom =>
			new Promise((res, rej) =>
				fork(
					x => res(boom.resolve(x)),
					x => (boom.reject ? res(boom.reject(x) as any) : rej(x)),
				),
			),
		pipe: f => (reason ? (create(fork, reason) as any) : f(create(fork, reason) as any)),
	}
}
