// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook"
import { Either } from "@ordo-pink/either"

type UseAccelerator = (accelerator: string | undefined, callback: HotkeyCallback) => void

/**
 * Registers provided keyboard accelerator that is compatible with the Ordo notation.
 *
 * @type {UseAccelerator}
 *
 * @todo Add support for multiple accelerators
 * @todo Provide link to accelerator description
 */
export const useAccelerator: UseAccelerator = (accelerator, callback) => {
	const hotkeys = Either.fromNullable(accelerator).fold(() => [], renameToAppleOrNormalModifierKeys)

	useHotkeys(
		hotkeys,
		(keyboardEvent, hotkeyEvent) => {
			keyboardEvent.stopPropagation()
			keyboardEvent.preventDefault()

			callback(keyboardEvent, hotkeyEvent)
		},
		{
			enableOnFormTags: true,
			enableOnContentEditable: true,
			preventDefault: true,
		},
	)
}

// --- Internal ---

const isDarwin: boolean = navigator.appVersion.indexOf("Mac") !== -1

type RenameToAppleOrNormalModifierKeys = (accelerator: string) => string
const renameToAppleOrNormalModifierKeys: RenameToAppleOrNormalModifierKeys = accelerator => {
	const keys: string[] = accelerator.split("+")
	const newKeys: string[] = []

	if (keys.includes("mod")) newKeys.push(isDarwin ? "cmd" : "ctrl")
	if (keys.includes("meta")) newKeys.push(isDarwin ? "option" : "alt")
	if (keys.includes("ctrl") && isDarwin) newKeys.push("ctrl")
	if (keys.includes("shift")) newKeys.push("shift")

	newKeys.push(keys.at(-1)!)

	return newKeys.join("+")
}
