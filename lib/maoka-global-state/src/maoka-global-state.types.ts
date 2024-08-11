// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export type TStateHook = <K extends keyof MaokaState>(
	key: K,
	initial_value: MaokaState[K],
	options?: { autorefresh?: boolean },
) => [MaokaState[K], (previous_value: (value: MaokaState[K]) => MaokaState[K]) => void]

declare global {
	interface MaokaState {}
}
