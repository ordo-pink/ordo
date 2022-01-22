import { OpenOrdoFile, KeysDown } from "../types"
import { moveCaretLeft } from "./common"
import { handleTyping } from "./letters"

export const handleTab = (change: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	if (keys.shiftKey) {
		if (change.body[change.selection.start.line][0] === " ") {
			change.body[change.selection.start.line] = change.body[change.selection.start.line].slice(1)
			change = moveCaretLeft(change, keys, undefined, true)
		}

		return change
	}

	keys.key = "\t"

	return handleTyping(change, keys)
}
