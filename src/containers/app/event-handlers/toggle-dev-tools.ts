import { is } from "electron-util";

import { OrdoEventHandler } from "@core/types";
import { CliOption } from "@core/cli-options";

/**
 * Triggers opening or closing dev tools. This action is only available if the application is in
 * development mode, and the process is run with a `--debug` option.
 */
export const handleToggleDevTools: OrdoEventHandler<"@app/toggle-dev-tools"> = ({ context }) => {
  const isDevelopmentMode = is.development && process.argv.includes(CliOption.DEBUG);

  if (isDevelopmentMode) {
    context.window.webContents.toggleDevTools();
  }
};
