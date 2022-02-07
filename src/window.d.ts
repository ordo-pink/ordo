import type { ApplicationEvent } from "./application/types";
import type { ActivityBarEvent } from "./containers/activity-bar/types";
import type { CommanderEvent } from "./containers/commander/types";
import type { SidebarEvent } from "./containers/sidebar/types";
import type { WorkspaceEvent } from "./containers/workspace/types";
import type { EditorEvent } from "./components/editor/types";

declare global {
	interface Window {
		ordo: {
			emit: <K extends keyof OrdoEvent>(event: K, arg?: OrdoEvent[K]) => void;
		};
	}
	type OrdoEvent = ApplicationEvent & ActivityBarEvent & CommanderEvent & SidebarEvent & WorkspaceEvent & EditorEvent;
}
