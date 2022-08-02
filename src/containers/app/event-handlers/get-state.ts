import { OrdoEventHandler } from "@core/types";

/**
 * Sends a snapshot of the backend state to the frontend for synchronisation.
 */
export const handleGetState: OrdoEventHandler<"@app/get-state"> = ({ context, transmission }) => {
	context.window.webContents.send(
		"@app/set-state",
		transmission.select((state) => state),
	);
};
