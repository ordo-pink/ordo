// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const try_oath = <$TResolve, $TReject = Error>(
	thunk: () => $TResolve,
	on_error = (error: unknown) =>
		error instanceof Error ? error : (new Error(String(error as any)) as any),
	abort_controller = new AbortController(),
): Oath<Awaited<$TResolve>, $TReject> => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	return new Oath(async (resolve, reject) => {
		try {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			resolve(await thunk())
		} catch (error) {
			reject(on_error(error))
		}
	}, abort_controller)
}
