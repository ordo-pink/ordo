import { Optional } from "#lib/tau/mod"
import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook"

export const useAccelerator = (accelerator: Optional<string>, callback: HotkeyCallback) => {
	const hotkeys = accelerator ? accelerator.split("||") : []

	useHotkeys(
		hotkeys,
		(keyboardEvent, hotkeyEvent) => {
			keyboardEvent.stopPropagation()
			keyboardEvent.preventDefault()

			callback(keyboardEvent, hotkeyEvent)
		},
		{ enableOnFormTags: true }
	)
}
