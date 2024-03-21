// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const orNothing = <Resolve, Reject>(o: Oath<Resolve, Reject>) =>
	new Promise<Resolve>((resolve, reject) => {
		const handleAbort = () => {
			o._abortController.signal.removeEventListener("abort", handleAbort)
			reject(o.cancellationReason)
		}

		o._abortController.signal.addEventListener("abort", handleAbort)

		o.isCancelled ? reject(o.cancellationReason) : o._resolver(resolve as any, reject as any)
	}).catch(() => void 0)
