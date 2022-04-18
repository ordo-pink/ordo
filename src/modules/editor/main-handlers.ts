import { Switch } from "or-else";

import { registerEventHandlers } from "@core/register-ipc-main-handlers";
import { EditorEvent } from "@modules/editor/types";
import { handleEnter } from "@modules/editor/key-handlers/enter";
import { handleTab } from "@modules/editor/key-handlers/tab";
import { handleTyping } from "@modules/editor/key-handlers/letters";
import { handleArrowUp } from "@modules/editor/key-handlers/arrow-up";
import { handleArrowLeft } from "@modules/editor/key-handlers/arrow-left";
import { handleArrowRight } from "@modules/editor/key-handlers/arrow-right";
import { handleArrowDown } from "@modules/editor/key-handlers/arrow-down";
import { handleBackspace } from "@modules/editor/key-handlers/backspace";
import { OpenOrdoFile } from "@modules/application/types";

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
