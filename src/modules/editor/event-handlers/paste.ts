import { OrdoEventHandler } from "@core/types";

export const handlePaste: OrdoEventHandler<"@editor/paste"> = ({ transmission, context }) => {
	const path = transmission.select((state) => state.editor.currentTab);
	const key = context.fromClipboard();

	transmission.emit("@editor/handle-typing", {
		path,
		event: {
			key,
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
		},
	});
};
