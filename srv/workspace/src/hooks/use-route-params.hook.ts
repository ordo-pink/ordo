// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useSharedContext } from "@ordo-pink/frontend-core"

export const useRouteParams = <
	ExpectedRouteParams extends Record<string, string> = Record<string, string>,
>(): Partial<ExpectedRouteParams> => {
	const { route } = useSharedContext()

	return (route?.params ?? {}) as Partial<ExpectedRouteParams>
}
