import { registerEventHandlers } from "../../common/register-ipc-main-handlers";
import { CommanderEvent } from "./types";

export default registerEventHandlers<CommanderEvent>({
	"@commander/get-items": ({ draft, payload, transmission: state }) => {
		const appCommands = state.get((s) => s.application.commands);
		draft.commander.items = appCommands.filter((c) => c.name.startsWith(payload || ""));
	},
	"@commander/show": ({ draft, transmission }) => {
		draft.commander.show = true;
		transmission.emit("@commander/get-items", "");
		transmission.emit("@application/set-focused-component", "commander");
	},
	"@commander/hide": ({ draft, transmission }) => {
		draft.commander.show = false;
		transmission.emit("@application/set-focused-component", "editor");
	},
	"@commander/run": ({ draft, payload, transmission }) => {
		draft.commander.show = false;
		transmission.emit(payload as keyof OrdoEvent);
	},
	"@commander/toggle": ({ transmission }) => {
		transmission.emit(transmission.get((s) => s.commander.show) ? "@commander/hide" : "@commander/show");
	},
});
