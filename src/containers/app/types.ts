import { InternalSettings, UserSettings } from "@core/settings/types";
import { OrdoEvent, SupportedIcon } from "@core/types";
import { OrdoEvents } from "@init/types";

export type Command<TCustomEvents extends Record<string, any> | null = null> = {
	icon?: SupportedIcon;
	name: string;
	description: string;
	event: TCustomEvents extends null ? keyof OrdoEvents : TCustomEvents;
	accelerator: string;
};

export type AppState = {
	internalSettings: InternalSettings;
	userSettings: UserSettings;
	currentProject: string;
	commands: Command[];
};
export type APP_SCOPE = "app";

export type GetStateEvent = OrdoEvent<APP_SCOPE, "get-state">;
export type ReloadWindowEvent = OrdoEvent<APP_SCOPE, "reload-window">;
export type SelectProjectEvent = OrdoEvent<APP_SCOPE, "select-project">;
export type NewWindowEvent = OrdoEvent<APP_SCOPE, "new-window">;
export type CloseWindowEvent = OrdoEvent<APP_SCOPE, "close-window">;
export type ToggleDevToolsEvent = OrdoEvent<APP_SCOPE, "toggle-dev-tools">;
export type GetInternalSettingsEvent = OrdoEvent<APP_SCOPE, "get-internal-settings">;
export type SetInternalSettingEvent = OrdoEvent<APP_SCOPE, "set-internal-setting", [string, any]>;
export type GetUserSettingsEvent = OrdoEvent<APP_SCOPE, "get-user-settings">;
export type SetUserSettingEvent = OrdoEvent<APP_SCOPE, "set-user-setting", [string, any]>;
export type RegisterCommandEvent = OrdoEvent<APP_SCOPE, "register-command", Command>;

export type AppEvents = GetStateEvent &
	ReloadWindowEvent &
	SelectProjectEvent &
	NewWindowEvent &
	CloseWindowEvent &
	ToggleDevToolsEvent &
	GetInternalSettingsEvent &
	GetUserSettingsEvent &
	SetInternalSettingEvent &
	SetUserSettingEvent &
	RegisterCommandEvent;
