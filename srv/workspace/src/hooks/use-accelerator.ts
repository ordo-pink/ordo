// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Optional } from "@ordo-pink/tau"
import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook"

const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

export const useAccelerator = (accelerator: Optional<string>, callback: HotkeyCallback) => {
	const hotkeys = accelerator
		? accelerator.split("||").map(hotkey => {
				const keys = hotkey.split("+")

				let key = ""

				if (keys.includes("mod")) key += isDarwin ? "cmd+" : "ctrl+"
				if (keys.includes("meta")) key += isDarwin ? "option+" : "alt+"
				if (keys.includes("ctrl")) key += "ctrl+"
				if (keys.includes("shift")) key += "shift+"

				key += keys.at(-1)

				return key
		  })
		: []

	return useHotkeys(
		hotkeys,
		(keyboardEvent, hotkeyEvent) => {
			keyboardEvent.stopPropagation()
			keyboardEvent.preventDefault()

			console.log("HERE")

			callback(keyboardEvent, hotkeyEvent)
		},
		{
			enableOnFormTags: true,
			enableOnContentEditable: true,
			preventDefault: true,
			scopes: "local",
		},
	)
}
