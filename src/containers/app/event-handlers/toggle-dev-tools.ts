import { is } from "electron-util";

import { OrdoEventHandler } from "@core/types";
import { fromBoolean } from "@utils/either";
import { noOpFn } from "@utils/no-op";

/**
 * Triggers opening or closing dev tools. This action is only available if the application is in
 * development mode, and the process is run with a `--debug` option.
 */
export const handleToggleDevTools: OrdoEventHandler<"@app/toggle-dev-tools"> = ({ context }) => {
	fromBoolean(is.development)
		.chain(() => fromBoolean(!process.argv.includes("--debug")))
		.fold(noOpFn, () => context.window.webContents.toggleDevTools());
};
