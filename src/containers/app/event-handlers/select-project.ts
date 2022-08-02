import { Either } from "or-else";

import { internalSettingsStore } from "@core/settings/internal-settings";
import { OrdoEventHandler } from "@core/types";
import { FoldVoid } from "@utils/either";
import { tap } from "@utils/functions";

/**
 * Triggers an open folder dialog to open a new folder in the focused window.
 */
export const handleSelectProject: OrdoEventHandler<"@app/select-project"> = async ({
	draft,
	context,
	transmission,
}) => {
	Either.fromNullable(
		context.dialog.showOpenDialogSync({
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		}),
	)
		.map(([path]) => path)
		.map(tap((path) => (draft.app.currentProject = path)))
		.map(tap((path) => transmission.emit("@file-explorer/list-folder", path)))
		.map(tap(context.addRecentDocument))
		.map((path) => [path].concat(internalSettingsStore.get("window.recentProjects")))
		.map((projects) => projects.slice(0, 5))
		.map((projects) => new Set(projects))
		.map(Array.from)
		.map((projects) => transmission.emit("@app/set-internal-setting", ["window.recentProjects", projects]))
		.fold(...FoldVoid);
};
