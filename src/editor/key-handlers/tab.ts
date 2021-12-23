import { EditorOrdoFile } from "../../common/types";
import { ChangeKeys } from "../types";
import { moveCaretLeft } from "./common";
import { handleTyping } from "./letters";

export const handleTab = (change: EditorOrdoFile, keys: ChangeKeys): EditorOrdoFile => {
	if (keys.shiftKey) {
		if (change.body[change.selection.start.line].startsWith(" ")) {
			change.body[change.selection.start.line] = change.body[change.selection.start.line].slice(1);
			change = moveCaretLeft(change, keys, null, true);
		}

		return change;
	}

	keys.key = "\t";

	return handleTyping(change, keys);
};
