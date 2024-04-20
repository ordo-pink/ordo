// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const try0 = <Resolve, Reject = Error>(
	f: () => Resolve,
	abortController = new AbortController(),
): Oath<Awaited<Resolve>, Reject> => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	return new Oath(async (resolve, reject) => {
		try {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			resolve(await f())
		} catch (e) {
			reject(e instanceof Error ? e : (new Error(String(e)) as any))
		}
	}, abortController)
}
