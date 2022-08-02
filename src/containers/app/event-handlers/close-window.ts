import { BrowserWindow } from "electron";
import { Either } from "or-else";

import { OrdoEventHandler } from "@core/types";
import { noOpFn } from "@utils/no-op";

/**
 * Triggers closing currently focused window (if there is any).
 */
export const handleCloseWindow: OrdoEventHandler<"@app/close-window"> = () => {
	Either.fromNullable(BrowserWindow.getFocusedWindow()).fold(noOpFn, (window) => window.close());
};
