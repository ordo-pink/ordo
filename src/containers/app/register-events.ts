import { registerEvents } from "@core/transmission/register-ordo-events";
import { AppEvents } from "@containers/app/types";
import { handleGetState } from "@containers/app/event-handlers/get-state";
import { handleCloseWindow } from "@containers/app/event-handlers/close-window";
import { handleNewWindow } from "@containers/app/event-handlers/new-window";
import { handleReloadWindow } from "@containers/app/event-handlers/reload-window";
import { handleSelectProject } from "@containers/app/event-handlers/select-project";
import { handleToggleDevTools } from "@containers/app/event-handlers/toggle-dev-tools";
import { handleSetInternalSetting, hangleGetInternalSettings } from "@containers/app/event-handlers/internal-settings";
import { handleGetUserSettings, handleSetUserSetting } from "@containers/app/event-handlers/user-settings";
import { handleRegisterCommand } from "@containers/app/event-handlers/register-command";
import { handleRedo, handleUndo } from "@containers/app/event-handlers/undo-redo";

export default registerEvents<AppEvents>({
  "@app/get-state": handleGetState,
  "@app/close-window": handleCloseWindow,
  "@app/new-window": handleNewWindow,
  "@app/reload-window": handleReloadWindow,
  "@app/select-project": handleSelectProject,
  "@app/toggle-dev-tools": handleToggleDevTools,
  "@app/get-internal-settings": hangleGetInternalSettings,
  "@app/set-internal-setting": handleSetInternalSetting,
  "@app/get-user-settings": handleGetUserSettings,
  "@app/set-user-setting": handleSetUserSetting,
  "@app/register-command": handleRegisterCommand,
  "@app/undo": handleUndo,
  "@app/redo": handleRedo,
});
