import { InternalSettings, UserSettings } from "@core/settings/types";
import { AppState } from "./types";

const initialState: AppState = {
	internalSettings: {} as InternalSettings,
	userSettings: {} as UserSettings,
	currentProject: "",
	commands: [],
};

export default initialState;
