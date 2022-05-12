import { OrdoEventHandler } from "@core/types";

export const handleHideCreation: OrdoEventHandler<"@file-explorer/hide-creation"> = ({ draft }) => {
	draft.fileExplorer.createFileIn = "";
	draft.fileExplorer.createFolderIn = "";
};
