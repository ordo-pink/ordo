import { shell } from "electron";

import { OrdoEventHandler } from "@core/types";

export const handleOpenExternalLink: OrdoEventHandler<"@editor/open-external-link"> = ({ payload }) => {
	shell.openExternal(payload);
};
