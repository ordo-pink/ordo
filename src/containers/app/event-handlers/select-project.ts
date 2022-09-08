import { internalSettingsStore } from "@core/settings/internal-settings";
import { OrdoEventHandler } from "@core/types";

/**
 * Triggers an open folder dialog to open a new folder in the focused window.
 */
export const handleSelectProject: OrdoEventHandler<"@app/select-project"> = async ({
  draft,
  context,
  transmission,
}) => {
  const userInput = context.dialog.showOpenDialogSync({
    properties: ["openDirectory", "createDirectory", "promptToCreate"],
  });

  if (!userInput) return;

  const projectPath = userInput[0];
  const mostRecentProjects = getMostRecentProjects(projectPath);

  draft.app.currentProject = projectPath;
  context.addRecentDocument(projectPath);

  transmission.emit("@file-explorer/list-folder", projectPath);
  transmission.emit("@app/set-internal-setting", ["window.recentProjects", mostRecentProjects]);
};

const getMostRecentProjects = (currentProject: string) => {
  const previousProjects: string[] = internalSettingsStore.get("window.recentProjects");
  const recentProjects = [currentProject].concat(previousProjects);
  const filteredRecentProjects = Array.from(new Set(recentProjects));

  return filteredRecentProjects.slice(0, 5);
};
