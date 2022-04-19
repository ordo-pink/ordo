import { OrdoEvent } from "@core/types";

export type TopBarState = {
	focused: boolean;
	value: string;
};

export type TOP_BAR_SCOPE = "top-bar";

export type TopBarFocus = OrdoEvent<TOP_BAR_SCOPE, "focus">;
export type TopBarUnfocus = OrdoEvent<TOP_BAR_SCOPE, "unfocus">;
export type TopBarToggleFocus = OrdoEvent<TOP_BAR_SCOPE, "toggle-focus">;
export type TopBarSetValue = OrdoEvent<TOP_BAR_SCOPE, "set-value", string>;
export type TopBarOpenCommandPalette = OrdoEvent<TOP_BAR_SCOPE, "open-command-palette">;
export type TopBarOpenSearchInFile = OrdoEvent<TOP_BAR_SCOPE, "open-search-in-file">;
export type TopBarOpenGoToLine = OrdoEvent<TOP_BAR_SCOPE, "open-go-to-line">;
export type TopBarOpenGoToFile = OrdoEvent<TOP_BAR_SCOPE, "open-go-to-file">;
export type TopBarRunCommand = OrdoEvent<TOP_BAR_SCOPE, "run-command", string>;

export type TopBarEvents = TopBarFocus &
	TopBarUnfocus &
	TopBarToggleFocus &
	TopBarSetValue &
	TopBarOpenCommandPalette &
	TopBarOpenSearchInFile &
	TopBarOpenGoToLine &
	TopBarOpenGoToFile &
	TopBarRunCommand;
