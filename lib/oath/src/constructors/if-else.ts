// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../impl.ts"
type TOathIfCata<$TResolve, $TReject> = { T?: () => $TResolve; F?: () => $TReject }

export const if_oath = <$TResolve = undefined, $TReject = undefined>(
	predicate: boolean,
	{
		T = () => void 0 as $TResolve,
		F = () => void 0 as $TReject,
	}: TOathIfCata<$TResolve, $TReject> = {
		T: () => void 0 as $TResolve,
		F: () => void 0 as $TReject,
	},
	abort_controller: AbortController = new AbortController(),
): Oath<$TResolve, $TReject> =>
	predicate ? Oath.Resolve(T(), abort_controller) : Oath.Reject(F(), abort_controller)
