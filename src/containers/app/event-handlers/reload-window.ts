import { OrdoEventHandler } from "@core/types";

/**
 * Triggers Electron browser window reload.
 */
export const handleReloadWindow: OrdoEventHandler<"@app/reload-window"> = ({ context }) => {
  context.window.reload();
};
