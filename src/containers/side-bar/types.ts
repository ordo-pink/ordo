import { OrdoEvent } from "@core/types";

export type SideBarState = {
	show: boolean;
	width: number;
};

export type SideBarSetWidthEvent = OrdoEvent<"side-bar", "set-width", number>;
export type SideBarToggleEvent = OrdoEvent<"side-bar", "toggle">;
export type SideBarShowEvent = OrdoEvent<"side-bar", "show">;
export type SideBarHideEvent = OrdoEvent<"side-bar", "hide">;

export type SideBarEvents = SideBarSetWidthEvent & SideBarToggleEvent & SideBarShowEvent & SideBarHideEvent;
