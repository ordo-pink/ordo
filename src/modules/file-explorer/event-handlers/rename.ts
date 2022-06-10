import { OrdoEventHandler } from "@core/types";

export const handleRename: OrdoEventHandler<"@file-explorer/rename"> = ({ draft, payload }) => {
	draft.fileExplorer.toRename = payload == null ? draft.editor.currentTab : payload;
};
