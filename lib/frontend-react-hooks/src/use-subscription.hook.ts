// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { Observable } from "rxjs/internal/Observable"

export const useSubscription = <T>(observable: Observable<T> | null): T | null => {
	const [state, setState] = useState<T | null>(null)

	useEffect(() => {
		if (!observable) return

		const subscription = observable.subscribe(value => setState(value))

		return () => subscription.unsubscribe()
	}, [observable])

	return state
}
