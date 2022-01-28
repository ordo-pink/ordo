import { registerEventHandlers } from "../../common/register-ipc-main-handlers";
import { EditorEvent } from "./types";

import { Switch } from "or-else";
import { handleEnter } from "./key-handlers/enter";
import { handleTab } from "./key-handlers/tab";
import { handleTyping } from "./key-handlers/letters";
import { handleArrowUp } from "./key-handlers/arrow-up";
import { handleArrowLeft } from "./key-handlers/arrow-left";
import { handleArrowRight } from "./key-handlers/arrow-right";
import { handleArrowDown } from "./key-handlers/arrow-down";
import { handleBackspace } from "./key-handlers/backspace";
import { OpenOrdoFile } from "../../application/types";

export default registerEventHandlers<EditorEvent>({
	"@editor/on-key-down": ({ draft, payload, context }) => {
		const handle = Switch.of(payload.key)
			.case("Dead", (tab: OpenOrdoFile) => tab)
			.case("ArrowUp", handleArrowUp)
			.case("ArrowDown", handleArrowDown)
			.case("ArrowLeft", handleArrowLeft)
			.case("ArrowRight", handleArrowRight)
			.case("Enter", handleEnter)
			.case("Backspace", handleBackspace)
			.case("Tab", handleTab)
			.default(handleTyping);

		handle(draft.application.openFiles[draft.application.currentFile], payload);

		context.window.setDocumentEdited(true);
		if (!draft.application.unsavedFiles.includes(draft.application.currentFilePath)) {
			draft.application.unsavedFiles.push(draft.application.currentFilePath);
		}
	},
	"@editor/on-mouse-up": ({ draft, payload }) => {
		draft.application.openFiles[draft.application.currentFile].selection = payload;
	},
	"@editor/select-all": ({ draft }) => {
		const currentFile = draft.application.openFiles[draft.application.currentFile];
		currentFile.selection = {
			start: { line: 0, index: 0 },
			end: { line: currentFile.body.length - 1, index: currentFile.body[currentFile.body.length - 1].length - 1 },
			direction: "ltr",
		};
	},
});
