import { OrdoEvent } from "@core/types";

export type SIDEBAR_SCOPE = "sidebar";

export type ShowSidebarEvent = OrdoEvent<SIDEBAR_SCOPE, "show">;
export type HideSidebarEvent = OrdoEvent<SIDEBAR_SCOPE, "hide">;
export type ToggleSidebarEvent = OrdoEvent<SIDEBAR_SCOPE, "toggle">;
export type SetWidthSidebarEvent = OrdoEvent<SIDEBAR_SCOPE, "set-width", number>;
export type SetComponentSidebarEvent = OrdoEvent<SIDEBAR_SCOPE, "set-component", string>;

export type SidebarEvent = ShowSidebarEvent &
	HideSidebarEvent &
	ToggleSidebarEvent &
	SetWidthSidebarEvent &
	SetComponentSidebarEvent;

export type SidebarState = {
	width: number;
	component: string;
};
