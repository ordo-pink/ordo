import { OrdoEventHandler } from "@core/types";
import { createWindow } from "@core/window/create-window";

/**
 * Triggers creating a new window. This window exists completely separately from the other windows.
 */
export const handleNewWindow: OrdoEventHandler<"@app/new-window"> = createWindow;
