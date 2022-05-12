import { OrdoEventHandler } from "@core/types";

export const handleCopyPath: OrdoEventHandler<"@file-explorer/copy-path"> = ({ transmission, payload, context }) => {
	const currentTab = transmission.select((state) => state.editor.currentTab);

	context.toClipboard(payload ? payload : currentTab);
};
