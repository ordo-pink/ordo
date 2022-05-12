import { OrdoEventHandler } from "@core/types";

export const handleRevealInFinder: OrdoEventHandler<"@file-explorer/reveal-in-finder"> = ({
	payload,
	context,
	transmission,
}) => {
	const currentTab = transmission.select((state) => state.editor.currentTab);

	context.showInFolder(payload ? payload : currentTab);
};
