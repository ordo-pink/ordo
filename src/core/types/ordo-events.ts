import { AppEvents } from "@containers/app/types";
import { SideBarEvents } from "@containers/side-bar/types";
import { ActivityBarEvents } from "@modules/activity-bar/types";
import { EditorEvents } from "@modules/editor/types";
import { FileExplorerEvents } from "@modules/file-explorer/types";
import { TopBarEvents } from "@modules/top-bar/types";

export type OrdoEvent<TScope extends string = string, TEvent extends string = string, TPayload = null> = Record<
	`@${TScope}/${TEvent}`,
	TPayload
>;

export type OrdoEvents = FileExplorerEvents &
	AppEvents &
	SideBarEvents &
	ActivityBarEvents &
	TopBarEvents &
	EditorEvents;
